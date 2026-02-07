'use client';

// External packages
import * as React from 'react';
import { OTPInput, SlotProps } from 'input-otp';
import { twJoin } from 'tailwind-merge';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Components
import { Error } from '@/components/ui/error';
import { Button } from '@/components/ui/button';

// Hooks
import { useResetEmail, useVerifyEmail } from '@/hooks/data/auth';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';

export const InputOTP = withReactQueryProvider(() => {
	const searchParams = useSearchParams();
	const router = useRouter();

	const { mutate: mutateVerifyEmail, isPending: isPendingVerify } =
		useVerifyEmail();
	const { mutate: mutateResetEmail } = useResetEmail();

	const email = searchParams.get('email') || '';

	const [error, setError] = React.useState('');
	return (
		<div>
			<OTPInput
				maxLength={6}
				containerClassName="group mt-8 flex items-center has-[:disabled]:opacity-30 justify-center"
				onChange={(val) => {
					if (val.length === 6) {
						mutateVerifyEmail(
							{ code: val, email },
							{
								onSuccess: () => {
									router.push('/home');
								},
								onError: ({ message }) => {
									setError(message);
								},
							}
						);
					}
				}}
				render={({ slots }) => (
					<div className="flex gap-2 sm:gap-4 lg:gap-8">
						{slots.map((slot, idx) => (
							<Slot key={idx} {...slot} />
						))}
					</div>
				)}
			/>
			<div className="flex flex-col items-baseline justify-between sm:flex-row sm:text-sm md:text-base">
				<p className="text-muted-foreground mt-7">
					Different account?
					<Link
						href="/login"
						className="text-background-foreground ml-2 underline underline-offset-4"
					>
						Login!
					</Link>
				</p>
				<Button
					variant="blank"
					className="px-0 underline-offset-8 transition-all hover:underline md:px-4"
					iconRight={<ArrowRight className="size-4" />}
					onPress={() => {
						mutateResetEmail({ email });
					}}
					isLoading={isPendingVerify}
				>
					Send new verification code
				</Button>
			</div>
			{error && <Error className="mt-4 text-base">{error}</Error>}
		</div>
	);
});

const Slot = ({ isActive, char }: SlotProps) => (
	<div
		className={twJoin(
			'border-accent group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20 relative flex size-12 items-center justify-center rounded-lg border text-2xl font-medium outline transition-all lg:size-20',
			isActive
				? 'outline-accent-foreground outline-4'
				: 'outline-accent-foreground/20 outline-0'
		)}
	>
		{char && <p>{char}</p>}
	</div>
);
