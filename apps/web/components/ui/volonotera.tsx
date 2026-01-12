// Extetnal packages
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

// Components
import { Icon } from '@/components/ui/icon';

export const VolonteraLogo: React.FC<
	React.ComponentPropsWithoutRef<'div'> & {
		size?: 'sm' | 'md' | 'lg';
	}
> = ({ className, ...rest }) => {
	return (
		<div className={twMerge('flex items-center gap-3', className)} {...rest}>
			<Icon name="logo" className="size-8" />
			<div className="m-0 flex items-end p-0 text-2xl font-light leading-6">
				<span>V</span>
				<span className="mx-1 h-4 w-8 rounded-full border-2 border-current" />
				<span>lontera</span>
			</div>
		</div>
	);
};
