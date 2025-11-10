import Button from "./Button"
import "./Pagination.css"

const Pagination = ({ page, pages, loading, onChange }) => {
  const blockSize = 10
  const currentBlock = Math.floor((page - 1) / blockSize)
  const startPage = currentBlock * blockSize + 1
  const endPage = Math.min(startPage + blockSize - 1, pages)

  const numbers = []
  for (let i = startPage; i <= endPage; i++) {
    numbers.push(i)
  }

  const prevBlockLast = Math.max(startPage - 1, 1)
  const nextBlockFirst = endPage + 1 <= pages ? endPage + 1 : pages

  const hasPrevBlock = startPage > 1;
  const hasNextBlock = endPage < pages;

  const showBlockNav = hasPrevBlock || hasNextBlock;       // ≪ ≫
  const showFirstLast = pages > blockSize * 2;                // « »

  return (
    <div className="Pagination">
      {/* 맨 처음 */}
      {showFirstLast && (
        <Button
          variant="text"
          disabled={page === 1 || loading}
          onClick={() => onChange(1)}
          aria-label="맨 처음"
        >
          «
        </Button>
      )}

      {/* 이전 블록 */}
      {showBlockNav && (
        <Button
          variant="text"
          disabled={startPage === 1 || loading}
          onClick={() => onChange(prevBlockLast)}
          aria-label="이전 블록" 
        >
          ≪
        </Button>
      )}

      {/* 이전 페이지 */}
      <Button
        variant="text"
        disabled={page === 1 || loading}
        onClick={() => onChange(page - 1)}
        aria-label="이전 페이지"
      >
        〈
      </Button>

      {/* 숫자 버튼 */}
      {numbers.map((num) => (
        <Button
          key={num}
          variant={num === page ? "solid" : "outline"}
          disabled={loading || num === page}
          className={`page-btn ${num === page ? "active" : ""}`}
          onClick={() => num !== page && onChange(num)}
          aria-label={`페이지 ${num}`}
        >
          {num}
        </Button>
      ))}

      {/* 다음 페이지 */}
      <Button
        variant="text"
        disabled={page === pages || loading}
        onClick={() => onChange(page + 1)}
        aria-label="다음 페이지"
      >
        〉
      </Button>

      {/* 다음 블록 */}
      {showBlockNav && (
        <Button
          variant="text"
          disabled={endPage >= pages || loading}
          onClick={() => onChange(nextBlockFirst)}
          aria-label="다음 블록"
        >
          ≫
        </Button>
      )}
      {/* 맨 끝 */}
      {showFirstLast && (
        <Button
          variant="text"
          disabled={page === pages || loading}
          onClick={() => onChange(pages)}
          aria-label="맨 끝"
        >
          »
        </Button>
      )}

    </div>
  )
}

export default Pagination
