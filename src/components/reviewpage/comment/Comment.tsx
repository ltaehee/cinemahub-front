import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useCommentContext } from '.';
import AspectRatio from '../AspectRatio';
import StarContainer from '../StarContainer';
import LikeComponent from '../LikeComponent';
import ListBarComponent from '../ListComponent';
import Textarea from '../../Textarea';
import Button from '../../Button';
import useLoginStore from '../../../store/useStore';
import CloseIcon from '../../../icons/CloseIcon';
import CameraIcon from '../../../icons/CameraIcon';
import { getPresignedUrl, uploadImageToS3 } from '../../../apis/profile';
import { updateReviewFetch } from '../../../apis/review';

interface CommentProps {
  index: number;
  movieTitle?: string;
  moviePoster?: string;
  isProfilePage?: boolean;
}

const Comment = (props: CommentProps) => {
  const { index, movieTitle, moviePoster, isProfilePage } = props;
  const IsLogin = useLoginStore((set) => set.IsLogin);

  const { comment, setComments, setReviewInfo } = useCommentContext();

  const [editMode, setEditMode] = useState<boolean>(false);
  const [editReview, setEditReview] = useState<string>(comment.content);
  const [editStarpoint, setEditStarpoint] = useState<number>(comment.starpoint);
  const [editImgUrls, setEditImgUrls] = useState<string[]>(comment.imgUrls);

  const [updateLoading, setUpdateLoading] = useState<boolean>(false);

  const [files, setFiles] = useState<File[]>([]);
  const [__, setimgUrls] = useState<string[]>([]);

  const uploadRef = useRef<HTMLInputElement>(null);

  const SingleFileReader = async (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        try {
          resolve(fileReader.result);
        } catch (err) {
          if (err instanceof Error) {
            reject(new Error(err.message));
          }
        }
      };
    });
  };

  const handleFilePreview = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (typeof files === 'object' && files !== null && files.length <= 2) {
      const filesArr = Array.from(files);
      setFiles((prev) => [...prev, ...filesArr]);

      for (const file of filesArr) {
        const src = await SingleFileReader(file);
        setEditImgUrls((prev) => [...prev, `${src}`]);
      }
    }
  };

  const handleFileUpload = async () => {
    let imgUrls = [];

    if (files.length !== 0) {
      for (const file of files) {
        const presignedUrl = await getPresignedUrl(file.name);
        await uploadImageToS3(presignedUrl, file);
        const imgUrl = presignedUrl.split('?')[0];
        imgUrls.push(imgUrl);
      }
    }
    return imgUrls;
  };

  const handleResetFileValue = () => {
    if (uploadRef.current) {
      console.log(uploadRef.current.value);
      uploadRef.current.value = '';
      return;
    }
  };

  const handleRemovePreview = (targetIndex: number) => {
    setEditImgUrls(editImgUrls.filter((_, index) => index !== targetIndex));
    setFiles(files.filter((_, index) => index !== targetIndex));
  };

  const handleRating = (index: number) => {
    setEditStarpoint(index);
  };

  const handleEdit = (edit: boolean) => {
    setEditMode(edit);
  };

  const handleEditReviewInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.length > 2000) {
      return;
    }
    setEditReview(value);
  };

  const handleEditReview = async () => {
    try {
      setUpdateLoading(true);

      if (files.length !== 0) {
        const imgUrls = await handleFileUpload();
        setimgUrls(imgUrls);
      }

      const { result, message } = await updateReviewFetch({
        commentId: comment._id,
        imgUrls: editImgUrls,
        content: editReview,
        starpoint: editStarpoint,
      });
      if (!result) {
        alert(message);
        return;
      }
      alert(message);

      setComments?.((prev) => {
        return prev.map((review) =>
          JSON.stringify(review._id) === JSON.stringify(comment._id)
            ? {
                ...review,
                imgUrls: editImgUrls,
                content: editReview,
                starpoint: editStarpoint,
              }
            : review
        );
      });

      setReviewInfo?.((prev) => {
        const length = prev.reviewLength;
        const score = Number(prev.reviewScore);
        const sum = Math.round(length * score);

        const newScore = (sum - comment.starpoint + editStarpoint) / length;
        return {
          ...prev,
          reviewScore: newScore.toFixed(1),
        };
      });

      setEditMode(false);
      setFiles([]);
      setimgUrls([]);
    } catch (e) {
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    if (!uploadRef.current) {
      return;
    }
  }, []);

  return (
    <div className="flex gap-10 items-stretch">
      {/* 영화 포스터 & 제목 */}
      {movieTitle && moviePoster && (
        <div className="flex flex-col items-center rounded-md overflow-hidden bg-white w-[235px]">
          <img
            src={moviePoster}
            alt="영화제목"
            className="w-full object-cover"
          />

          <div className="w-full bg-white py-2 px-3">
            <p className="text-lg text-center font-semibold text-black">
              {movieTitle}
            </p>
          </div>
        </div>
      )}

      {/* 리뷰 내용 영역 */}
      <div
        className={`flex-1 rounded-md ${
          isProfilePage ? 'bg-white p-5' : 'bg-[#F8F9FA]'
        } flex flex-col justify-between min-h-[250px]`}
      >
        {/* 신고된 리뷰 알림 */}
        {comment.reportstatus ? (
          <div className="w-[60px] text-center bg-red-400 text-white rounded-md">
            신고됨
          </div>
        ) : null}

        {/* 작성자 정보 & 날짜 */}
        <div className="mt-2 flex items-center justify-between gap-3">
          <div
            className={`flex items-center ${isProfilePage ? 'gap-0' : 'gap-3'}`}
          >
            {!isProfilePage && (
              <div className="w-[36px]">
                <AspectRatio ratio={1 / 1}>
                  <AspectRatio.Image
                    className="rounded-[18px] w-full h-full"
                    src={comment.userId.profile}
                    alt="프로필 이미지"
                  />
                </AspectRatio>
              </div>
            )}

            <p className="text-slate-400">{comment.userId.nickname}</p>
            <p className="text-slate-400">{comment.createdAt.split('T')[0]}</p>
          </div>

          {comment.reportstatus && !comment.IsOwner ? null : (
            <ListBarComponent handleEdit={handleEdit} />
          )}
        </div>

        {/* 별점 */}
        <div className="flex items-center justify-between mt-5">
          {editMode ? (
            <StarContainer
              starRate={editStarpoint}
              handleRating={handleRating}
              defaultStar={0}
            />
          ) : (
            <StarContainer
              handleRating={handleRating}
              defaultStar={comment.starpoint}
            />
          )}
        </div>

        {/* 리뷰 이미지 */}
        <div className="mt-5 flex gap-2">
          {editMode ? (
            <>
              {IsLogin ? (
                <div className="w-full h-full">
                  <div className="flex gap-2">
                    {editImgUrls.map((src, index) => (
                      <div
                        key={`image-src-${index}`}
                        className="relative w-[180px] h-[180px] rounded-[5px] border border-[#DDDDDD]"
                      >
                        <AspectRatio ratio={1 / 1}>
                          <AspectRatio.Image
                            className="w-full h-full object-cover rounded-md"
                            src={src}
                            alt="리뷰 사진"
                          />
                        </AspectRatio>

                        <div
                          onClick={() => handleRemovePreview(index)}
                          className="absolute w-[12px] top-1 right-1 cursor-pointer"
                        >
                          <CloseIcon width="100%" height="100%" />
                        </div>
                      </div>
                    ))}

                    {editImgUrls.length < 2 ? (
                      <label
                        htmlFor={`fileupdate${index}`}
                        className="block border border-[#DDDDDD] w-[180px] h-[180px] rounded-[5px] hover:bg-[#BDBDBD] cursor-pointer"
                      >
                        <CameraIcon width="100%" height="100%" />
                      </label>
                    ) : null}
                  </div>

                  <input
                    ref={uploadRef}
                    style={{ display: 'none' }}
                    type="file"
                    name={`fileupdate${index}`}
                    id={`fileupdate${index}`}
                    accept="image/*"
                    onChange={handleFilePreview}
                    onClick={handleResetFileValue}
                    multiple
                  />
                </div>
              ) : null}
            </>
          ) : (
            <>
              {comment.imgUrls.length > 0
                ? comment.imgUrls.map((src, index) => (
                    <div
                      key={`image-src-${index}`}
                      className="relative w-[180px] h-[180px] rounded-[5px] border border-[#DDDDDD]"
                    >
                      <AspectRatio ratio={1 / 1}>
                        <AspectRatio.Image
                          className="w-full h-full object-cover rounded-md"
                          src={src}
                          alt="리뷰 사진"
                        />
                      </AspectRatio>
                    </div>
                  ))
                : isProfilePage && (
                    <div className="min-h-[180px] flex items-center justify-center text-gray-400">
                      이미지가 없습니다
                    </div>
                  )}
            </>
          )}
        </div>

        {/* 리뷰 텍스트 */}
        <div className="mt-2 flex-grow">
          {editMode ? (
            <div>
              <div className="px-3 py-5 rounded-md bg-[#F1F1F1] border border-[#BFBFBF]">
                <Textarea
                  id="editreview"
                  placeholder="이 콘텐츠의 어떤 점이 좋거나 싫었는지 다른 사용자들에게 알려주세요."
                  className="w-full h-40 text-md resize-none focus:outline-none"
                  value={editReview}
                  onChange={handleEditReviewInput}
                />

                <p className="text-slate-400 text-sm float-right">
                  {editReview.length}/2000
                </p>
              </div>

              <div className="flex justify-end gap-10">
                <div className="mt-2 w-30">
                  <Button
                    className="bg-blue-300 hover:bg-blue-500"
                    disabled={updateLoading}
                    onClick={handleEditReview}
                  >
                    {updateLoading ? (
                      <div className="flex justify-center items-center">
                        <div className="w-6 h-6 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      '수정하기'
                    )}
                  </Button>
                </div>

                <div className="mt-2 w-30">
                  <Button
                    onClick={() => {
                      handleEdit(false);
                      setEditReview(comment.content);
                      setEditImgUrls(comment.imgUrls);
                      setEditStarpoint(comment.starpoint);
                    }}
                  >
                    취소
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-2 break-words whitespace-pre-wrap text-black">
              {comment.reportstatus && !comment.IsOwner ? (
                <div className="text-red-500">신고된 리뷰글 입니다.</div>
              ) : (
                comment.content
              )}
            </div>
          )}
        </div>

        {comment.reportstatus && !comment.IsOwner ? null : (
          <div className="mt-4">
            <LikeComponent />
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
