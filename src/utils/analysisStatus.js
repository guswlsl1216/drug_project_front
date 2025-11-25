/**
 * @fileoverview 서버에서 전달된 분석 결과의 상태 값(0, 1, 2)을
 * 프론트엔드 UI에서 사용할 텍스트 레이블과 CSS 클래스 이름으로 변환(매핑)하는 상수 객체.
 * @constant
 * @type {Object<number, {label: string, className: string}>}
 */

import { faCircleCheck, faCircleExclamation, faCircleXmark } from "@fortawesome/free-solid-svg-icons"

const ANALYSIS_STATUS_MAPPING = {
  // 0: 양호 상태, 이상 없을 가능성이 큼
  0: {
    status_label: '양호',
    status_message: '함께 복용해도 괜찮을 가능성이 커요!',
    status_className: 'status_good',
    status_color: 'seagreen',
    status_fontAwesome: faCircleCheck
  },
  // 1: 주의 상태, 의약품-영양제 간 병용섭취 시 상호작용 발생
  1: {
    status_label: '주의',
    status_message: '함께 복용 시 주의해야 할 내용이 있어요!',
    status_className: 'status_warning',
    status_color: 'orange',
    status_fontAwesome: faCircleExclamation
  },
  // 2: 위험 상태, 의약품-의약품 간 병용 금기
  2: {
    status_label: '위험',
    status_message: '함께 복용하면 위험한 성분이 있어요!',
    status_className: 'status_danger',
    status_color: 'tomato',
    status_fontAwesome: faCircleXmark
  }
}

export default ANALYSIS_STATUS_MAPPING