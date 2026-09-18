/**
 * Avatar — shows a profile photo if available, falls back to initials
 * Props:
 *   src      – image URL
 *   name     – used for fallback initials + alt text
 *   size     – 'sm' | 'md' | 'lg' | 'xl'
 *   className – extra classes for the wrapper
 */
export default function Avatar({ src, name = '', size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-9 h-9 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-20 h-20 text-2xl',
  };

  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((n) => n.charAt(0).toUpperCase())
    .join('');

  if (src) {
    return (
      <img
        src={src}
        alt={`Dr. ${name}`}
        className={`${sizeMap[size]} rounded-2xl object-cover object-top shrink-0 ${className}`}
        onError={(e) => {
          // Graceful fallback if image fails to load
          e.target.style.display = 'none';
          e.target.nextSibling && (e.target.nextSibling.style.display = 'flex');
        }}
      />
    );
  }

  return (
    <div
      className={`${sizeMap[size]} rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200
                  flex items-center justify-center font-bold text-primary-700 shrink-0 ${className}`}
    >
      {initials || '?'}
    </div>
  );
}
