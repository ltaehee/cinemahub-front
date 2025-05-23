import { ChangeEvent, useEffect, useRef, useState } from 'react';
import ListIcon from '../../icons/ListIcon';
import { useCommentContext } from './comment';
import Modal from '@ui/Modal';
import CloseIcon from '../../icons/CloseIcon';
import Textarea from '../Textarea';
import Button from '../Button';
import { deleteReviewFetch, RegisterReportFetch } from '../../apis/review';
import ModalBackdrop from '@ui/Modal/ModalBackdrop';

interface ListBarComponentProps {
  handleEdit: (edit: boolean) => void;
}

const ListBarComponent = (props: ListBarComponentProps) => {
  const { handleEdit } = props;

  const { comment, setComments, setReviewInfo } = useCommentContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');
  const portalRef = useRef(null);
  const listRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [registerLoading, setRegisterLoading] = useState<boolean>(false);

  const IsOwner = comment.IsOwner;

  const handleReport = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.length > 200) {
      return;
    }
    setReason(value);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleRegisterReport = async () => {
    try {
      setRegisterLoading(true);
      const { result, message } = await RegisterReportFetch({
        commentId: comment._id,
        reason,
      });

      if (!result) {
        alert(message);
        return;
      }

      alert(message);
    } catch (e) {
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleEditReview = () => {
    handleEdit(true);
    setIsOpen(false);
  };

  const handleDeleteReview = async () => {
    try {
      const { result, message } = await deleteReviewFetch({
        commentId: comment._id,
      });

      if (!result) {
        alert(message);
        return;
      }
      alert(message);
      setComments?.((prev) => {
        return prev.filter(
          (review) => JSON.stringify(review._id) !== JSON.stringify(comment._id)
        );
      });

      setReviewInfo?.((prev) => {
        const length = prev.reviewLength;
        const score = Number(prev.reviewScore);
        const sum = Math.round(length * score);

        if (length > 1) {
          const newScore = (sum - comment.starpoint) / (length - 1);

          return {
            reviewLength: length - 1,
            reviewScore: newScore.toFixed(1),
          };
        } else {
          return {
            reviewLength: length - 1,
            reviewScore: '0',
          };
        }
      });
      setIsOpen(false);
    } catch (e) {}
  };

  const handleOutSideClick = (e: MouseEvent) => {
    if (
      listRef.current &&
      !listRef.current.contains(e.target as Node) &&
      contentRef.current &&
      !contentRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
      return;
    }
  };

  useEffect(() => {
    if (!listRef.current) {
      return;
    }
    if (!contentRef.current) {
      return;
    }

    if (isOpen) {
      window.addEventListener('click', handleOutSideClick);
    }

    return () => {
      window.removeEventListener('click', handleOutSideClick);
    };
  }, [isOpen, listRef, contentRef]);
  return (
    <div>
      <Modal
        onCloseModal={handleModalClose}
        open={isModalOpen}
        onOpenModal={handleModalOpen}
        portalref={portalRef.current}
      >
        <ModalBackdrop className="bg-black/70" />

        <Modal.Content className="z-4 bg-[#FDFDFD] shadow-2xl p-15" fixed>
          <Modal.Close>
            <CloseIcon className="absolute top-5 right-5" />
          </Modal.Close>
          <div>
            <label htmlFor="report" className="text-lg">
              리뷰 신고하기
            </label>

            <div className="mt-2">
              <div className="px-3 py-5 rounded-md bg-[#F1F1F1] border border-[#BFBFBF]">
                <Textarea
                  id="reason"
                  placeholder="관계없는 글(비방, 욕설, 광고, 잘못된 정보 등)을 신고해주시면, 관리자 확인 후 해당 리뷰의 노출이 제한될 수 있습니다. 타당한 사유 없이 허위 신고 시 신고자에 대한 활동 제한이 가해질 수 있으니, 신고 전에 신중하게 제고해 주시 기 바랍니다."
                  className="w-full h-40 text-md resize-none focus:outline-none"
                  value={reason}
                  onChange={handleReport}
                />

                <p className="text-slate-400 text-sm float-right">
                  {reason.length}/200
                </p>
              </div>

              <Button
                className="mt-2 h-10"
                onClick={handleRegisterReport}
                disabled={registerLoading}
              >
                {registerLoading ? (
                  <div className="flex justify-center items-center">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  '등록하기'
                )}
              </Button>
            </div>
          </div>
        </Modal.Content>
      </Modal>

      <div
        className="relative"
        ref={listRef}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <ListIcon />
      </div>
      {isOpen ? (
        <div className="absolute bg-[#EFEFEF]" ref={contentRef}>
          {IsOwner ? (
            <div>
              <button
                className="block text-black p-2 opacity-80 hover:bg-blue-500 hover:text-white"
                onClick={handleEditReview}
              >
                수정하기
              </button>
              <button
                className="block text-black p-2 opacity-80 hover:bg-red-500 hover:text-white"
                onClick={handleDeleteReview}
              >
                삭제하기
              </button>
            </div>
          ) : (
            <div>
              <button
                className="text-black
                p-2
                opacity-80
                hover:bg-red-500
                hover:text-white"
                onClick={() => setIsModalOpen(true)}
              >
                신고하기
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ListBarComponent;
