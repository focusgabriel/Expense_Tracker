const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="h-36 rounded-xl bg-slate-200"
          />
        ))}
      </div>

      {/* Chart + Recent Transactions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-96 rounded-xl bg-slate-200 lg:col-span-2" />

        <div className="h-96 rounded-xl bg-slate-200" />
      </div>
    </div>
  );
};

export default DashboardSkeleton;