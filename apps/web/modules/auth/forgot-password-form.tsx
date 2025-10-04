'use client';

// External packages
import * as React from 'react';
import { Form } from 'react-aria-components';

// Components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export const ForgotPasswordForm = () => {
	return (
		<Form className="mt-12 flex flex-col gap-8 lg:mt-16">
			<div>
				<Label htmlFor="Email">Email</Label>
				<Input id="Email" label="Enter your email..." className="mt-2" />
			</div>
			<Button className="w-full" size="lg">
				Send verification code
			</Button>
		</Form>
	);
};
