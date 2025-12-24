'use client';

// External packages
import * as React from 'react';
import { Form } from 'react-aria-components';
import { Search } from 'lucide-react';
import { Controller } from 'react-hook-form';

// Components
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Schemas
import { searchSchema, SearchArgs } from '@repo/schemas/direct-messages';

export const UsersSearch = () => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<SearchArgs>({
		resolver: zodResolver(searchSchema),
		defaultValues: {
			query: '',
		},
	});

	const onSubmit = async (data: SearchArgs) => {
		console.log(data);
		return data;
	};

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<Controller
				control={control}
				name="query"
				render={({ formState }) => (
					<Input
						label="Search for conversation"
						className="mb-4"
						iconLeft={<Search className="size-4" />}
						inputProps={formState}
						error={errors.query?.message}
					/>
				)}
			/>
		</Form>
	);
};
