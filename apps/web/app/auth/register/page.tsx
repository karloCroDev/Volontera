// External packages
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Components
import { Layout, LayoutColumn } from '@/components/ui/layout-grid';
import { Icon } from '@/components/ui/icon';

// Modules
import { RegisterForm } from '@/modules/auth/register-form';

export default function RegisterPage() {
	return (
		<Layout className="gap-x16 lg:gap-x-20 xl:gap-x-24">
			<LayoutColumn start={1} end={7} className="hidden items-center lg:flex">
				<Icon
					name="register-represntation"
					className="text-primary aspect-[4/3] w-full"
				/>
			</LayoutColumn>
			<LayoutColumn
				start={{
					base: 1,
					lg: 7,
				}}
				end={{
					base: 13,
				}}
				className="flex h-screen flex-col items-center justify-center"
			>
				<div className="w-full">
					<Link href="/auth/login" className="self-start">
						<ArrowLeft />
					</Link>
					<h1 className="lg:text-max mt-6 text-3xl lg:mt-8">
						Create an account
					</h1>
					<p className="text-muted-foreground mt-2 text-sm lg:text-base">
						Alreadyt have an account?
						<Link
							href="/auth/login"
							className="text-background-foreground ml-2 font-bold underline underline-offset-2"
						>
							Login
						</Link>
					</p>
					<RegisterForm />
				</div>
			</LayoutColumn>
		</Layout>
	);
}
