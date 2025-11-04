import requestHandler from "../utils/requestHandler"

const getRoutine = async (requestDate)=>{
  const res= await requestHandler({
    method:"get",
    url:"/routine/getRoutine"
  })
  
  return res.data
}

export default getRoutine