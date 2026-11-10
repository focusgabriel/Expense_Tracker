import { useEffect } from "react"
import refreshClient from "../api/fetch"


const getBudget = () => {

  const Budget = async () => {
    await refreshClient.get("/budgetExpense")
  }

  return (
    <div>
      
    </div>
  )
}

export default getBudget
