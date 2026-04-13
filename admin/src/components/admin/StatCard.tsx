type StatCardProps = {
  label: string;
  value: string;
  hint: string;
};

export default function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <h3 className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{value}</h3>
      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{hint}</p>
    </div>
  );
}
