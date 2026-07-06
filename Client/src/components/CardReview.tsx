import type { JSX } from "react/jsx-runtime"

type CardReviewProps = {
  title: string
  content:number | JSX.Element
}

const CardReview = ({title, content}: CardReviewProps) => {
  return (
    <div>
      <p className="text-sm">{title.toUpperCase()}</p>
      <p className={`${title === "Expense" ? "text-red-500 font-bold" : "text-green-500 font-bold"}`}>&#8358;{content}</p>
    </div>
  )
}

export default CardReview