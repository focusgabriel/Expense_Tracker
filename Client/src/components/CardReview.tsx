import type { JSX } from "react/jsx-runtime"

type CardReviewProps = {
  title: string
  content:number | JSX.Element
}

const CardReview = ({title, content}: CardReviewProps) => {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
      <p className={`mt-1 text-xl font-bold ${title === "Expense" ? "text-red-500" : "text-green-600"}`}>
        &#8358;{content}
      </p>
    </div>
  )
}

export default CardReview