'use client';

// External packages
import * as React from 'react';
import * as RadixToast from '@radix-ui/react-toast';
import { twJoin } from 'tailwind-merge';
import { CircleAlert, CircleCheck, CircleX, Clock } from 'lucide-react';

export const Toast: React.FC<{
	title: string;
	content: string;
	variant: 'success' | 'information' | 'error';
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
}> = ({ title, content, variant, isOpen, setIsOpen }) => {
	return (
		<RadixToast.Provider swipeDirection="right" duration={3000}>
			<RadixToast.Root
				onOpenChange={setIsOpen}
				open={isOpen}
				className={twJoin(
					variant === 'success' && 'border-input-border',
					variant === 'information' && 'border-pending',
					variant === 'error' && 'border-destructive',
					'bg-muted group relative flex w-full items-center justify-between rounded-lg px-6 py-4',
					'data-[state=closed]:animate-slide-out data-[state=open]:animate-slide-in data-[swipe=end]:animate-slide-out data-[swipe=cancel]:-translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:-translate-x-[15%] data-[swipe=cancel]:transition-transform data-[swipe=move]:duration-100'
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
				{variant === 'information' && <Clock className="size-8" />}
				{variant === 'error' && <CircleAlert className="size-8" />}
				{variant === 'success' && <CircleCheck className="size-8" />}
				<RadixToast.Close asChild>
					<CircleX className="absolute right-2 top-2 size-2 cursor-pointer text-gray-100 transition-[opacity] duration-300 group-hover:pointer-events-auto md:pointer-events-none md:opacity-0 md:group-hover:opacity-100" />
				</RadixToast.Close>
			</RadixToast.Root>
			{/* todo: Decide padding on mobile */}
			<RadixToast.Viewport className="z-max fixed inset-x-6 bottom-6 md:inset-auto md:bottom-12 md:left-24 md:w-96" />
		</RadixToast.Provider>
	);
};
