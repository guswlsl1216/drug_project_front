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
}) => {
  const autoId = useId().replace(/:/g, "");
  const prefix = idPrefix || `addr-${autoId}`;
  const open = useDaumPostcodePopup(SCRIPT_URL);

  // 언컨트롤드 기본
  const [inner, setInner] = useState(EMPTY_STATE);
  const state = value ?? inner;

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

    const extras = [bname, buildingName].filter(Boolean).join(", ");
    const extraText = extras ? ` (${extras})` : "";
    const raw = `${address}${extraText}`;
    const local = `${sido ?? ""} ${sigungu ?? ""}`.trim();
    const compactDisplay = address?.startsWith(local)
      ? `${address.slice(local.length).trim()}${extraText}`
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
  };

  const handleSearch = () => open({ onComplete: handleComplete, autoClose: true });

  // 화면 표시용 주소 (compact면 지역명 제거)
  const shownAddress = compact ? state.display.compact : state.display.raw;

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
      <div className="address-row extra-row">
        <input
          id={`${prefix}-extra`}
          aria-label={labels.extra}
          type="text"
          placeholder={labels.extra}
          value={state.extras}
          onChange={(e) => setState({ extras: e.target.value })}
        />
      </div>
    </div>
  )
}

export default AddressPicker;