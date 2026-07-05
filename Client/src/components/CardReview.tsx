
type CardReviewProps = {
  title: string
  content:number
}

const CardReview = ({title, content}: CardReviewProps) => {
  return (
    <div>
      <p className="text-sm">{title}</p>
      <p className={`${title === "expense" ? "text-red-500 font-bold" : "text-green-500 font-bold"}`}>&#8358;{content}</p>
    </div>
  )
}

export default CardReview