export function Alert({ children, className }) {
    return <div className={`border rounded p-4 ${className}`}>{children}</div>;
  }
  
  export function AlertDescription({ children, className }) {
    return <p className={`text-sm ${className}`}>{children}</p>;
  }