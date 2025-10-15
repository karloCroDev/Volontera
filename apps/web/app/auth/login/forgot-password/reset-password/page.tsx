// Components
import { Layout, LayoutColumn } from '@/components/ui/layout-grid';
import { Icon } from '@/components/ui/icon';

// Modules
import { ResetPasswordForm } from '@/modules/auth/reset-password-form';

export default function ForgotPasswordPage() {
	return (
		<Layout className="gap-x16 lg:gap-x-20 xl:gap-x-24">
			<LayoutColumn
				start={{
					base: 1,
				}}
				end={{
					base: 13,
					lg: 7,
				}}
				className="flex h-[100vh] flex-col items-center justify-center"
			>
				<div className="w-full">
					<h1 className="lg:text-max mt-6 text-3xl lg:mt-8">Reset Password</h1>
					<p className="text-muted-foreground mt-2 text-sm lg:text-base">
						It&apos;s actually you awesome, change your password!
					</p>
					<ResetPasswordForm />
				</div>
			</LayoutColumn>
			<LayoutColumn
				start={7}
				end={13}
				className="hidden items-center justify-end lg:flex"
			>
				<Icon
					name="password-represntation"
					className="text-primary aspect-[4/3] w-full"
				/>
			</LayoutColumn>
		</Layout>
	);
}
