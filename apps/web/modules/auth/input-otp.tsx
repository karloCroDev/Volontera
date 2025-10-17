'use client';

// External packages
import * as React from 'react';
import { OTPInput, SlotProps } from 'input-otp';
import { twJoin } from 'tailwind-merge';

export const InputOTP = () => {
	return (
		<OTPInput
			maxLength={6}
			containerClassName="group mt-8 flex items-center has-[:disabled]:opacity-30"
			onChange={(val) => {
				// TODO: Napravi da mogu pratiti koja je pozicja
				console.log(val);
			}}
			render={({ slots }) => (
				<div className="flex gap-8">
					{slots.map((slot, idx) => (
						<Slot key={idx} {...slot} />
					))}
				</div>
			)}
		/>
	);
};

const Slot = ({ isActive, char }: SlotProps) => (
	<div
		className={twJoin(
			'border-accent group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20 relative flex size-20 items-center justify-center rounded-lg border text-2xl font-medium outline transition-all',
			isActive
				? 'outline-accent-foreground outline-4'
				: 'outline-accent-foreground/20 outline-0'
		)}
	>
		{char && <p>{char}</p>}
	</div>
);
