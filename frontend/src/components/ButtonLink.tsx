import { Link, LinkProps } from '@tanstack/react-router';
import { forwardRef } from 'react';
import clsxm from '../utils/clsxm';

interface ButtonLinkProps extends LinkProps {
  className?: string;
}

const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>((props, ref) => {
  return (
    <Link {...props} ref={ref} className={clsxm(props.className, 'flex gap-3 px-6 py-3 [&.active]:text-primary-500 hover:bg-primary-100 rounded-md transition-colors duration-300 [&.active]:bg-primary-100')}>
      {props.children}
    </Link>
  );
});

export default ButtonLink;