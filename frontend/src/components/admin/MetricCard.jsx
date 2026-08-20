export const MetricCard = ({ label, value, hint, negative }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-2 text-xl font-bold text-norte-dark">{value}</p>

      {hint && (
        <p
          className={`mt-1 text-xs ${
            negative ? "text-red-600" : "text-norte-forest"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};
