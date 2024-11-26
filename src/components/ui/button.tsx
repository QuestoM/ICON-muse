import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  children: React.ReactNode;
}

export function Button({ 
  children, 
  variant = 'default',
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = `
    relative overflow-hidden
    px-4 py-2 rounded-lg font-medium
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary/50
    active:scale-95
  `;
  
  const variantStyles = {
    default: `
      bg-primary text-white
      hover:bg-primary-dark
      active:bg-primary-dark/90
      disabled:bg-gray-400
    `,
    outline: `
      border-2 border-gray-200
      hover:border-gray-300
      dark:border-gray-700
      dark:hover:border-gray-600
      disabled:border-gray-300
    `
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-200" />
    </button>
  );
} 