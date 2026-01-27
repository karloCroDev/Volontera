'use client';

// External packages
import * as React from 'react';
import {
	ComboBox as AriaComboBox,
	ComboBoxProps,
	ListBox,
	ListBoxItem,
	ListBoxItemProps,
	Popover,
} from 'react-aria-components';

// Components
import { Input, InputProps } from '@/components/ui/input';
import { twJoin } from 'tailwind-merge';

type ComboBoxWrapperProps<T extends object> = Omit<
	ComboBoxProps<T>,
	'children'
> &
	React.ComponentPropsWithRef<'div'> & {
		inputProps: InputProps;
	};

export function ComboBoxWrapper<T extends object>({
	inputProps,
	children,
	items,
	...rest
}: ComboBoxWrapperProps<T>) {
	return (
		<AriaComboBox {...rest}>
			<div>
				<Input {...inputProps} />
			</div>

			<Popover className="bg-muted border-input-border flex w-[var(--trigger-width)] flex-col gap-x-3 gap-y-2 rounded-md border p-2">
				<ListBox items={items}>{children}</ListBox>
			</Popover>
		</AriaComboBox>
	);
}

export const ComboBoxItems: React.FC<
	React.ComponentPropsWithoutRef<'div'> &
		ListBoxItemProps & {
			removeUnderline?: boolean;
		}
> = ({ removeUnderline = false, ...rest }) => (
	<ListBoxItem
		{...rest}
		className={twJoin(
			'cursor-pointer py-2',
			!removeUnderline && 'border-input-border border-b'
		)}
	/>
);
