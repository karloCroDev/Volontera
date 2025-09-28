'use client';

// External packages
import * as React from 'react';
import { Form } from 'react-aria-components';

// Components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@/components/ui/icon';
import Link from 'next/link';

export const LoginForm = () => {
	return (
		<Form className="mt-12 flex flex-col gap-8 lg:mt-16">
			<div>
				<Label htmlFor="Email">Email</Label>
				<Input id="Email" label="Enter your email..." className="mt-2" />
			</div>
			<div>
				<div className="flex items-baseline justify-between">
					<Label htmlFor="password">Password</Label>
					<Link
						href="/login/forgot-password"
						className="hover:text-popover text-muted-foreground underline underline-offset-4 transition-colors"
					>
						Forgot Passowrd?
					</Link>
				</div>
				<Input id="password" label="Enter your password..." className="mt-2" />
			</div>

			<Button className="w-full" size="lg" colorScheme="yellow">
				Login
			</Button>

			<Separator />
			<Button
				className="w-full"
				size="lg"
				colorScheme="bland"
				iconLeft={<Icon name="google" className="text-background" />}
			>
				Login with google
			</Button>
		</Form>
	);
};
