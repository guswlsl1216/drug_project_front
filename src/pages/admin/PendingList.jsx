import InquiryList from "./InquiryList"

const PendingList = ({source}) => {
  return (
    <InquiryList source={source} mode="pending" />
  )
}

export default PendingList