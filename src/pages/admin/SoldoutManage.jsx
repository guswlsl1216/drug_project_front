import { useEffect, useState } from "react";
import requestHandler from "../../utils/requestHandler";
import "../../styles/admin/ProductList.css";
import Pagination from "../../components/ui/Pagination";
import LoadingSpinner from "../../utils/LoadingSpinner";
import Button from "../../components/ui/Button";

const SoldoutManage = () => {
  const [loading, setLoading] = useState(true);
  const [goods, setGoods] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(10)

  // 재고 수정 모달 관련 상태
  const [editingItem, setEditingItem] = useState(null); // 현재 수정 중인 상품
  const [editStock, setEditStock] = useState("");       // 입력한 재고 수량
  const [saving, setSaving] = useState(false);          // 저장 중 로딩

  const fetchGoods = () => {
    requestHandler({
      method: "get",
      url: "/admin/goods/soldout",
      payload: { page, per_page: perPage },
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
  }

  useEffect(() => {
    fetchGoods()
  }, [page, perPage]);

  // 모달 열기
  const openEditModal = (item) => {
    setEditingItem(item);
    setEditStock(item.stock ?? 0); // 기존 재고(품절이면 0) 기준
  };

  // 모달 닫기
  const closeEditModal = () => {
    if (saving) return; // 저장 중에는 닫기 방지
    setEditingItem(null);
    setEditStock("");
  };

  const handleSaveStock = () => {
    if (!editingItem) return;

    const stockValue = Number(editStock);

    if (Number.isNaN(stockValue) || stockValue < 0) {
      alert("재고 수량은 0 이상의 숫자로 입력해주세요.");
      return;
    }

    requestHandler({
      method: "put",
      url: `/admin/goods/${editingItem.id}/stock`,
      payload: { stock: stockValue },
      setLoading: setSaving, // 저장 버튼 로딩용
      onSuccess: (res) => {
        alert(res?.message || "재고가 수정되었습니다.");
        closeEditModal();  // 모달 닫기
        fetchGoods();      // 리스트 다시 불러오기 (재고 > 0이면 목록에서 빠짐)
      },
      onError: (msg) => {
        alert(msg || "재고 수정 중 오류가 발생했습니다.");
      },
    });
  }


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
                  <th className="col-hide-mobile">카테고리</th>
                  <th>이미지</th>
                  <th>상품명</th>
                  <th>가격</th>
                  <th className="col-hide-mobile">현재 재고</th>
                  <th>상태</th>
                  <th>재입고</th>
                </tr>
              </thead>
              <tbody>
                {goods.map((g) => (
                  <tr key={g.id}>
                    <td>{g.id}</td>
                    <td className="col-hide-mobile">{g.category || "-"}</td>
                    <td>
                      {g.image_path ? (
                        <img src={g.image_path} alt={g.goods_name} className="thumb" />
                      ) : (
                        <span className="thumb placeholder">No Image</span>
                      )}
                    </td>
                    <td className="name">{g.goods_name}</td>
                    <td>{Number(g.price).toLocaleString()}원</td>
                    <td className="col-hide-mobile">{g.stock}</td>
                    <td>
                      <span className="badge soldout">품절</span>
                    </td>
                    <td>
                      <Button
                        variant="text"
                        className="btn-small"
                        onClick={() => openEditModal(g)}
                      >
                        재고 수정
                      </Button>
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

      {editingItem && (
        <div className="modal-backdrop stock-modal-backdrop">
          <div className="modal stock-modal">
            <h3>재고 수정</h3>
            <p className="stock-modal-title">
              <b>{editingItem.goods_name}</b>
            </p>
            <div className="stock-modal-row">
              <label>현재 재고</label>
              <div className="stock-modal-value">{editingItem.stock}</div>
            </div>

            <div className="stock-modal-row">
              <label htmlFor="new-stock">변경할 재고 수량</label>
              <input
                id="new-stock"
                type="number"
                min="0"
                value={editStock}
                onChange={(e) => setEditStock(e.target.value)}
                disabled={saving}
              />
            </div>
            <p className="stock-modal-helper">
              재고가 1개 이상이 되면 품절 목록에서 자동으로 제외됩니다.
            </p>

            <div className="stock-modal-actions">
              <Button
                variant="secondary"
                onClick={closeEditModal}
                disabled={saving}
              >
                취소
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveStock}
                disabled={saving}
              >
                {saving ? "저장 중..." : "저장"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SoldoutManage 