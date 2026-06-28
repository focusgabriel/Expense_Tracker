import { useEffect, useRef, useState } from "react"
import Card from "./Card";
// import type { Transaction } from "../constants"

type Transaction = {
  id: string
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string ;
  created_date: string;
}

const AllTranscation = () => {

  const [trans, setTrans] = useState<Transaction[]>([])

useEffect(() => {
    fetch(`http://localhost:3000/api/v1/getTransaction`)
    .then(res => res.json())
    .then(data => setTrans(data))
    
  }, []);

  return(
    <div className="w-[90%] mx-auto">
      <h1>Hello</h1>
      <ul>
        {trans.map((item, index) => (
          <Card key={index} type={item.type} amount={item.amount} description={item.description} category={item.category} date={item.date} created_date={item.created_date} />
        ))}
      </ul>
    </div>
  )
}