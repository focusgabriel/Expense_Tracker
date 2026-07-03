import AllTransaction from '../components/AllTransaction'
import SpendingChart from '../components/SpendingChart'

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <AllTransaction />
      <SpendingChart />
    </div>
  )
}

export default Dashboard
