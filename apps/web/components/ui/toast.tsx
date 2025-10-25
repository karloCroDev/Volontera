'use client';

// External packages
import * as React from 'react';
import * as RadixToast from '@radix-ui/react-toast';
import { twJoin } from 'tailwind-merge';
import { CircleAlert, CircleCheck, Clock, X } from 'lucide-react';

// Lib
import { subscribe, ToastArgs } from '@/lib/utils/toast';

export const Toaster = () => {
	const [toasts, setToasts] = React.useState<ToastArgs[]>([]);

	React.useEffect(() => {
		const unsubscribe = subscribe((toast) => {
			setToasts((prev) => [...prev, toast]);
		});

		return unsubscribe;
	}, []);
	return (
		<RadixToast.Provider swipeDirection="right" duration={2000}>
			{toasts.map(({ title, content, variant }, indx) => (
				<Toast key={indx} title={title} content={content} variant={variant} />
			))}

			<RadixToast.Viewport className="fixed inset-x-6 bottom-6 z-10 md:inset-auto md:bottom-12 md:right-12 md:w-96" />
		</RadixToast.Provider>
	);
};

const Toast: React.FC<ToastArgs> = ({ title, content, variant }) => (
	<RadixToast.Root
		className={twJoin(
			'animate-in border-input-border bg-muted group relative my-4 flex w-full items-center justify-between rounded-lg border px-6 py-4',
			'data-[state=closed]:slide-out-to-right data-[state=closed]:animate-out data-[state=open]:slide-in-from-bottom transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=end]:opacity-0 data-[swipe=move]:duration-100'
		)}
	>
		<div className="flex-1">
			<RadixToast.Title className="text md:text-md text-background-foreground font-semibold">
				{title}
			</RadixToast.Title>
			<RadixToast.Description className="text-muted-foreground text-sm">
				{content}
			</RadixToast.Description>
		</div>
		{variant === 'information' && <Clock className="text-pending size-8" />}
		{variant === 'error' && <CircleAlert className="text-destructive size-8" />}
		{variant === 'success' && <CircleCheck className="text-success size-8" />}
		<RadixToast.Close asChild>
			<X className="text-muted-foreground absolute right-2 top-2 size-3.5 cursor-pointer transition-[opacity] duration-300 group-hover:pointer-events-auto md:pointer-events-none md:opacity-0 md:group-hover:opacity-100" />
		</RadixToast.Close>
	</RadixToast.Root>
);
