'use client';

// External packages
import * as React from 'react';
import { Form } from 'react-aria-components';

// Components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export const ResetPasswordForm = () => {
	return (
		<Form className="mt-12 flex flex-col gap-8 lg:mt-16">
			<div>
				<Label htmlFor="Password">Password</Label>
				<Input
					id="Password"
					label="Enter your new password..."
					className="mt-2"
				/>
			</div>
			<div>
				<Label htmlFor="Password">Repeat password</Label>
				<Input
					id="Password"
					label="Repeat your new password..."
					className="mt-2"
				/>
			</div>
			<Button className="w-full" size="lg" colorScheme="orange">
				Reset password
			</Button>
		</Form>
	);
};
