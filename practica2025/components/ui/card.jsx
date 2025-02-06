export function Card({ children, className }) {
  return <div className={`border rounded shadow ${className}`}>{children}</div>;
}

export function CardContent({ children, className }) {
  return <div className={`${className}`}>{children}</div>;
}



export function CardTitle({ children, className }) {
  return <h2 className={`text-lg font-bold ${className}`}>{children}</h2>;
}