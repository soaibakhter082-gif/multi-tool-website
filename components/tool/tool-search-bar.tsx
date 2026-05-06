interface ToolSearchBarProps {
  actionPath: string;
  defaultValue?: string;
  inputName?: string;
  placeholder?: string;
}

export function ToolSearchBar({
  actionPath,
  defaultValue = "",
  inputName = "q",
  placeholder = "Search tools by name (example: JSON, PDF, calculator)...",
}: ToolSearchBarProps) {
  return (
    <form
      action={actionPath}
      method="get"
      className="flex w-full flex-col gap-3 sm:flex-row sm:items-center"
      role="search"
      aria-label="Tool search"
    >
      <label htmlFor={inputName} className="sr-only">
        Search tools
      </label>
      <input
        id={inputName}
        name={inputName}
        type="search"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2"
      />
      <button
        type="submit"
        className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
      >
        Search
      </button>
    </form>
  );
}
