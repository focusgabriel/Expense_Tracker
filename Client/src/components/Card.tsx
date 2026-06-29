const Card = ({type, amount, category, description, date, created_date}) => {
  return (
    <div className="border border-black rounded-lg w-[30%]">
      <h1 className="text-center underline mb-4">{type}</h1>
      <h4>amount: {amount}</h4>
      <h3>category: {category}</h3>
      <p>description: {description}</p>
      <p>date: {date}</p>
      <p>created_date: {created_date}</p>
    </div>
  )
}

export default Card