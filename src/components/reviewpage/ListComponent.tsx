import { ChangeEvent, useEffect, useRef, useState } from 'react';
import ListIcon from '../../icons/ListIcon';
import { useCommentContext } from './comment';
import Modal from '@ui/Modal';
import CloseIcon from '../../icons/CloseIcon';
import Textarea from '../Textarea';
import Button from '../Button';
import { RegisterReportFetch } from '../../apis/review';

interface ListBarComponentProps {
  handleEdit: (edit: boolean) => void;
}

const ListBarComponent = (props: ListBarComponentProps) => {
  const { handleEdit } = props;

  const { comment } = useCommentContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');
  const portalRef = useRef(null);
  const listRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
      const { result, message } = await RegisterReportFetch({
        commentId: comment._id,
        reason,
      });

      if (!result) {
        alert(message);
        return;
      }

      alert(message);
    } catch (e) {}
  };

  const handleEditReview = () => {
    handleEdit(true);
  };

  const handleDeleteReview = () => {};

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
        <Modal.Content className="z-4 top-[50%] bg-[#FDFDFD] shadow-2xl p-15">
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
                  placeholder="이 콘텐츠의 어떤 점이 좋거나 싫었는지 다른 사용자들에게 알려주세요. 고객님의 리뷰는 다른 사용자들에게 큰 도움이 됩니다."
                  className="w-full h-40 text-md resize-none focus:outline-none"
                  value={reason}
                  onChange={handleReport}
                />

                <p className="text-slate-400 text-sm float-right">
                  {reason.length}/200
                </p>
              </div>

              <Button className="mt-2 h-10" onClick={handleRegisterReport}>
                등록하기
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
