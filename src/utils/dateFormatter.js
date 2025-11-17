/**
 * YYYY-MM-DD 형식을 YYYY년 MM월 DD일로 변환
 */
export const formatDateKorean = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${year}년 ${month}월 ${day}일`;
};

/**
 * YYYY-MM-DD 형식을 YYYY.MM.DD로 변환
 */
export const formatDateDot = (dateStr) => {
  if (!dateStr) return '';
  return dateStr.replace(/-/g, '.');
};