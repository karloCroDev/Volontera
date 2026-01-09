'use client';

// External packages
import * as React from 'react';
import { Radio, RadioGroup } from 'react-aria-components';
import { Error } from '@/components/ui/error';

// Components
import { RadioButtonVisual } from '@/components/ui/radio';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

// Hooks
import { useAppType } from '@/hooks/data/onboarding';

// Lib
import { toast } from '@/lib/utils/toast';
import { withReactQueryProvider } from '@/lib/utils/react-query';
import { AppTypeSchemaArgs } from '@repo/schemas/onboarding';

export const SelectType = withReactQueryProvider(() => {
	const [type, setType] = React.useState<AppTypeSchemaArgs['appType']>('USER');
	const [error, setError] = React.useState('');
	const router = useRouter();
	const { mutate, isPending } = useAppType();

	console.log(type);
	return (
		<div className="flex flex-col items-end justify-center">
			<RadioGroup
				className="mt-8 flex w-full flex-col gap-8 self-start lg:mt-12"
				onChange={(val) => setType(val as AppTypeSchemaArgs['appType'])}
				defaultValue={type}
			>
				<Radio className="group" value="USER">
					<RadioButtonVisual titleLabel="User">
						Apply and attend various erasmus programme, or volunteer actions and
						similar events!
					</RadioButtonVisual>
				</Radio>
				<Radio className="group" value="ORGANIZATION">
					<RadioButtonVisual titleLabel="Organization">
						Manifest the erasmus programme or volunteer action etc.
					</RadioButtonVisual>
				</Radio>
			</RadioGroup>
			<Error className="mr-auto mt-3">{error}</Error>
			<Button
				className="mt-8 self-end"
				size="md"
				colorScheme="bland"
				isDisabled={!type}
				isLoading={isPending}
				onPress={() => {
					mutate(
						{
							appType: type,
						},
						{
							onSuccess: ({ message, title }) => {
								router.push('/onboarding/additional-information');
								toast({
									title,
									content: message,
									variant: 'success',
								});
							},

							onError: ({ message }) => {
								setError(message);
							},
						}
					);
				}}
			>
				Next
			</Button>
		</div>
	);
});
