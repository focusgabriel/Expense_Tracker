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
      <div className="w-full md:w-[50%] md:mx-auto min-h-[50vh] sm:p-10 p-4 flex flex-col items-center justify-center">
        <h2 className="md:text-2xl text-xl text-center">Are you sure, you want to delete this item</h2>
        <div className="mt-6 flex gap-4">
          <Link to="/analytics"><button onClick={handleClick} className="bg-red-600 text-white font-medium p-2 rounded-lg w-24 sm:w-28 cursor-pointer">Proceed</button></Link>
          <Link to="/analytics"><button className="bg-emerald-500 text-white font-medium p-2 w-24 sm:w-28 rounded-lg cursor-pointer">Cancel</button></Link>
        </div>
      </div>
    </div>
  )
}

export default DeletePage