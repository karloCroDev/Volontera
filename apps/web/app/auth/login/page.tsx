// External packages
import Link from 'next/link';
import axios from 'axios';

// Components
import { Layout, LayoutColumn } from '@/components/ui/layout-grid';
import { LoginForm } from '@/modules/auth/login-form';
import { ArrowLeft } from 'lucide-react';
import { Icon } from '@/components/ui/icon';

export default function LoginPage() {
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
					<Link href="/auth/register" className="self-start">
						<ArrowLeft />
					</Link>
					<h1 className="lg:text-max mt-6 text-3xl lg:mt-8">Login</h1>
					<p className="text-muted-foreground mt-2 text-sm lg:text-base">
						Don&apos;t have an account?
						<Link
							href="/auth/register"
							className="text-background-foreground ml-2 font-bold underline underline-offset-2"
						>
							Register
						</Link>
					</p>
					<LoginForm />
				</div>
			</LayoutColumn>
			<LayoutColumn
				start={7}
				end={13}
				className="hidden items-center justify-end lg:flex"
			>
				<Icon
					name="login-represntation"
					className="text-primary aspect-[4/3] w-full"
				/>
			</LayoutColumn>
		</Layout>
	);
}
