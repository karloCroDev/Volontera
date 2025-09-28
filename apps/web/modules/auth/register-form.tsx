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

export const RegisterForm = () => {
	return (
		<Form className="mt-12 flex flex-col gap-8 lg:mt-16">
			<div className="flex gap-8">
				<div className="flex-1">
					<Label htmlFor="Email">First name</Label>
					<Input id="Email" label="Enter your email..." className="mt-2" />
				</div>
				<div className="flex-1">
					<Label htmlFor="Email">Last name</Label>
					<Input id="Email" label="Enter your email..." className="mt-2" />
				</div>
			</div>
			<div>
				<Label htmlFor="Email">Email</Label>
				<Input id="Email" label="Enter your email..." className="mt-2" />
			</div>
			<div>
				<Label htmlFor="password">Password</Label>
				<Input id="password" label="Enter your password..." className="mt-2" />
			</div>

			<Button className="w-full" size="lg" colorScheme="yellow">
				Register
			</Button>

			<Separator />
			<Button
				className="w-full"
				size="lg"
				colorScheme="bland"
				iconLeft={<Icon name="google" className="text-background" />}
			>
				Create account with google
			</Button>
		</Form>
	);
};
