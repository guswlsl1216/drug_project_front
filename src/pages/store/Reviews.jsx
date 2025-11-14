import React, { useState } from "react";
import { Container, Form, Button, ListGroup, Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Star } from 'lucide-react';

//정렬기준추가하면 괜찮을듯
//handleAddComment에 백엔드 작업 + useEffect에 댓글 불러오기 구현하면 됨
// + 상품 평균평점이랑 전체 리뷰 수 출력 
function Review() {
  const [comments, setComments] = useState([]); // 댓글 목록
  const [input, setInput] = useState("");       // 입력값
  const [error, setError] = useState("");       // 에러 메시지
  const [hoverRating, setHoverRating] = useState(0);
  const [rating, setRating] = useState(0);

  // 더미 사용자 이름
  const currentUser = "Jane Doe";
  // 댓글 추가
  const handleAddComment = () => {
    if (!input.trim()) {
      setError("댓글을 입력해주세요.");
      return;
    }
    if (rating === 0) {
      setError('별점을 선택하세요');
      return;
    }
    setComments([{ text: input.trim(), date: new Date(), rating: rating, username: currentUser}, ...comments]);
    setInput("");
    setError("");
  };

  return (
    <Container className="mt-4" style={{ maxWidth: "600px" }}>
      <div className="fw-bold mb-2">{currentUser}</div>
      <Form>
        <Form.Group className="mb-3">
          <div className="d-flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                //별점 등록
                onClick={() => setRating(star)}
                //마우스hover할때 별
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0'
                }}
              >
                <Star
                  size={32}
                  fill={star <= (hoverRating || rating) ? '#ffc107' : '#e9ecef'}
                  color={star <= (hoverRating || rating) ? '#ffc107' : '#dee2e6'}
                  style={{ transition: 'all 0.2s' }}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <small className="text-muted ms-2">{rating}점 선택됨</small>
          )}
        </Form.Group>
        <Form.Group controlId="commentInput">
          <Form.Control
            type="text"
            placeholder="댓글을 입력하세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </Form.Group>
        {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
        <Button
          variant="primary"
          className="mt-2"
          onClick={handleAddComment}
        >
          등록
        </Button>
      </Form>

      <ListGroup className="mt-4">
        {comments.length === 0 && (
          <ListGroup.Item className="text-muted">아직 댓글이 없습니다.</ListGroup.Item>
        )}
        {comments.map((c, idx) => (
          <ListGroup.Item key={idx}>
            <div className="fw-bold mb-2">{c.username}</div>
            <div className="mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  fill={star <= c.rating ? "#ffc107" : "#e9ecef"}
                  color={star <= c.rating ? "#ffc107" : "#dee2e6"}
                  style={{ display: "inline-block", marginRight: "2px" }}
                />
              ))}
              <span className="ms-2 text-warning fw-bold">{c.rating}점</span>
            </div>
            <div>{c.text}</div>
            <small className="text-muted">
              {c.date.toLocaleString()}
            </small>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default Review;
