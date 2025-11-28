import requestHandler from "../utils/requestHandler"

const getRoutine = async (requestDate)=>{
  const res= await requestHandler({
    method:"get",
    url:"/routine/getRoutine"
  })
  
  return res.data
}

const performRoutine = async (eventId, requestDate, performed_times)=>{
  const res= await requestHandler({
    method:"post",
    url:"/routine/performed/"+eventId,
    payload:{
      "date":requestDate,
      "performed_times":performed_times
    }
  })
  return res.data
}

export {getRoutine, performRoutine}