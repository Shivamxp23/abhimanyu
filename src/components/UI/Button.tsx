import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center select-none';
  
  const variantClasses = {
    primary: 'bg-gray-300 hover:bg-gray-400 text-black',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-black'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  // Windows 95/98 style border effect
  const borderClasses = 'border-solid border-[1.5px] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf]';
  
  const activeClasses = 'active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a,inset_-2px_-2px_#dfdfdf,inset_2px_2px_#808080]';
  
  const disabledClasses = 'disabled:opacity-50 disabled:cursor-not-allowed';
  
  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${borderClasses}
    ${activeClasses}
    ${disabledClasses}
    ${className}
  `;
  
  return (
    <button 
      className={classes} 
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;