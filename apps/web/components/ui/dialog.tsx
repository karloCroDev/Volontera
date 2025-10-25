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
} from 'react-aria-components';

// Components
import { Layout, LayoutColumn } from '@/components/ui/layout-grid';
import { twJoin } from 'tailwind-merge';

export const Dialog: React.FC<
	React.ComponentPropsWithoutRef<'button'> &
		DialogTriggerProps & {
			triggerChildren: React.ReactNode;
			subtitle?: string;
		}
> = ({ children, triggerChildren, title, subtitle, isOpen, ...rest }) => (
	<DialogTrigger {...rest}>
		{triggerChildren}
		<ModalOverlay
			isDismissable
			className="fixed inset-0 isolate z-20 flex min-h-full items-center justify-center overflow-y-auto bg-black/25 text-center backdrop-blur"
		>
			<Layout className="z-max">
				<LayoutColumn
					start={{ base: 1, md: 3, xl: 4 }}
					end={{ md: 11, base: 13, xl: 10 }}
					className="w-full"
				>
					<Modal
						isKeyboardDismissDisabled
						className={({ isEntering, isExiting }) =>
							twJoin(
								'bg-muted z-20 overflow-hidden rounded px-6 text-left lg:px-8 lg:py-6',
								isEntering && 'animate-in fade-in slide-in-from-bottom',
								isExiting && 'animate-out fade-out'
							)
						}
					>
						<AriaDialog className="relative outline-none">
							<Heading className="text-center text-lg" slot="title">
								{title}
							</Heading>
							{subtitle && (
								<p className="text-muted-foreground text-sm">{subtitle}</p>
							)}

							{children}
						</AriaDialog>
					</Modal>
				</LayoutColumn>
			</Layout>
		</ModalOverlay>
	</DialogTrigger>
);
