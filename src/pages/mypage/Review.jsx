import { useEffect, useState } from 'react';
import { Star, Trash2, Edit2 } from 'lucide-react';
import '../../styles/mypage/MyReview.css';
import requestHandler from '../../utils/requestHandler';
import { useNavigate } from 'react-router-dom';

const Review = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [updated, setUpdated] = useState(true);

  const [filterRating, setFilterRating] = useState('all');

  const filteredReviews = filterRating === 'all'
    ? reviews
    : reviews.filter(r => r.rating === parseInt(filterRating));

  const handleDelete = async (id) => {
    try {
      const res = await requestHandler({
        method: "delete",
        url: "/review/deleteReview/" + id
      })
      alert(res.data['message'])
    }
    catch (error) {
      console.log(error)
    }
    setUpdated(prev => !prev)
  };

  const getReviews = async () => {
    const res = await requestHandler({
      method: "get",
      url: "/review/myReview"
    })

    return res.data['reviews']
  }
  const renderStars = (rating) => {
    return (
      <div className="star-container">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={18}
            fill={i < rating ? '#fbbf24' : '#d1d5db'}
            color={i < rating ? '#fbbf24' : '#d1d5db'}
          />
        ))}
      </div>
    );
  };

  useEffect(() => {
    (async () => {
      const review_list = await getReviews()
      setReviews(review_list)
    })()
  }, [updated]);

  return (
    <div className="review-container">
      <div className="blur-bg">
        <div className="blur-circle-1"></div>
        <div className="blur-circle-2"></div>
      </div>

      <div className="wrapper">
        {/* 헤더 */}
        <div className="header">
          <h2>내 리뷰</h2>
          <p>작성한 리뷰 <span>{reviews.length}</span>개</p>
        </div>

        {/* 필터 버튼 */}
        <div className="filter-buttons">
          <button
            onClick={() => setFilterRating('all')}
            className={`filter-btn ${filterRating === 'all' ? 'active' : ''}`}
          >
            전체
          </button>
          {[5, 4, 3, 2, 1].map(star => (
            <button
              key={star}
              onClick={() => setFilterRating(star.toString())}
              className={`filter-btn star-btn ${filterRating === star.toString() ? 'active' : ''}`}
            >
              <Star size={16} style={{ fill: 'currentColor' }} />
              {star}
            </button>
          ))}
        </div>

        {/* 리뷰 목록 */}
        <div className="reviews-list">
          {filteredReviews.length > 0 ? (
            filteredReviews.map(review => (
              <div key={review.id} className="review-card" onClick={() => navigate(`/store/detail/${review.product_id}/desc`)}>
                <div className="review-header">
                  <div className="review-product-info">
                    <div className="product-details">
                      <h3 className="product-name">{review.product}</h3>
                      <div className="rating-date">
                        {renderStars(review.rating)}
                        <span className="review-date">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="review-actions">
                    <button
                      className="action-btn delete"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(review.id)
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <img src={review.image} alt="[상품 상세 이미지]"
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }} />
                <p className="review-content">{review.content}</p>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>해당하는 리뷰가 없습니다.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Review;