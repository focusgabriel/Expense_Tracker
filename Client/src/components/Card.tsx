import {CarFront, Wifi, Wallet, CookingPot, ShieldQuestionMark} from "lucide-react"

const Card = ({type, amount, category, description, date, created_date}) => {
  const formatDate = (dateValue) => {
    const date = new Date(dateValue);
    return date.toLocaleDateString("en-us", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }
    return (
      <div className="grid w-full grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-2.5 border-b border-slate-100 px-3 py-2.5 transition last:border-b-0 hover:bg-slate-50">
        <h3 className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
          {category === "transportation" ?  <CarFront size={18} color="green" /> :  category === "bill" ? <Wifi size={18}  className="inline-block" /> : category === "salary" ? <Wallet size={18} color="green" /> :  category === "food" ? <CookingPot size={18} /> : <ShieldQuestionMark size={20} />
        }</h3>

        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="truncate text-sm font-semibold capitalize leading-5 text-slate-900">{category}</h3>
            <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase leading-4 text-slate-500">{type}</span>
          </div>
          <p className="truncate text-xs leading-4 text-slate-500">{description || formatDate(date)}</p>
        </div>

        <div className="text-right">
          <h4 className={`${type==="expense" ? "text-red-600 before:content-['-']" : "before:content-['+'] text-green-500"} whitespace-nowrap text-sm font-bold`}>&#8358;{amount}</h4>
          <span className="whitespace-nowrap text-[11px] leading-4 text-slate-400">{formatDate(date)}</span>
        </div>
      </div>
  )
}

export default Card
