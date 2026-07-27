import { Lightbulb, Sparkles, Brain, TrendingUp, Clock, BarChart3 } from "lucide-react";

const Insight = () => {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-100/60 bg-linear-to-br from-indigo-50 via-white to-purple-50 p-8 sm:p-12 shadow-sm shadow-indigo-100/50">
        {/* Decorative background elements */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-200/20 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-purple-200/20 blur-3xl" />

        {/* Icon */}
        <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-200/50 ring-4 ring-white">
          <Lightbulb size={32} className="text-white" strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h2 className="relative mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
          Insights
        </h2>

        {/* Subtitle */}
        <p className="relative mb-8 text-base leading-relaxed text-slate-500 sm:text-lg">
          Uncover hidden patterns in your spending, get smart saving suggestions, and
          receive personalized financial tips — all powered by intelligent analysis.
        </p>

        {/* Coming Soon Badge */}
        <div className="relative mb-8 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200/60 px-4 py-2">
          <Sparkles size={16} className="text-amber-500" strokeWidth={1.5} />
          <span className="text-sm font-semibold text-amber-700">
            Coming Soon
          </span>
        </div>

        {/* Feature Preview Cards */}
        <div className="relative grid gap-3 sm:grid-cols-2">
          <div className="group rounded-xl border border-slate-200/60 bg-white/80 p-4 transition-all duration-200 hover:border-indigo-200/60 hover:shadow-sm hover:shadow-indigo-100/50">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 transition-colors group-hover:bg-indigo-200">
              <Brain size={18} strokeWidth={1.5} />
            </div>
            <h3 className="mb-1 text-sm font-semibold text-slate-800">Smart Analysis</h3>
            <p className="text-xs leading-relaxed text-slate-400">
              AI-powered insights that understand your unique spending habits.
            </p>
          </div>

          <div className="group rounded-xl border border-slate-200/60 bg-white/80 p-4 transition-all duration-200 hover:border-indigo-200/60 hover:shadow-sm hover:shadow-indigo-100/50">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-200">
              <TrendingUp size={18} strokeWidth={1.5} />
            </div>
            <h3 className="mb-1 text-sm font-semibold text-slate-800">Saving Tips</h3>
            <p className="text-xs leading-relaxed text-slate-400">
              Actionable recommendations to help you save more every month.
            </p>
          </div>

          <div className="group rounded-xl border border-slate-200/60 bg-white/80 p-4 transition-all duration-200 hover:border-indigo-200/60 hover:shadow-sm hover:shadow-indigo-100/50">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600 transition-colors group-hover:bg-violet-200">
              <BarChart3 size={18} strokeWidth={1.5} />
            </div>
            <h3 className="mb-1 text-sm font-semibold text-slate-800">Spending Patterns</h3>
            <p className="text-xs leading-relaxed text-slate-400">
              Visual breakdowns of where your money goes each month.
            </p>
          </div>

          <div className="group rounded-xl border border-slate-200/60 bg-white/80 p-4 transition-all duration-200 hover:border-indigo-200/60 hover:shadow-sm hover:shadow-indigo-100/50">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-600 transition-colors group-hover:bg-sky-200">
              <Clock size={18} strokeWidth={1.5} />
            </div>
            <h3 className="mb-1 text-sm font-semibold text-slate-800">Monthly Reports</h3>
            <p className="text-xs leading-relaxed text-slate-400">
              Detailed summaries delivered straight to your dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-400">
          We're working hard to bring you powerful financial intelligence.
        </p>
        <p className="mt-1 text-xs text-slate-300">
          Stay tuned — big things are coming.
        </p>
      </div>
    </div>
  );
};

export default Insight;