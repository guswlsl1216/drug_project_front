import { useEffect, useState } from "react";
import requestHandler from "../../utils/requestHandler";
import "../../styles/admin/ProductList.css";
import Pagination from "../../components/ui/Pagination";
import LoadingSpinner from "../../utils/LoadingSpinner";

const SoldoutManage = () => {
  const [loading, setLoading] = useState(true);
  const [goods, setGoods] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(10)

  useEffect(() => {
    requestHandler({
      method: "get",
      url: "/admin/goods/soldout",
      payload: { page, per_page: 10 },
      setLoading,
      onSuccess: (data) => {
        setGoods(data.goods || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
        setPerPage(typeof data.per_page === "number" ? data.per_page : 10);
      },
      onError: (msg) => {
        alert(msg);
        setGoods([]);
        setTotal(0);
        setPages(1)
      },
    });
  }, [page, perPage]);

  return (
    <div className="productlist-container">
      <div className="productlist-header">
        <h2>품절 상품 관리</h2>
      </div>

      {loading ? (
        <div className="loading">
          <LoadingSpinner size={30} showLabel label="품절 상품 불러오는 중..." />
        </div>
      ) : goods.length ? (
        <>
          <div className="table-wrap">
            <table className="admin-table productlist-table">
              <thead>
                <tr>
                  <th>번호</th>
                  <th>카테고리</th>
                  <th>이미지</th>
                  <th>상품명</th>
                  <th>가격</th>
                  <th>재고</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {goods.map((g) => (
                  <tr key={g.id}>
                    <td>{g.id}</td>
                    <td>{g.category || "-"}</td>
                    <td>
                      {g.image_path ? (
                        <img src={g.image_path} alt={g.goods_name} className="thumb" />
                      ) : (
                        <span className="thumb placeholder">No Image</span>
                      )}
                    </td>
                    <td className="name">{g.goods_name}</td>
                    <td>{Number(g.price).toLocaleString()}원</td>
                    <td>{g.stock}</td>
                    <td>
                      <span className="badge soldout">품절</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <Pagination
            page={page}
            pages={pages}
            loading={loading}
            onChange={(num) => setPage(num)}
          />      

          <div className="total">
            총 <b>{total.toLocaleString()}</b>개
          </div>
        </>
      ) : (
        <div className="empty">품절된 상품이 없습니다.</div>
      )}
    </div>
  )
}

export default SoldoutManage 