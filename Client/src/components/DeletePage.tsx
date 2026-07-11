import axios from "axios"
// import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"

const DeletePage = () => {
  // const [transact, setTransact] = useState()
  const { id } = useParams();

  const handleClick = () => {

    // fetch(`http://localhost:3000/api/v1/deleteTransaction/${id}`)

    axios.delete(`http://localhost:3000/api/v1/deleteTransaction/${id}`)
  }

 
  return (
    <div className="h-screen">
      <div className="w-[50%] mx-auto h-[50vh] items-center p-10">
        <h2 className="md:text-2xl sm:text-xl">Are you sure, you want to delete this item</h2>
        <Link to="/analytics"><button onClick={handleClick} className="bg-red-600 text-white font-medium p-2 rounded-lg m-2 w-[20%] cursor-pointer">Proceed</button></Link>
        <Link to="/analytics"><button className="bg-emerald-500 text-white font-medium p-2 w-[20%] rounded-lg m-2 cursor-pointer">Cancel</button></Link>
      </div>
    </div>
  )
}

export default DeletePage