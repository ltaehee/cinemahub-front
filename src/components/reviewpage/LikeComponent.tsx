import { useEffect, useState } from 'react';
import LikeIcon from '../../icons/LikeIcon';
import UnlikeIcon from '../../icons/UnlikeIcon';

type likesType = {
  like: boolean;
  unlike: boolean;
};

const defaultLikes = {
  like: false,
  unlike: false,
};

const LikeComponent = () => {
  const [recomm, setRecomm] = useState<boolean>(false);
  const [likes, setLikes] = useState<likesType>(defaultLikes);

  const handleLikeUnLike = (type: string) => {
    switch (type) {
      case 'like':
        setLikes((prev) => ({ ...prev, like: true, unlike: false }));
        return;
      case 'unlike':
        setLikes((prev) => ({ ...prev, like: false, unlike: true }));
        return;
      default:
        return;
    }
  };

  useEffect(() => {
    setLikes((prev) => ({ ...prev, like: true, unlike: false }));
  }, []);

  return (
    <>
      <div className="flex gap-3">
        <div
          className={`flex items-center gap-2 ${
            likes.like ? `bg-[#FF0000]` : `bg-[#D1D1D1] hover:bg-[#BDBDBD]`
          } p-[8px] rounded-[5px] transition`}
          onClick={() => handleLikeUnLike('like')}
        >
          <LikeIcon recomm={false} />
          <span>{10}</span>
        </div>
        <div
          className={`flex items-center gap-2 ${
            likes.unlike ? `bg-[#FF0000]` : `bg-[#D1D1D1] hover:bg-[#BDBDBD]`
          } p-[8px] rounded-[5px] transition`}
          onClick={() => handleLikeUnLike('unlike')}
        >
          <UnlikeIcon recomm={false} />
          <span>{10}</span>
        </div>
      </div>
    </>
  );
};

export default LikeComponent;
