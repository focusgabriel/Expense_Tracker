import type { JSX } from "react/jsx-runtime";

type transcCardProps = {
  title: string;
  amount: number;
  content: string | JSX.Element | boolean;
  icon?: string;
  alternate?: string;
}

// designing the total income, total expense and net balance card component for better representationing and positioning 
const TranscCard = ({title, amount, content, icon, alternate}: transcCardProps) => {
  return (
    <div className="flex min-h-28 items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:shadow-sm">
      <div className="min-w-0">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</h4>
        <h2 className="mt-2 truncate text-2xl font-bold text-slate-900">&#8358;{amount}</h2>
        <p className="mt-1 text-sm text-slate-400">{content}</p>
      </div>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
        <img src={icon} alt={alternate} className="h-7 w-7 object-contain" />
      </div>
    </div>
  )
}

export default TranscCard
