import { Link, LinkProps } from '@tanstack/react-router';
import { forwardRef } from 'react';
import clsxm from '../utils/clsxm';

interface ButtonLinkProps extends LinkProps {
  className?: string;
}

const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>((props, ref) => {
  return (
    <Link
      {...props}
      ref={ref}
      className={clsxm(
        props.className,
        '[&.active]:text-primary-500 hover:bg-primary-100 [&.active]:bg-primary-100 flex gap-3 rounded-md px-6 py-3 transition-colors duration-300'
      )}
    >
      {props.children}
    </Link>
  );
});

export default ButtonLink;
