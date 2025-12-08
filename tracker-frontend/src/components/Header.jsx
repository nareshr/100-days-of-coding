export default function Header({ title, subtitle, onSwitchPlan, onRefresh }) {
  return (
    <div className="flex items-center justify-between mb-10">
      <div>
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="subtext mt-1">{subtitle}</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onSwitchPlan}
          className="px-4 py-2 bg-white soft-shadow rounded-xl hover:bg-slate-50"
        >
          Switch Plan
        </button>

        <button
          onClick={onRefresh}
          className="px-5 py-2 bg-brand-600 text-white rounded-xl shadow-md hover:bg-brand-700"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
