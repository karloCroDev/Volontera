'use client';

// External packages
import * as React from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';

export const SelectContainer: React.FC<
	React.ComponentPropsWithoutRef<'div'> & RadixSelect.SelectProps
> = ({ children, ...rest }) => (
	<RadixSelect.Root {...rest}>
		<RadixSelect.Trigger className="border-input-border flex w-40 cursor-pointer items-center justify-between rounded-md border px-2 py-3 outline-none lg:w-56">
			<RadixSelect.Value placeholder="Select an option" />
			<RadixSelect.Icon>
				<ChevronDown className="size-4" />
			</RadixSelect.Icon>
		</RadixSelect.Trigger>

		<RadixSelect.Portal>
			<RadixSelect.Content
				className="border-input-border bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 mt-4 overflow-hidden rounded-md border"
				position="popper"
				align="start"
			>
				<RadixSelect.Viewport className="flex w-56 flex-col">
					{children}
				</RadixSelect.Viewport>
			</RadixSelect.Content>
		</RadixSelect.Portal>
	</RadixSelect.Root>
);

export const SelectItem: React.FC<{
	itemProps: React.ComponentPropsWithoutRef<'div'> &
		RadixSelect.SelectItemProps;
	title: string;
}> = ({ itemProps, title }) => {
	return (
		<RadixSelect.Item
			{...itemProps}
			className="border-b-input-border hover:bg-accent hover:text-accent-foreground cursor-pointer border-b px-2 py-3 outline-none transition-colors last:border-b-0"
		>
			<RadixSelect.ItemText>{title}</RadixSelect.ItemText>
		</RadixSelect.Item>
	);
};
