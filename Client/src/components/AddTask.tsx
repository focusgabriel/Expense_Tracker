import { useEffect, useRef, useState } from "react"
import Card from "./Card";
// import type { Transaction } from "../constants"

type Transaction = {
  type: "income" | "expense" | string;
  amount: number;
  category: string;
  description: string;
  date: string ;
  created_date: string;
}

const AddTask = () => {
  const [transaction, setTransaction]= useState<Transaction>(null);
  const [allTrans, setAllTrans] = useState<Transaction[]>([])
    const Type = useRef<HTMLSelectElement>(null)
    const Amount = useRef<HTMLInputElement>(null)
    const Category = useRef<HTMLInputElement>(null)
    const Description = useRef<HTMLInputElement>(null)
    const newDate = useRef<HTMLInputElement>(null)
    const Current_date = useRef<HTMLInputElement>(null)

    const handleClick = () => {
      const newTransaction = {
        type: Type.current.value.toLowerCase(),
        amount: Number(Amount.current.value.toLowerCase()),
        category: Category.current.value.toLowerCase(),
        description: Description.current.value.toLowerCase(),
        date: String(Current_date.current.value),
        created_date: String(Current_date.current.value)
      }

      setTransaction(newTransaction)
    }
    
    // console.log(transaction)

  const handleSubmit = async(e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
  try{

    const response = await fetch("http://localhost:3000/api/v1/addTransaction",  {
      method:"POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    });

    const data = await response.json();
    if(!response.ok){
      throw new Error("Error sending data")
    }
    console.log(data);
    

  } catch(error) {
    console.log(error)
  }

  }

  const getTrans = async() => {
    try{
        fetch("http://localhost:3000/api/v1/getTransaction")
        .then(res => res.json())
        .then(data => setAllTrans(data))
    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getTrans();
  }, [])

  return (
    <div>
      {/* <form action="http://localhost:3000/api/v1/addTransaction" method="POST"> */}
      <form onSubmit={handleSubmit}>
        <div className="box">
          <label htmlFor="Type">Type</label>
          <select name="type" ref={Type}>
            <option value="income">INCOME</option>
            <option value="expense">EXPENSE</option>
          </select>
        </div>

        <div className="box">
          <label htmlFor="amount">Amount</label>
          <input
            className="input"
            type="number"
            placeholder="enter your amount"
            min={3}
            ref={Amount}
            name="amount"
          />
        </div>

        <div className="box">
          <label htmlFor="Category">Category</label>
          <input
            className="input"
            type="text"
            placeholder="enter the category of your transaction"
            ref={Category}
            name="category"
          />
        </div>

        <div className="box">
          <label htmlFor="description">Description</label>
          <input
            className="input"
            type="text"
            placeholder="enter the description of your transaction"
            minLength={7}
            ref={Description}
            name="description"
          />
        </div>

        <div className="box">
          <label htmlFor="date">Date</label>
          <input className="input" type="date" ref={newDate} name="date" />
        </div>

        <div className="box">
          <label htmlFor="date">CreatedAt</label>
          <input className="input" type="date" ref={Current_date} name="current_date" />
        </div>
        <input type="submit" onClick={handleClick} />
      </form>

      <div>
        
      {allTrans.map((item, index) => (
        <Card key={index} type={item.type} amount={item.amount} category={item.category} description={item.description} date={item.date} created_date={item.created_date} />
      ))}
        
      </div>

      
    </div>
  )
}

export default AddTask