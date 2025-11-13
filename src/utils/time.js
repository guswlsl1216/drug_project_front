const time = (isoString) => {
  if(!isoString) return "";

  const localDate = new Date(isoString);
  const kstDate = new Date(localDate.getTime() - 9 * 60 * 60 * 1000)
  const now = new Date();

  const isToday =
    kstDate.getFullYear() === now.getFullYear() &&
    kstDate.getMonth() === now.getMonth() &&
    kstDate.getDate() === now.getDate();
    
  if(isToday){
    return kstDate.toLocaleTimeString("ko-KR", {
      hour: "2-digit", minute:"2-digit",hour12: true
    });
  }else if(kstDate.getFullYear() === now.getFullYear()) {
    return kstDate.toLocaleDateString("ko-KR", {
      month:"2-digit", day:"2-digit", hour: "2-digit", minute:"2-digit",hour12: true
    });
  } else {
    return kstDate.toLocaleDateString("ko-KR", {
      year:"2-digit", month:"2-digit", day:"2-digit"
    })
  }
}
export default time