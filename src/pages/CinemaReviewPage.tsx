import { ChangeEvent, ChangeEventHandler, useEffect, useState } from 'react';
import StarContainer from '../components/reviewpage/StarContainer';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import AspectRatio from '../components/reviewpage/AspectRatio';

import {
  getMovieidCommentArrayFetch,
  RegisterReviewFetch,
} from '../apis/review';
import useLoginStore from '../store/useStore';
import { emptyChecker } from '../util/emptyCheck';
import CloseIcon from '../icons/CloseIcon';
import CameraIcon from '../icons/CameraIcon';
import Comments from '../components/reviewpage/comment';

const reviewCount = 3000;
const movieTitle = '영화제목';
const movieId = '1';
const image = 'image';

type Review = {
  movieId: string;
  image: string;
  content: string;
  starpoint: number;
};

type CommentType = {
  userId: UserType;
  content: string;
  createdAt: string;
  image: string;
  starpoint: number;
  totalLike: number;
  totalUnlike: number;
  like: boolean;
  dislike: boolean;
};

type UserType = {
  nickname: string;
  profile: string;
  _id: string;
};

const CinemaReviewPage = () => {
  const IsLogin = useLoginStore((set) => set.IsLogin);

  const [comments, setComments] = useState<CommentType[]>([]);
  const [starRate, setStarRate] = useState(0);
  const [review, setReview] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [imageSrcs, setImageSrcs] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string[]>([]);

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

  const handleFilePreview = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (typeof files === 'object' && files !== null && files.length <= 1) {
      const filesArr = Array.from(files);
      setFiles(filesArr);
      filesArr.forEach(async (file) => {
        const src = await SingleFileReader(file);
        setImageSrcs((prev) => [...prev, `${src}`]);
      });
    }
  };

  const handleRemovePreview = (targetIndex: number) => {
    setImageSrcs((prev) => prev.filter((_, index) => index !== targetIndex));
    setFiles((prev) => prev.filter((_, index) => index !== targetIndex));
  };

  // const handleFileUpload = () => {
  //   if (files.length !== 0) {
  //     files.forEach(async (file) => {
  //       const imgUrl = await S3FileUploadInstance(file);
  //       setImageUrl((prev) => [...prev, imgUrl]);
  //     });
  //   }
  // };

  const handleReviewInput: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const { value } = e.target;
    if (value.length > 2000) {
      return;
    }
    setReview(value);
  };

  const handleRating = (index: number) => {
    setStarRate(index);
  };

  const handleRegisterReview = async ({
    movieId,
    image,
    content,
    starpoint,
  }: Review) => {
    if (emptyChecker({ movieId, image, content, starpoint })) {
      alert('별점과 리뷰 내용을 적어주세요.');
      return;
    }
    try {
      const { result, data, message } = await RegisterReviewFetch({
        movieId,
        image,
        content,
        starpoint,
      });

      if (!result) {
        throw new Error(message);
      }

      alert(message);
    } catch (e) {}
  };

  const handleGetComments = async () => {
    try {
      const { result, data, message } = await getMovieidCommentArrayFetch({
        movieId,
      });

      if (!result) {
        throw new Error(message);
      }
      setComments(data);
      alert(message);
    } catch (e) {}
  };

  useEffect(() => {
    handleGetComments();
  }, []);

  return (
    <>
      <div className="p-10 min-w-[480px] max-w-5xl mx-auto">
        <div className="p-10 bg-[#FBFBFB]">
          <div>
            <p className="text-3xl">{movieTitle}</p>
            <div className="flex gap-5 mt-5 items-center justify-between">
              <div className="flex gap-5">
                <StarContainer handleRating={handleRating} defaultStar={0} />
                <p className="">{reviewCount}개 평점</p>
              </div>

              <p className="text-3xl font-bold">4.0</p>
            </div>

            {IsLogin ? (
              <div className="mt-5 w-[480px]">
                <div className="flex gap-5">
                  {imageSrcs.map((src, index) => (
                    <div
                      key={`image-src-${index}`}
                      className="relative w-[198px] h-[198px] rounded-[5px] border border-[#DDDDDD]"
                    >
                      <AspectRatio ratio={1 / 1}>
                        <AspectRatio.Image
                          className="w-full h-full"
                          src={src}
                          alt={'영화 사진 사진'}
                        />
                      </AspectRatio>

                      <div
                        onClick={() => handleRemovePreview(index)}
                        className="absolute w-[12px] top-1 right-1"
                      >
                        <CloseIcon width={'100%'} height={'100%'} />
                      </div>

                      <div className="absolute top-0 right-0 z-1" />
                    </div>
                  ))}

                  {imageSrcs.length < 1 ? (
                    <label
                      htmlFor="fileInput"
                      className="block border border-[#DDDDDD] px-[80px] py-[80px] rounded-[5px] hover:bg-[#BDBDBD] cursor-pointer"
                    >
                      <div className="w-[36px] h-[36px]">
                        <CameraIcon width={'100%'} height={'100%'} />
                      </div>
                    </label>
                  ) : null}
                </div>

                <input
                  style={{ display: 'none' }}
                  type="file"
                  name="fileInput"
                  id="fileInput"
                  accept="image/*"
                  onChange={handleFilePreview}
                  multiple
                />
              </div>
            ) : null}
          </div>

          <div className="h-[1px] bg-slate-200 my-5"></div>

          {IsLogin ? (
            <div>
              <label htmlFor="review" className="text-lg">
                리뷰 작성하기
              </label>

              <div className="mt-2">
                <div className="px-3 py-5 rounded-md bg-[#F1F1F1] border border-[#BFBFBF]">
                  <Textarea
                    id="review"
                    placeholder="이 콘텐츠의 어떤 점이 좋거나 싫었는지 다른 사용자들에게 알려주세요. 고객님의 리뷰는 다른 사용자들에게 큰 도움이 됩니다."
                    className="w-full h-40 text-md resize-none focus:outline-none"
                    value={review}
                    onChange={handleReviewInput}
                  />

                  <p className="text-slate-400 text-sm float-right">
                    {review.length}/2000
                  </p>
                </div>

                <Button
                  className="mt-2 h-10"
                  onClick={() =>
                    handleRegisterReview({
                      movieId,
                      image,
                      content: review,
                      starpoint: starRate,
                    })
                  }
                >
                  등록하기
                </Button>
              </div>
            </div>
          ) : null}

          <div className="mt-5">
            <Comments comments={comments} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CinemaReviewPage;

{
  /* <Modal
  onCloseModal={handleCloseModal}
  onOpenModal={handleOpenModal}
  open={open}
>
  <ModalTrigger className=""></ModalTrigger>
  <ModalContent className="">
    <ModalClose>
      <CloseIcon className="" />
    </ModalClose>
  </ModalContent>
</Modal>; */
}

// import Modal from '@ui/Modal';
// import ModalBackdrop from '@ui/Modal/ModalBackdrop';
// import ModalClose from '@ui/Modal/ModalClose';
// import ModalTrigger from '@ui/Modal/ModalTrigger';
// import ModalContent from '@ui/Modal/ModalContent';
// import CloseIcon from '../icons/CloseIcon';

// const [open, setOpen] = useState<boolean>(false);

// const handleOpenModal = () => {
//   setOpen(true);
// };
// const handleCloseModal = () => {
//   setOpen(false);
// };
