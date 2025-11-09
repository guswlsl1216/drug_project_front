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

  const prevBlockFirst = Math.max(startPage - blockSize, 1)
  const nextBlockFirst = endPage + 1 <= pages ? endPage + 1 : pages

  return (
    <div className="Pagination">
      {/* 이전 블록 */}
      <Button
        variant="text"
        disabled={startPage === 1 || loading}
        onClick={() => onChange(prevBlockFirst)}
      >
        ≪
      </Button>

      {/* 이전 페이지 */}
      <Button
        variant="text"
        disabled={page === 1 || loading}
        onClick={() => onChange(page - 1)}
      >
        〈
      </Button>

      {/* 숫자 버튼 */}
      {numbers.map((num) => (
        <Button
          key={num}
          variant={num === page ? "solid" : "outline"}
          disabled={loading}
          className={`page-btn ${num === page ? "active" : ""}`}
          onClick={() => onChange(num)}
        >
          {num}
        </Button>
      ))}

      {/* 다음 페이지 */}
      <Button
        variant="text"
        disabled={page === pages || loading}
        onClick={() => onChange(page + 1)}
      >
        〉
      </Button>

      {/* 다음 블록 */}
      <Button
        variant="text"
        disabled={endPage >= pages || loading}
        onClick={() => onChange(nextBlockFirst)}
      >
        ≫
      </Button>
    </div>
  )
}

export default Pagination
