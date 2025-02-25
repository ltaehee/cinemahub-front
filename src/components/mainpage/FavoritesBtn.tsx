import { SVGAttributes, useEffect, useState } from "react";
import useLoginStore from "../../store/useStore";
import {
  addFavoriteAPI,
  checkFavoriteAPI,
  removeFavoriteAPI,
} from "../../apis/profile";

interface FavoritesProps extends SVGAttributes<SVGSVGElement> {
  favoriteType: string;
  favoriteId: string;
}

const FavoritesBtn = ({
  favoriteType,
  favoriteId,
  ...svgsProps
}: FavoritesProps) => {
  const { IsLogin } = useLoginStore();
  const [isFavorite, setIsFavorite] = useState<boolean>();

  // 즐겨찾기 상태 확인
  const checkFavorite = async () => {
    try {
      const response = await checkFavoriteAPI(favoriteType, favoriteId);
      setIsFavorite(response.isFavorite);
    } catch (error) {
      alert("즐겨찾기 상태 확인 실패");
    }
  };

  // 즐겨찾기 추가
  const addFavorite = async () => {
    try {
      await addFavoriteAPI(favoriteType, favoriteId);
      setIsFavorite(true);
    } catch (error) {
      alert("즐겨찾기 추가 실패");
    }
  };

  // 즐겨찾기 삭제
  const removeFavorite = async () => {
    try {
      await removeFavoriteAPI(favoriteType, favoriteId);
      setIsFavorite(false);
    } catch (error) {
      alert("즐겨찾기 삭제가 실패");
    }
  };
  // 좋아요 상태 토글 함수
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // 버튼 눌러도 페이지 이동안하게
    if (!IsLogin) {
      alert("로그인이 필요합니다.");
      return;
    }
    // 현재 상태에 따라 추가 또는 삭제
    isFavorite ? removeFavorite() : addFavorite();
  };

  useEffect(() => {
    if (IsLogin) {
      checkFavorite();
    }
  }, [IsLogin]);

  return (
    <svg
      onClick={toggleFavorite}
      width="39"
      height="39"
      viewBox="0 0 39 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...svgsProps}
    >
      <circle cx="19.5" cy="19.5" r="19.5" fill="white" />
      <path
        d="M14.875 12C13.5344 12 12.34 12.5606 11.4381 13.4381C10.5606 14.3156 10 15.51 10 16.875C10 18.2156 10.5606 19.41 11.4381 20.3119L19.75 28.6238L28.0619 20.3119C28.9394 19.4344 29.5 18.24 29.5 16.875C29.5 15.5344 28.9394 14.34 28.0619 13.4381C27.1844 12.5606 25.99 12 24.625 12C23.2844 12 22.09 12.5606 21.1881 13.4381C20.3106 14.3156 19.75 15.51 19.75 16.875C19.75 15.5344 19.1894 14.34 18.3119 13.4381C17.4344 12.5606 16.24 12 14.875 12Z"
        fill={isFavorite ? "red" : "gray"}
      />
    </svg>
  );
};

export default FavoritesBtn;
