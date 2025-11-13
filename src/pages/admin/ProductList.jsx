import { useEffect, useMemo, useState } from "react";
import UseNavi from "../../utils/UseNavi"
import Pagination from "../../components/ui/Pagination";
import requestHandler from "../../utils/requestHandler";
import Button from "../../components/ui/Button";
import '../../styles/admin/ProductList.css'
import LoadingSpinner from "../../utils/LoadingSpinner";
import time from "../../utils/time";

const ProductList = () => {
  const {goTo} = UseNavi()
  const [loading, setLoading] = useState(true);
  const [goods, setGoods] = useState([]);
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [perPage, setPerPage] = useState(10)

  const [selected, setSelected] = useState(new Set());

  const allIds = useMemo(() => goods.map((g) => g.id), [goods]);
  const isAllChecked = goods.length > 0 && selected.size === goods.length;
  const isIndeterminate = selected.size > 0 && selected.size < goods.length;

  const toggleAll = () => {
    setSelected((prev) =>
      prev.size === goods.length ? new Set() : new Set(allIds)
    );
  };

  const toggleOne = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const load = async () => {
    await requestHandler({
      method: "get",
      url: "/admin/goods",
      params : {page, per_page: perPage},
      setLoading,
      onSuccess: (data) => {
        setGoods(Array.isArray(data.goods) ? data.goods : []);
        setTotal(typeof data.total === "number" ? data.total : 0);
        setPages(typeof data.pages === "number" ? data.pages : 1);
        setPerPage(typeof data.per_page === "number" ? data.per_page : 10);
        setSelected(new Set()); // 페이지 바뀔 때 선택 초기화
      },
      onError: (msg) => {
        alert(msg)
        setGoods([])
        setTotal(0)
        setPages(1)
        setSelected(new Set());
      },
    })
  }

  useEffect(() => {
    load()
  }, [page, perPage])

  const formatPrice = (v) =>
    typeof v === "number" ? v.toLocaleString() : Number(v || 0).toLocaleString();

  const onClickEdit = () => {
    if (selected.size !== 1) {
      alert("수정은 한 개만 선택해주세요.");
      return;
    }
    const id = [...selected][0];
    goTo(`/admin/products/edit/${id}`); // 수정 페이지 라우팅 규칙에 맞게 조정
  };

  const onClickDelete = async () => {
    if (selected.size === 0) {
      alert("삭제할 상품을 선택하세요.");
      return;
    }
    if (!confirm(`${selected.size}개 상품을 삭제하시겠습니까?`)) return;
    for (const id of selected) {
      await requestHandler({
        method:"delete",
        url:`/admin/goods/${id}`,
        onSuccess: (data) => alert(data.message || `${id}번 상품 삭제 완료`),
        onError: (msg) => alert(msg || `${id}번 상품 삭제 실패`),
      })
    }

    await load()
    setSelected(new Set())
    alert("선택한 상품이 모두 삭제되었습니다.");
  };

  return (
    <div className="productlist-container">
      <div className="productlist-header">
        <h2>상품 목록</h2>

        <div className="toolbar">
          <div className="left">
            <Button variant="secondary" onClick={() => setPage(1)}>
              새로고침
            </Button>
            <label className="perpage">
              <span>표시 개수</span>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
              >
                {[10, 20, 30, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="right">
            <Button variant="secondary" onClick={onClickEdit}>
              수정
            </Button>
            <Button variant="danger" onClick={onClickDelete}>
              삭제
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <LoadingSpinner size={30} label="상품 목록 불러오는 중..." />
        </div>
      ) : goods.length ? (
        <>
          <div className="table-wrap">
            <table className="admin-table productlist-table">
              <colgroup>
                <col style={{ width: "44px" }} />
                <col style={{ width: "80px" }} />
                <col style={{ width: "120px" }} />
                <col style={{ width: "96px" }} />
                <col />
                <col style={{ width: "150px" }} />
                <col style={{ width: "150px" }} />
                <col style={{ width: "120px" }} />
                <col style={{ width: "110px" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={isAllChecked}
                      ref={(el) => {
                        if (el) el.indeterminate = isIndeterminate;
                      }}
                      onChange={toggleAll}
                    />
                  </th>
                  <th>번호</th>
                  <th>카테고리</th>
                  <th>이미지</th>
                  <th>상품명</th>
                  <th>등록일</th>
                  <th>수정일</th>
                  <th>가격</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {goods.map((g) => {
                  const checked = selected.has(g.id);
                  const soldout = Number(g.stock) <= 0 || g.is_active === false;

                  return (
                    <tr key={g.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleOne(g.id)}
                        />
                      </td>
                      <td>{g.id}</td>
                      <td>{g.category || "-"}</td>
                      <td>
                        {g.image_path ? (
                          <img
                            src={g.image_path}
                            alt={g.goods_name}
                            className="thumb"
                          />
                        ) : (
                          <span className="thumb placeholder">No Image</span>
                        )}
                      </td>
                      <td className="name">
                        <button
                          className="linklike"
                          onClick={() =>
                            goTo(`/admin/products/edit/${g.id}`)
                          }
                        >
                          {g.goods_name}
                        </button>
                        {g.classify ? (
                          <div className="sub">{g.classify}</div>
                        ) : null}
                      </td>
                      <td>{time(g.create_at)}</td>
                      <td>{time(g.update_at)}</td>
                      <td>{formatPrice(g.price)}원</td>
                      <td>
                        {soldout ? (
                          <span className="badge soldout">품절</span>
                        ) : (
                          <span className="badge on">판매중</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
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
        <div className="empty">등록된 상품이 없습니다.</div>
      )}
    </div>
  )
}

export default ProductList