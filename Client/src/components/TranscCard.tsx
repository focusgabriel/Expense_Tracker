type transcCardProps = {
  title: string;
  amount: number;
  content: string;
  icon?: string;
  alternate?: string
}
const TranscCard = ({title, amount, content, icon, alternate}: transcCardProps) => {
  return (
    <div className="border border-gray-100 rounded-lg p-2 flex justify-between">
      <div className="flex-col">
        <h4 className="text-xs font-semibold">{title}</h4>
        <h2 className="text-sm">₦{amount}</h2>
        <p className="text-xs text-gray-300">{content}</p>
      </div>
      <div className="bg-gray-100 rounded-lg h-8">
        <img src={icon} alt={alternate} width={30} />
      </div>
    </div>
  )
}

export default TranscCard