// Commponents
import { Layout, LayoutColumn } from '@/components/ui/layout-grid';

// Modules
import { InputOTP } from '@/modules/auth/input-otp';

export default function VerifyOtp() {
	return (
		<Layout>
			<LayoutColumn
				className="flex h-screen flex-col items-center justify-center"
				start={1}
				end={13}
			>
				<h1 className="lg:text-max text-3xl lg:mt-8">Verification code</h1>
				<p className="text-muted-foreground mt-4 text-center text-sm md:text-base">
					We sent you a six digit code to your [email address]; enter it below
					to continue
				</p>
				<InputOTP />
			</LayoutColumn>
		</Layout>
	);
}
