// External packages
import * as React from 'react';
import { UserLock } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export const Paywall: React.FC<React.ComponentPropsWithoutRef<'div'>> = ({
	className,
	...rest
}) => (
	<div
		{...rest}
		className={twMerge('flex justify-center gap-4 text-center', className)}
	>
		<UserLock className="text-pending size-8" />
		<p className="text-muted-foreground">
			Become pro user to access this feature
		</p>
	</div>
);
