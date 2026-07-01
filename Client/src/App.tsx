import AddTask from "./components/AddTask"
import AllTransaction from "./components/AllTransaction"
import SpendingChart from "./components/SpendingChart"

const App = () => {
  return (
    <div className="w-[70%] mx-auto">
      <AddTask />
      <AllTransaction />
      <SpendingChart />
    </div>
  )
}

export default App
