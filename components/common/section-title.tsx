interface SectionTitleProps {
  title: string;
  description?: string;
  badgeText?: string;
  center?: boolean;
}

export function SectionTitle({
  title,
  description,
  badgeText,
  center = false,
}: SectionTitleProps) {
  const align = center ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col gap-2 ${align}`}>
      {badgeText ? (
        <p className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
          {badgeText}
        </p>
      ) : null}
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-3xl text-sm leading-7 text-slate-700 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
