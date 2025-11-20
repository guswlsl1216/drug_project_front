import React, { useEffect, useState } from "react";
import { Container, Form, Button, ListGroup, Alert } from "react-bootstrap";
import { Star } from 'lucide-react';
import { useParams } from "react-router-dom";
import requestHandler from "../../utils/requestHandler";
import { useOutletContext } from 'react-router-dom';
import "../../styles/store/Review.css"

//모델 붙이면 완료인듯
function Review() {
  const { goodsId } = useParams();
  const [comments, setComments] = useState([]); // 댓글 목록
  const [imgurl, setImgurl] = useState(""); //이미지
  const [selectedFile, setSelectedFile] = useState("");
  const [input, setInput] = useState("");       // 입력값
  const [error, setError] = useState("");       // 에러 메시지
  const [hoverRating, setHoverRating] = useState(0);
  const [rating, setRating] = useState(0);
  const [currentUser, setCurrentUser] = useState("");

  const [updateMode, setUpdateMode] = useState()
  const [updateInput, setUpdateInput] = useState("")
  const [updateRating, setUpdateRating] = useState();
  const [updateHoverRating, setUpdateHoverRating] = useState(0);
  const [updateFile, setUpdateFile] = useState(null);
  const [updateFileName, setUpdateFileName] = useState("");
  const { product, reviewUpdate, handleReviewUpdated } = useOutletContext();

  const [sortType, setSortType] = useState(() => {
    return localStorage.getItem('sortType') || '';
  });

  const getUser = async () => {
    const res = await requestHandler({
      method: "get",
      url: "/login/check"
    })
    setCurrentUser(res.data['user']['nickname'])
  }

  const getReview = async (goods_id) => {
    const res = await requestHandler({
      method: "get",
      url: "/review/getReview/" + goods_id
    })
    console.log(res.data['reviews'])
    return res.data['reviews']
  }

  const addReview = async (goods_id) => {
    const content = input;
    const rate = rating;
    const img = imgurl;

    const formData = new FormData();
    formData.append('content', content);
    formData.append('stars', rate);
    formData.append('image', img);

    try {
      const response = await fetch(`http://localhost:5000/review/addReview/${goods_id}`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      const data = await response.json();
      console.log(data);
      alert(data['message'])
    } catch (error) {
      console.error('Error:', error);
    }
    handleReviewUpdated()
  };

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
    addReview(goodsId)
    setInput("");
    setError("");
  };

  const handleUpdateReview = (idx, text, rating) => {
    setUpdateMode(idx)
    setUpdateInput(text)
    setUpdateRating(rating)
  }

  const updateReivew = async (review_id) => {
    const content = updateInput;
    const rate = updateRating;
    const id = review_id;
    const img = updateFile;

    const formData = new FormData();
    formData.append('content', content);
    formData.append('stars', rate);
    formData.append('image', img);

    try {
      const response = await fetch(`http://localhost:5000/review/updateReview/${id}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include'
      });
      const data = await response.json();
      console.log(data);
      alert(data['message'])
    } catch (error) {
      console.error('Error:', error);
    }
    setUpdateMode('')
    handleReviewUpdated()
  }

  const deleteReview = async (review_id) => {
    try {
      const res = await requestHandler({
        method: "delete",
        url: "/review/deleteReview/" + review_id
      })
      alert(res.data['message'])
    }
    catch (error) {
      console.log(error)
    }
    handleReviewUpdated()
  }

  const handleSort = (type) => {
    setSortType(type);
    localStorage.setItem('sortType', type);
    let sorted = [...comments];

    if (type === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (type === 'latest') {
      sorted.sort((a, b) => new Date(b.create_at) - new Date(a.create_at));
    }
    setComments(sorted);
  };
  useEffect(() => {
    (async () => {
      const reviews = await getReview(goodsId);
      const newComments = reviews.map(data => ({
        text: data['content'],
        date: data['create_at'],
        rating: data['stars'],
        img: 'http://localhost:5000' + data['review_image'],
        username: data['user']['nickname'],
        id: data['id'],
        create_at: data['create_at']
      }));
      if (sortType === 'rating') {
        newComments.sort((a, b) => b.rating - a.rating);
      } else if (sortType === 'latest') {
        newComments.sort((a, b) => new Date(b.create_at) - new Date(a.create_at));
      }
      setComments(newComments);
      await getUser();
    })();
  }, [reviewUpdate])

  return (
    <Container className="mt-4" style={{ maxWidth: "600px" }}>
      <div className="mb-3">
        <Button
          style={{
            background: "transparent",
            border: "none",
            color: sortType === 'rating' ? '#007bff' : '#6c757d',
          }}
          onClick={() => handleSort('rating')}>
          높은별점순
        </Button>
        <Button
          style={{
            marginLeft: '8px',
            background: "transparent",
            border: "none",
            color: sortType === 'latest' ? '#007bff' : '#6c757d',
          }}
          onClick={() => handleSort('latest')}>
          최신순
        </Button>
      </div>
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
          <div className="text-input-wrapper">
            <textarea
              placeholder="댓글을 입력하세요..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="file-input-wrapper">
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={(e) => {
                  setImgurl(e.target.files[0]);
                  setSelectedFile(e.target.files[0].name);
                }}
              />
              <button
                type="button"
                className="file-btn"
                onClick={() => document.getElementById("fileInput").click()}
              >
                📁
              </button>
            </div>
          </div>
          {selectedFile && (
            <small className="text-muted mt-1 d-block" style={{ fontSize: "12px" }}>
              선택된 파일: {selectedFile}
            </small>
          )}
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
          <li className="comment-item" key={idx}>
            <div className="comment-inner">
              <div className="flex-grow-1">
                <div className="comment-header">
                  <div className="comment-username-wrapper">
                    <div className="user-avatar">
                      {c.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="comment-username">{c.username}</div>
                      <div className="comment-date">{c.date}</div>
                    </div>
                  </div>
                </div>

                <div className="rating-display">
                  {updateMode === idx ? (
                    <>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUpdateRating(star)}
                          onMouseEnter={() => setUpdateHoverRating(star)}
                          onMouseLeave={() => setUpdateHoverRating(0)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0'
                          }}
                        >
                          <Star
                            size={32}
                            fill={star <= (updateHoverRating || updateRating) ? '#ffc107' : '#e9ecef'}
                            color={star <= (updateHoverRating || updateRating) ? '#ffc107' : '#dee2e6'}
                            style={{ transition: 'all 0.2s' }}
                          />
                        </button>
                      ))}
                      <span className="ms-2 text-warning fw-bold">{updateRating}점</span>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>

                {c.img && c.img !== 'null' ? (
                  updateMode === idx ? (
                    <div>
                      <div className="mb-2">
                        <img src={c.img} alt="" style={{ maxWidth: "100px", height: "auto" }} />
                      </div>
                      <input
                        type="file"
                        id="updateFileInput"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            setUpdateFile(e.target.files[0]);
                            setUpdateFileName(e.target.files[0].name);
                          }
                        }}
                      />
                      <Button
                        className="btn btn-light btn-sm"
                        onClick={() => document.getElementById("updateFileInput").click()}
                      >
                        📁 이미지 변경
                      </Button>
                      {updateFileName && (
                        <small className="text-muted d-block mt-1">
                          새 파일: {updateFileName}
                        </small>
                      )}
                    </div>
                  ) : (
                    <div>
                      <img src={c.img} alt="" style={{ maxWidth: "100px", height: "auto" }} />
                    </div>
                  )
                ) : null}

                {updateMode === idx ? (
                  <div className="form-group controlId">
                    <textarea
                      type="text"
                      value={updateInput}
                      onChange={(e) => setUpdateInput(e.target.value)}
                      className="edit-input"
                    />
                  </div>
                ) : (
                  <div className="comment-text">{c.text}</div>
                )}

                <small className="text-muted">
                  {c.date}
                </small>
              </div>

              {currentUser == c.username && (
                <div className="comment-actions">
                  {updateMode === idx ? (
                    <>
                      <Button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => {
                          updateReivew(c.id)
                        }}
                      >
                        저장
                      </Button>
                      <Button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => {
                          setUpdateMode('')
                        }}
                      >
                        취소
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => {
                          handleUpdateReview(idx, c.text, c.rating)
                        }}
                      >
                        수정
                      </Button>
                      <Button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => {
                          deleteReview(c.id)
                        }}
                      >
                        삭제
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </li>
        ))}
      </ListGroup>
    </Container >
  );
}

export default Review;
