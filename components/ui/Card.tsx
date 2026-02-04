
export function Card({ children, className = '' }) {
  return <div className={`border rounded-lg shadow ${className}`}>{children}</div>;
}
