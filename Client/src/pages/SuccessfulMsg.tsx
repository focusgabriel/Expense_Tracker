import { Link } from "react-router-dom"
// import Dashboard from "./Dashboard"

const SuccessfulMsg = () => {
  return (
    <div className="w-full sm:w-full md:w-[40%] h-[50vh] sm:rounded-xl sm:bg-white/65 sm:shadow sm:drop-shadow-white sm:p-6 md:mx-auto my-[10vh] successMsg">
      <h1 className="sm:text-3xl text-center">Successfully added Transaction</h1>
      <p className="text-center text-lg mt-10">
        click here to go back home
      </p>
      <Link to="/" className="text-center bg-emerald-600 text-white rounded-lg p-3 font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 block mt-4">Home</Link>
    </div>
  )
}

export default SuccessfulMsg