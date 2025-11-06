import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "../../styles/SearchModal.css";

const SearchModal = ({ isOpen, onClose, searchTerm, onSelect, apiEndpoint = "/medicine/search", searchParamKey = "keyword", type }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  sessionStorage.setItem("result", JSON.stringify(searchResults));

  useEffect(() => {
    const searchItems = async () => {
      if (isOpen && searchTerm) {
        setLoading(true);
        try {
          const response = await axiosInstance.get(apiEndpoint, {
            params: {
              // 🚨 백엔드에서 'q'로 변경되었으므로 'q'를 사용합니다.
              q: searchTerm,

              // 🚨 'type' 파라미터를 추가하고 'meds'로 설정합니다.
              type: type,
            },
          });

          const data = response.data;

          if (data.success) {
            // 응답 데이터의 키를 동적으로 처리할 수 있도록 수정
            const results = Array.isArray(data.medicines) ? data.medicines : [];
            setSearchResults(results);
          } else {
            console.error("검색 실패:", data.message);
            setSearchResults([]);
          }
        } catch (error) {
          console.error("검색 중 오류 발생:", error);
          setSearchResults([]);
        } finally {
          setLoading(false);
        }
      }
    };

    // 타이핑할 때마다 바로 검색하지 않고 0.5초 후에 검색 실행
    const debounceTimer = setTimeout(() => {
      searchItems();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [isOpen, searchTerm, apiEndpoint, searchParamKey]);

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay">
      <div className="search-modal">
        <div className="search-modal-header">
          <h3>검색</h3>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        <div className="search-modal-content">
          {loading ? (
            <div className="loading">검색중...</div>
          ) : (
            <ul className="search-results">
              {searchResults.map(item => (
                <li 
                  key={item.id} 
                  onClick={() => onSelect(item)}
                  className="search-result-item"
                >
                  <div className="result-name">{item.name}</div>
                  {item.brand && <div className="result-detail">브랜드: {item.brand}</div>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;