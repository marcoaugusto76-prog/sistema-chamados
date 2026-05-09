
export default function MetricCard({ title, icon, iconColor, value, statIcon, statText, statColor }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-card-gap flex flex-col justify-between h-32">
      <div className="flex justify-between items-start">
        <span className="text-label-caps font-label-caps text-on-surface-variant">{title}</span>
        <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
      </div>
      <div>
        <span className="text-headline-lg font-headline-lg text-on-surface">{value}</span>
        <div className={`flex items-center gap-1 mt-1 text-body-sm font-body-sm ${statColor}`}>
          {statIcon && <span className="material-symbols-outlined text-[16px]">{statIcon}</span>}
          <span>{statText}</span>
        </div>
      </div>
    </div>
  );
}
