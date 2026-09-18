export default function Spinner({ size = 'md', fullPage = false }) {
  const sizeMap = { sm: 'h-5 w-5 border-2', md: 'h-9 w-9 border-[3px]', lg: 'h-14 w-14 border-4' };

  const spinner = (
    <div
      className={`${sizeMap[size]} animate-spin rounded-full border-surface-200 border-t-primary-600`}
      role="status"
      aria-label="Loading"
    />
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-3">
          {spinner}
          <p className="text-sm text-slate-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex flex-col items-center gap-3">
        {spinner}
        <p className="text-sm text-slate-400 font-medium">Loading...</p>
      </div>
    </div>
  );
}
