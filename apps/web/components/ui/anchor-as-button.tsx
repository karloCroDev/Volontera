// External packages
import { twMerge } from 'tailwind-merge';

// Components
import {
  AdditionalButtonProps,
  getButtonClassNames,
} from '@/components/ui/link-as-button';

export const AnchorAsButton: React.FC<
  React.ComponentPropsWithoutRef<'a'> & AdditionalButtonProps
> = ({
  colorScheme = 'orange',
  variant = 'primary',
  size = 'sm',
  isFullyRounded = false,
  iconLeft,
  iconRight,
  children,
  className,
  ...rest
}) => (
  <a
    {...rest}
    className={twMerge(
      getButtonClassNames({ colorScheme, size, isFullyRounded, variant }),
      className
    )}
  >
    {iconLeft}
    {children}
    {iconRight}
  </a>
);
