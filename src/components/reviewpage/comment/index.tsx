import { createContext, useContext } from 'react';
import Comment from './Comment';

type CommentType = {
  _id: string;
  userId: UserType;
  content: string;
  createdAt: string;
  imgUrls: string[];
  starpoint: number;
  like: boolean;
  dislike: boolean;
  totalLike: number;
  totalDisLike: number;
  IsOwner: boolean;
  deletedAt: string;
};

type UserType = {
  nickname: string;
  profile: string;
  _id: string;
};

export interface CommentContextType {
  comment: CommentType;
}

interface CommentProps {
  comments: CommentType[];
}

const CommentContext = createContext<CommentContextType>({
  comment: {
    _id: '',
    userId: {
      nickname: '',
      profile: '',
      _id: '',
    },
    content: '',
    createdAt: '',
    imgUrls: [],
    starpoint: 0,
    like: false,
    dislike: false,
    totalLike: 0,
    totalDisLike: 0,
    IsOwner: false,
    deletedAt: '',
  },
});

export const useCommentContext = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error('CommentContext에서 호출 가능');
  }
  return context;
};

const Comments = (props: CommentProps) => {
  const { comments } = props;

  return (
    <>
      {comments
        .filter(({ deletedAt }) => deletedAt !== null)
        .map((comment, index) => (
          <CommentContext.Provider key={index} value={{ comment }}>
            <Comment />
            <div className="h-[1px] bg-slate-200 my-5"></div>
          </CommentContext.Provider>
        ))}
    </>
  );
};

export default Comments;
