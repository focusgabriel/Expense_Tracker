type transcCardProps = {
  title: string;
  amount: number;
  content: string;
  icon?: string;
  alternate?: string
}
const TranscCard = ({title, amount, content, icon, alternate}: transcCardProps) => {
  return (
    <div className="border border-gray-100 rounded-lg p-2">
      <h4 className="text-xs font-semibold">{title}</h4>
      <h2 className="text-sm">₦{amount}</h2>
      <p className="text-xs text-gray-300">{content}</p>
      <img src={icon} alt={alternate} />
    </div>
  )
}

export default TranscCard