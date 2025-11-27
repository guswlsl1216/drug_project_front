import { useId, useState } from "react"
import { useDaumPostcodePopup } from "react-daum-postcode"
import"./AddressPicker.css"
import Button from "./Button";

const SCRIPT_URL = 
  'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'

const DEFAULT_LABELS = {
  postcode: "우편번호",
  search: "주소 검색",
  address: "주소",
  detail: "상세주소",
  extra: "참고항목",
};

const EMPTY_STATE = {
  postcode: "",
  road: "",
  jibun: "",
  extras: "",
  local: "",
  type: "",
  display: { raw: "", compact: "" },
  detail: "",
};

const AddressPicker = ({ 
  value,
  onChange,
  labels = DEFAULT_LABELS,
  compact = true,
  readOnlyBase = true,
  className,
  idPrefix,
  enableExtra = true
}) => {
  const autoId = useId().replace(/:/g, "");
  const prefix = idPrefix || `addr-${autoId}`;
  const open = useDaumPostcodePopup(SCRIPT_URL);

  // 언컨트롤드 기본
  const [inner, setInner] = useState(EMPTY_STATE);
  const [showExtraEditor, setShowExtraEditor] = useState(false);  // 참고항목 인풋 토글
  const state = value ? { ...EMPTY_STATE, ...value } : inner;
  
  const setState = (patch) => {
    const next = { ...state, ...patch };
    if (value === undefined) setInner(next);
    onChange?.(next);
  };

  const handleComplete = (data) => {
    const {
      zonecode,
      address,
      roadAddress,
      jibunAddress,
      addressType,
      bname,
      buildingName,
      sido,
      sigungu,
    } = data;

    // 도로명 우선 기본 주소
    const baseAddress = roadAddress || jibunAddress || address || "";

    const extras = [bname, buildingName].filter(Boolean).join(", ");

    const extraText = extras ? ` (${extras})` : "";
    const raw = `${baseAddress}${extraText}`;

    const local = `${sido ?? ""} ${sigungu ?? ""}`.trim();
    const compactDisplay = raw?.startsWith(local)
      ? raw.slice(local.length).trim()
      : raw;

    setState({
      postcode: zonecode || "",
      road: roadAddress || "",
      jibun: jibunAddress || "",
      extras,
      local,
      type: addressType || "",
      display: { raw, compact: compactDisplay },
      // detail은 유지
    });

    setShowExtraEditor(false)
  };

  const handleSearch = () => open({ onComplete: handleComplete, autoClose: true });

  // 화면 표시용 주소 (compact면 지역명 제거)
  const shownAddress = compact ? state.display.compact : state.display.raw;

  const handleExtrasChange = (e) => {
    const newExtras = e.target.value

    const current = state.road || state.jibun || state.display.raw || ""
    const base = current.split(" (")[0].trim()
    const extraText = newExtras ? ` (${newExtras})` : ""
    const raw = `${base}${extraText}`

    setState({
      extras: newExtras,
      display: {
        raw,
        compact: raw
      }
    })
  }

  return (
    <div className={`address ${className ?? ""}`}>
      {/* 우편번호 + 검색 */}
      <div className="address-row postcode-row">
        <input
          id={`${prefix}-postcode`}
          aria-label={labels.postcode}
          type="text"
          placeholder={labels.postcode}
          value={state.postcode}
          readOnly={readOnlyBase}
          onChange={(e) => setState({ postcode: e.target.value })}
        />
        <Button onClick={handleSearch} variant="primary">
          {labels.search}
        </Button>
      </div>

      {/* 기본 주소 */}
      <div className="address-row address-row-main">
        <input
          id={`${prefix}-address`}
          aria-label={labels.address}
          type="text"
          placeholder={labels.address}
          value={shownAddress}
          readOnly={readOnlyBase}
          onChange={(e) =>
            setState({
              display: { raw: e.target.value, compact: e.target.value },
            })
          }
        />
      </div>

      {/* 상세주소 */}
      <div className="address-row detail-row">
        <input
          id={`${prefix}-detail`}
          aria-label={labels.detail}
          type="text"
          placeholder={labels.detail}
          value={state.detail}
          onChange={(e) => setState({ detail: e.target.value })}
        />
      </div>
      {/* 참고항목 */}
      {enableExtra && (
        showExtraEditor ? (
          <div className="address-row extra-row">
            <input
              id={`${prefix}-extra`}
              aria-label={labels.extra}
              type="text"
              placeholder="무슨동, 건물명 (선택)"
              value={state.extras}
              onChange={handleExtrasChange}
            />
          </div>
        ) : (
          <div className="address-row extra-toggle-row">
            <Button
              variant="text"
              className="extra-toggle-btn"
              onClick={() => setShowExtraEditor(true)}
            >
              참고항목 입력/수정
              {state.extras && (
                <span className="extra-preview"> ({state.extras})</span>
              )}
            </Button>
            <small className="extra-hint">
              건물명 또는 동 이름을 입력하시면 배송이 더 정확해집니다. (선택)
            </small>
          </div>
        )
      )}

      
    </div>
  )
}

export default AddressPicker;