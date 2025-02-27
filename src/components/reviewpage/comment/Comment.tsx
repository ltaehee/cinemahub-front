import { ChangeEvent, useState } from 'react';
import { useCommentContext } from '.';
import AspectRatio from '../AspectRatio';
import StarContainer from '../StarContainer';
import LikeComponent from '../LikeComponent';
import ListBarComponent from '../ListComponent';
import Textarea from '../../Textarea';
import Button from '../../Button';

const Comment = () => {
  const { comment } = useCommentContext();
  const [_, setStarRate] = useState(0);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editReview, setEditReview] = useState<string>(comment.content);
  // const [editImgUrls, setEditImgUrls] = useState<string[]>([]);
  // const [editStarpoint, setEditStarpoint] = useState<number>(comment.starpoint);

  const handleRating = (index: number) => {
    setStarRate(index);
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

  const handleEditReview = () => {
    // try {
    //   const { result, message } = await editReviewFetch({
    //     commentId: comment._id,
    //     imgUrls: editImgUrls,
    //     content: editReview,
    //     starpoint: editStarpoint,
    //   });
    //   if (!result) {
    //     alert(message);
    //     return;
    //   }
    //   alert(message);
    // } catch (e) {}
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <StarContainer
          handleRating={handleRating}
          defaultStar={comment.starpoint}
        />
        <ListBarComponent handleEdit={handleEdit} />
      </div>
      <div className="mt-2 flex gap-2">
        {comment.imgUrls.map((src, index) => (
          <div
            key={`image-src-${index}`}
            className="relative w-[150px] h-full rounded-[5px] border border-[#DDDDDD]"
          >
            <AspectRatio ratio={1 / 1}>
              <AspectRatio.Image
                className="w-full h-full"
                src={src}
                alt={'리뷰 사진'}
              />
            </AspectRatio>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-3">
        <div className="w-[36px]">
          <AspectRatio ratio={1 / 1}>
            <AspectRatio.Image
              className="rounded-[18px] w-full h-full"
              src={comment.userId.profile}
              alt={'리뷰 사진'}
            />
          </AspectRatio>
        </div>

        <p className="text-slate-400">{comment.userId.nickname}</p>
        <p className="text-slate-400">{comment.createdAt.split('T')[0]}</p>
      </div>

      {editMode ? (
        <div className="mt-2">
          <div className="px-3 py-5 rounded-md bg-[#F1F1F1] border border-[#BFBFBF]">
            <Textarea
              id="editreview"
              placeholder="이 콘텐츠의 어떤 점이 좋거나 싫었는지 다른 사용자들에게 알려주세요. 고객님의 리뷰는 다른 사용자들에게 큰 도움이 됩니다."
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
                onClick={handleEditReview}
              >
                수정하기
              </Button>
            </div>

            <div className="mt-2 w-30">
              <Button
                onClick={() => {
                  handleEdit(false);
                  setEditReview(comment.content);
                }}
              >
                취소
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <p
          className="mt-2"
          style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}
        >
          {comment.content}
        </p>
      )}

      <div className="mt-4">
        <LikeComponent />
      </div>
    </div>
  );
};

export default Comment;
