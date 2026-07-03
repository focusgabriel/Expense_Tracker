import {CarFront, Wifi, Wallet} from "lucide-react"

const Card = ({type, amount, category, description, date, created_date}) => {
  const formatDate = (dateValue) => {
    const date = new Date(dateValue);
    return date.toLocaleDateString("en-us", {
      month: "long",
      day: "numeric",
      year: "numeric"
    })
  }
    return (
      <div className="border border-black rounded-lg w-[30%] flex justify-between">
        <h3>{category === "Transportation" ?  <CarFront size={50} color="green" /> :  category === "Bill" ? <Wifi size={50} color="#763ef9" className="inline-block" /> : category === "salary" ? <Wallet size={50} color="green" /> : null
        }</h3>
        <div className="flex-col">
          <h3>{category}</h3>
          <span>{formatDate(date)}</span>
          <span className="">{type}</span>
        </div>
        <h4 className={`${type==="expense" ? "text-red-600 before:content-['-']" : "before:content-['+'] text-green-500"} font-bold text-xl`}>₦{amount}</h4>
      </div>
  )
}

export default Card