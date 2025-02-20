import { ChangeEventHandler, useState } from 'react';
import StarContainer from '../components/reviewpage/StarContainer';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import AspectRatio from '../components/reviewpage/AspectRatio';
import Comment from '../components/reviewpage/Comment';
import { useLocation } from 'react-router-dom';

const reviewCount = 3000;
const registered = true;

const CinemaReviewPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const movieTitle = queryParams.get('movie');

  const [starRate, setStarRate] = useState(0);
  const [review, setReview] = useState<string>('');

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

  return (
    <>
      <div className="p-10 min-w-[480px] max-w-5xl mx-auto">
        <div className="p-10 bg-[#FBFBFB]">
          <div>
            <p className="text-3xl">영화제목</p>

            <div className="flex gap-5 mt-5 items-center justify-between">
              <div className="flex gap-5">
                <StarContainer handleRating={handleRating} defaultStar={0} />
                <p className="">{reviewCount}개 평점</p>
              </div>

              <p className="text-3xl font-bold">4.0</p>
            </div>

            <div className="mt-5 w-[240px]">
              <AspectRatio ratio={1 / 1}>
                <AspectRatio.Image src={''} alt={'영화 사진 사진'} />
              </AspectRatio>
            </div>
          </div>
          <div className="h-[1px] bg-slate-200 my-5"></div>

          {registered ? (
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

                <Button className="mt-2 h-10">등록하기</Button>
              </div>
            </div>
          ) : null}

          <div className="mt-5">
            <Comment />
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
