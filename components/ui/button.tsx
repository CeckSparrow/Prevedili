
export function Button({ children, variant = 'solid', className = '', ...props }) {
  const base = 'px-4 py-2 rounded font-semibold';
  const style = variant === 'outline'
    ? 'border border-gray-500 text-gray-700'
    : 'bg-blue-600 text-white';
  return (
    <button className={`${base} ${style} ${className}`} {...props}>
      {children}
    </button>
  );
}
