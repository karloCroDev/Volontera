'use client';

// External packages
import * as React from 'react';
import {
	Modal,
	ModalOverlay,
	Dialog as AriaDialog,
	DialogTrigger,
	DialogTriggerProps,
	Heading,
	DialogProps,
} from 'react-aria-components';
import { twJoin, twMerge } from 'tailwind-merge';
import { X } from 'lucide-react';

// Components
import {
	ColumnsNumbers,
	Layout,
	LayoutColumn,
} from '@/components/ui/layout-grid';
import { Button } from '@/components/ui/button';

export const Dialog: React.FC<
	React.ComponentPropsWithoutRef<'button'> &
		DialogTriggerProps & {
			triggerChildren: React.ReactNode;
			subtitle?: string;
			startDesktop?: ColumnsNumbers;
			endDesktop?: ColumnsNumbers;
			dialogProps?: React.ComponentPropsWithoutRef<'div'> & DialogProps;
		}
> = ({
	children,
	triggerChildren,
	title,
	subtitle,
	startDesktop = 4,
	endDesktop = 10,
	dialogProps,
	...rest
}) => (
	<DialogTrigger {...rest}>
		{triggerChildren}
		<ModalOverlay
			isDismissable
			className="fixed inset-0 isolate z-20 flex min-h-full items-center justify-center overflow-y-auto bg-black/25 text-center backdrop-blur"
		>
			<Layout className="z-max">
				<LayoutColumn
					start={{ base: 1, md: startDesktop }}
					end={{ md: endDesktop, base: 13 }}
					className="w-full"
				>
					<Modal
						isKeyboardDismissDisabled
						className={({ isEntering, isExiting }) =>
							twMerge(
								'bg-muted border-primary no-scrollbar relative z-20 min-h-80 rounded-2xl border px-6 py-6 text-left lg:px-8',
								isEntering && 'animate-in fade-in',
								isExiting && 'animate-out fade-out',
								dialogProps?.className
							)
						}
					>
						<AriaDialog className="relative outline-none">
							{title && (
								<div className="mb-6">
									<Heading className="text-lg lg:text-xl" slot="title">
										{title}
									</Heading>
									{subtitle && (
										<p className="text-muted-foreground text-sm">{subtitle}</p>
									)}
								</div>
							)}
							<Button
								slot="close"
								variant="blank"
								className="text-muted-foreground absolute right-0 top-0"
							>
								<X className="size-4" />
							</Button>

							{children}
						</AriaDialog>
					</Modal>
				</LayoutColumn>
			</Layout>
		</ModalOverlay>
	</DialogTrigger>
);
