import { useCallback, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const currentUserId = 1;

const useFavoriteToggle = (initialIsFavorite, goodsId) => {

  if (!goodsId) {
    console.error("useFavoriteToggle: goodsId is missing");
    return {
      isFavorite: false,
      toggleFavoriteHandler: () => {},
      message: "상품 ID가 유효하지 않습니다."
    }
  }

  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [message, setMessage] = useState('');

  const favoriteToggleHandler = useCallback(async (event) => {
    // 상품 카드 전체 클릭 방지
    if(event) {
      event.stopPropagation();
    }

    if(!currentUserId){
      console.warn("로그인이 필요합니다.");
      setMessage("로그인이 필요한 기능입니다.");
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      const response = await axiosInstance.post(`/favorite/${goodsId}`);

      if (response.data.ok) {
        const newFavoriteStatus = response.data.is_favorite;
        setIsFavorite(newFavoriteStatus);
        setMessage(response.data.message);
      } else {
        setMessage("찜 처리 실패: " + response.data.message);
      }
      setTimeout(() => setMessage(''), 3000);
    }
    catch (error) {
      console.error("찜 토글 오류:", error);
      setMessage("찜 상태 변경 중 서버 오류가 발생했습니다.");
      setTimeout(() => setMessage(''), 3000);
    }
  }, [goodsId]);

  return {
    isFavorite,
    favoriteToggleHandler,
    message,
    setIsFavorite
  };
};

export default useFavoriteToggle;