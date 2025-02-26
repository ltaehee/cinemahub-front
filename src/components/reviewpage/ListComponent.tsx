import { ChangeEvent, useRef, useState } from 'react';
import ListIcon from '../../icons/ListIcon';
import useLoginStore from '../../store/useStore';
import { useCommentContext } from './comment';
import Modal from '@ui/Modal';
import CloseIcon from '../../icons/CloseIcon';
import Textarea from '../Textarea';
import Button from '../Button';
import { RegisterReportFetch } from '../../apis/review';

const ListBarComponent = () => {
  const { comment } = useCommentContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');
  const portalref = useRef(null);
  const IsLogin = useLoginStore((set) => set.IsLogin);

  const IsOwner = comment.IsOwner;

  const handleReport = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value);
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

  return (
    <div>
      <Modal
        onCloseModal={handleModalClose}
        open={isModalOpen}
        onOpenModal={handleModalOpen}
        portalref={portalref.current}
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
                  {reason.length}/2000
                </p>
              </div>

              <Button className="mt-2 h-10" onClick={handleRegisterReport}>
                등록하기
              </Button>
            </div>
          </div>
        </Modal.Content>
      </Modal>

      <div className="relative" onClick={() => setIsOpen((prev) => !prev)}>
        <ListIcon />
      </div>
      {isOpen ? (
        <div className="absolute">
          {IsOwner ? (
            <div className="border">
              <button className="block">수정하기</button>
              <button className="block">삭제하기</button>
            </div>
          ) : (
            <div className="border">
              <button className="block" onClick={() => setIsModalOpen(true)}>
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
