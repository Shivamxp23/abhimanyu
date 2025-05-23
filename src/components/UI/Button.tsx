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
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center select-none bg-[#c0c0c0] text-black transform scale-90 origin-center';
  
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };
  
  const borderClasses = disabled
    ? 'border-[1px] border-solid border-[#808080] bg-[#c0c0c0]'
    : 'border-[1px] border-solid border-t-white border-l-white border-r-[#808080] border-b-[#808080] hover:bg-[#dfdfdf]';
  
  const activeClasses = disabled
    ? ''
    : 'active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white active:pt-[4px] active:pl-[4px] active:pr-[2px] active:pb-[2px]';
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  const variantClasses = {
    primary: '',
    secondary: 'bg-opacity-90'
  };
  
  const classes = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${borderClasses}
    ${activeClasses}
    ${disabledClasses}
    ${variantClasses[variant]}
    ${className}
  `;
  
  return (
    <button 
      className={classes} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;