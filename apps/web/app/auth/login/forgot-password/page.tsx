// External packages
import Link from 'next/link';

// Components
import { Layout, LayoutColumn } from '@/components/ui/layout-grid';
import { ArrowLeft } from 'lucide-react';
import { Icon } from '@/components/ui/icon';

// Modules
import { ForgotPasswordForm } from '@/modules/auth/forgot-password-form';

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
				className="flex h-screen flex-col items-center justify-center"
			>
				<div className="w-full">
					<Link href="/auth/login" className="self-start">
						<ArrowLeft />
					</Link>
					<h1 className="lg:text-max mt-6 text-3xl lg:mt-8">Forgot Password</h1>
					<p className="text-muted-foreground mt-2 text-sm lg:text-base">
						We&apos;ll send you a link to change your email address
					</p>
					<ForgotPasswordForm />
				</div>
			</LayoutColumn>
			<LayoutColumn
				start={7}
				end={13}
				className="hidden items-center justify-end lg:flex"
			>
				<Icon
					name="forgot-password-represntation"
					className="text-accent-foreground aspect-[4/3] w-full"
				/>
			</LayoutColumn>
		</Layout>
	);
}
