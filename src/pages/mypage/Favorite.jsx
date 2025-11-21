import { useNavigate } from "react-router-dom";
import useLoginRedirect from "../../utils/useLoginRedirect";
import { useEffect, useState } from "react";
import "../../styles/Mypage.css";
import requestHandler from "../../utils/requestHandler";
import LoadingSpinner from "../../utils/LoadingSpinner";

const Favorite = () => {

  const { requireLogin } = useLoginRedirect();
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorite = async () => {

    requireLogin(async () => {
      await requestHandler({
        method:"get",
        url:"/favorite/list",
        setLoading,
        onSuccess:(data) => {
          if (data && Array.isArray(data.favorites)){
            setFavorites(data.favorites);
          } else if (data && Array.isArray(data)){
            setFavorites(data);
          } else {
            setFavorites([]);
          }
          setError(null);
        },
        onError: (msg, err) => {
          console.error("찜 목록 로딩 오류: ", err);
          setError(msg || "찜 목록을 불러오는 데 실패했습니다.");
          setFavorites([]);
        }
      })
    }, true)
  }

  useEffect(() => {
      document.title = 'Medi.Check! | 찜';
    }, [])

  useEffect(() => {
    fetchFavorite();
  }, [setLoading, setFavorites, setError])

  if (loading) return <LoadingSpinner label="찜 목록을 불러오는 중..." />
  if (error) return <div className="error-message">{error}</div>

  return(
    <>
    <div className="favorite-list-container">
      <h3 className="favorite-list-title">찜 목록 ({favorites.length}개)</h3>

      {favorites.length === 0 ? (
        <div className="no-favorites">
          <p>아직 찜한 상품이 없습니다. 마음에 드는 상품을 찜해보세요!</p>
          <button 
            onClick={() => navigate('/store/allgoods')}
            className='go-to-store-btn'>
            스토어 바로가기
          </button>
        </div>
      ) : (
        <div className="favorite-grid">
          {favorites.map(item => (
            <div 
              key={item.id} 
              className="favorite-card"
              onClick={() => navigate(`/store/detail/${item.id}`)}>
              <div className="favorite-image">
                <img src={item.image_path || 'placeholder.png'} alt={item.goods_name} />  
              </div>
              <div className="favorite-info">
                <div className="favorite-name">{item.goods_name}</div>  
                <div className="favorite-price">{item.price ? item.price.toLocaleString() : '가격 미정'}원</div>
              </div>
              <div className="favorite-actions">
                <button className="add-to-cart-small-btn" onClick={(e) => {
                  e.stopPropagation(); console.log('장바구니');
                }}>장바구니</button>
                <button className="buy-now-small-btn" onClick={(e) => { 
                  e.stopPropagation(); console.log('바로구매'); }}>바로구매
                </button>
              </div>  
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  )
}

export default Favorite;