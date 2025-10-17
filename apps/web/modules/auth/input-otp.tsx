'use client';

// External packages
import * as React from 'react';
import { OTPInput, SlotProps } from 'input-otp';
import { twJoin } from 'tailwind-merge';
import { useRouter, useSearchParams } from 'next/navigation';

// Hooks
import { useVerifyEmail } from '@/hooks/data/auth';

export const InputOTP = () => {
	const searchParams = useSearchParams();
	const router = useRouter();

	const { mutate } = useVerifyEmail();

	return (
		<OTPInput
			maxLength={6}
			containerClassName="group mt-8 flex items-center has-[:disabled]:opacity-30"
			onChange={(val) => {
				if (val.length === 6) {
					mutate(
						{ code: val, email: searchParams.get('email') || '' },
						{
							onSuccess: () => {
								router.push('/chat');
							},
						}
					);
				}
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
