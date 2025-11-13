import { useCallback, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import useLoginRedirect from "../../utils/useLoginRedirect";
import { useNavigate } from "react-router-dom";


const useFavoriteToggle = (initialIsFavorite, goodsId) => {

  const {requireLogin} = useLoginRedirect();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [message, setMessage] = useState('');

  if (!goodsId) {
    console.error("useFavoriteToggle: goodsId is missing");
    return {
      isFavorite: false,
      toggleFavoriteHandler: () => {},
      message: "상품 ID가 유효하지 않습니다."
    }
  }

  const toggleFavoriteHandler = useCallback(async (e) => {
    console.log('찜 버튼 클릭', goodsId)
    // 상품 카드 전체 클릭 방지

    requireLogin(async () => {

      try {
        const response = await axiosInstance.post(`/favorite/${goodsId}`);

        if (response.data.ok) {
          const newFavoriteStatus = response.data.is_favorite;
          setIsFavorite(newFavoriteStatus);
          setMessage(response.data.message);

          if (newFavoriteStatus === true) {
            navigate('/mypage/favorite');
          }

        } else {
            setMessage("찜 처리 실패: " + response.data.message);
        }
        setTimeout(() => setMessage(''), 3000); // 팝업 메시지 3초 후 제거
      }
      catch (error) {
        console.error("찜 토글 오류:", error);
        setMessage("찜 상태 변경 중 서버 오류가 발생했습니다.");
        setTimeout(() => setMessage(''), 3000);
      }
    }, true)

    
  }, [goodsId, requireLogin, navigate]);

  return {
    isFavorite,
    toggleFavoriteHandler,
    message,
    setIsFavorite
  };
};

export default useFavoriteToggle;