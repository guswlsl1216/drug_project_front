import { useCallback, useEffect, useState } from "react";
import "../../styles/Store.css";
import useFavoriteToggle from "../../pages/store/usefavoriteToggle";
import UseNavi from "../../utils/UseNavi";
import requestHandler from "../../utils/requestHandler";
import Pagination from "../ui/Pagination";


const ProductCard = ({ product, sortKey, ProductHandler }) => {
  const goodsId = product && product.id;

  // 초기 찜 상태는 product.is_favorite을 사용합니다.
  const { isFavorite, toggleFavoriteHandler, message } = useFavoriteToggle(
    product.is_favorite || false, // 초기 찜 상태
    goodsId
  ); 

  return (
    <div className="product-card">
            
      {/* 팝업 메시지 (카드에 오버레이) */}
      {message && (
          <div className="message-popup is-card-message">
            {message}
          </div>
      )}
            
      {/* 찜 버튼 위치 (이미지 영역에 오버레이) */}
      <div className="product-favorite-wrapper">
        <button 
          className={`favorite-card-btn ${isFavorite ? 'active' : ''}`}
          onClick={(e) => {
          e.stopPropagation();
          toggleFavoriteHandler(e)}} 
          aria-label={isFavorite ? '찜 해제' : '찜 하기'}>
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
            
      {/* 카드 클릭 시 상세 페이지 이동 핸들러는 이미지/정보 영역에 적용 */}
      <div onClick={() => ProductHandler(product.id)} className="product-card-clickable-area">
        <div className="product-image"><img src={product.image_path} alt="" /></div>
        <div className="product-name">{product.goods_name}</div>
        <div className="product-price">{product.price ? product.price.toLocaleString() : '가격 미정'}원</div>
        {/* <div className="product-actions">
          <button>구매하기</button>
          <button>장바구니</button>
        </div> */}
      </div>

      {/* 판매순 정보 */}
      {sortKey === 'sales' && product.sell_count !== undefined && <div className="product-sales-info">총 {product.sell_count}회 판매</div>}
    </div>
  );
};


const GoodsList = ({categoryKey, categoryValue}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const {goTo} = UseNavi()
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [perPage, setPerPage] = useState(20)

  // 정렬 키 상태 (기본 값: 신상품순)
  const [sortKey, setSortKey] = useState('newest');

  const ProductHandler = (goodsId) => {
    goTo(`/store/detail/${goodsId}`);
  }

  // 상품 데이터를 서버에서 불러오는 함수
  const fetchProducts = useCallback(async(currentPage, currentSortKey, currentCategoryValue, currentCategoryKey, currentPerPage) => {
    setLoading(true);

    const baseUrl = "/goods"

    let params = {
      sort_by: currentSortKey,
      page: currentPage,
      per_page: currentPerPage,
      category_key: 'category',
      category_value: 'All',
    }


    if (currentCategoryKey !== '전체') {
      const KEY_MAP = {
        '기능성':'category',
        '성분별':'classify'
      }

      // '기능성'/'성분별' 탭을 선택했을 때는 DB 필드명으로 변환
      params.category_key = KEY_MAP[currentCategoryKey] || currentCategoryKey; 

      // 'All'이 아닐 경우 (세부 카테고리가 선택된 경우) 한글 값 전송
      if (currentCategoryValue !== 'All') {
        params.category_value = currentCategoryValue; 
      }

      // 인기순일 경우 서버에 정렬 위임
      if (currentSortKey === 'popularity') {
        params.order = 'desc'
      }
    }

    await requestHandler({
      method: "get",
      url: baseUrl,
      params: params,
      setLoading,
      onSuccess: (data) => {
        setProducts(Array.isArray(data.goods) ? data.goods : [])
        setTotal(typeof data.total_count === "number" ? data.total_count : 0)
        setPages(typeof data.total_pages === "number" ? data.total_pages : 1)
        if(typeof data.current_page === "number") {
          setPage(data.current_page)
        }
      },
      onError:(msg) => {
        alert(msg),
        setProducts([]),
        setPages(0),
        setTotal(0)
      }
    })
  }, [requestHandler, setLoading, setProducts, setTotal, setPages, setPage]);

  useEffect(() => {
    // sortKey, categoryValue, categoryKey 중 하나라도 변경되면 페이지를 1로 리셋
    setPage(1); 
  }, [sortKey, categoryValue, categoryKey]);

  useEffect(() => {
    // page, sortKey, categoryValue, categoryKey, perPage 중 하나라도 변경되면 호출
    fetchProducts(page, sortKey, categoryValue, categoryKey, perPage);
  }, [page, sortKey, categoryValue, categoryKey, perPage, fetchProducts]); // fetchProducts가 useCallback으로 감싸져 있으므로 안전하게 사용 가능


  if (loading) return <div className="loading-message">상품 목록을 불러오는 중...</div>
  if (products.length === 0 && !loading) {
      return <div className="no-results">표시할 상품이 없습니다.</div>
  }


  // 정렬 버튼 클릭 핸들러
  const handleSortChange = (key) => {
    setSortKey(key);
  };

  if (loading) return <div className="loading-message">상품 목록을 불러오는 중...</div>

  if (products.length === 0 && !loading) {
    return <div className="no-results">표시할 상품이 없습니다.</div>;
  }

  return(
    <>
    <div className="goods-list-container">
      <h3 className="goods-list-title">{categoryValue === 'All' ? '전체 상품' : `${categoryValue} 상품`} ({total}개)</h3>

      <div className="sort-buttons">
        <button onClick={() => handleSortChange('popularity')} className={sortKey === 'popularity' ? 'active' : ''}>
          인기순(1달)
        </button>
        <button onClick={() => handleSortChange('newest')} className={sortKey === 'newest' ? 'active' : ''}>
          신상품순
        </button>
        <button onClick={() => handleSortChange('sales')} className={sortKey === 'sales' ? 'active' : ''}>
          판매순(총 판매)
        </button>
        <button onClick={() => handleSortChange('price')} className={sortKey === 'price' ? 'active' : ''}>
          낮은가격순
        </button>
      </div>
    
      <div className="product-grid">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            sortKey={sortKey}
            ProductHandler={ProductHandler}/>
        ))}
      </div>
      <Pagination
        page={page}
        pages={pages}
        onChange={(num) => setPage(num)}
        loading={loading}
      />
    </div>
    </>
  )
}

export default GoodsList;