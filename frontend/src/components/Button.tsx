import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import clsxm from '../utils/clsxm';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { children, className, ...rest } = props;
  return (
    <button
      {...rest}
      ref={ref}
      className={clsxm(
        'font-semi bg-primary-500 hover:bg-primary-800 flex items-center gap-3 rounded-md px-6 py-3 text-sm text-white shadow-lg transition-colors duration-300 disabled:cursor-not-allowed disabled:bg-neutral-700',
        className,
      )}
    >
      {children}
    </button>
  );
});

export default Button;
