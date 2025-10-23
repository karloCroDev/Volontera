import { Layout, LayoutColumn } from '@/components/ui/layout-grid';
import { InputOTP } from '@/modules/auth/input-otp';
import Link from 'next/link';

export default function VerifyOtp() {
	return (
		<Layout>
			<LayoutColumn
				className="flex h-[100vh] flex-col items-center justify-center"
				start={1}
				end={13}
			>
				<h1 className="text-max">Verification code</h1>
				<p>
					We sent you a six digit code to your [email address]; enter it below
					to continue
				</p>
				<InputOTP />

				<p className="text-muted-foreground mt-7">
					Choose different account, no worries? Go back to
					<Link
						href="/login"
						className="text-background-foreground ml-2 underline underline-offset-4"
					>
						login
					</Link>
				</p>
			</LayoutColumn>
		</Layout>
	);
}
