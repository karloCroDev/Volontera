'use client';

// External packages
import * as React from 'react';
import { Radio, RadioGroup } from 'react-aria-components';
import { AppType } from '@repo/types/onbaording';

// Components
import { RadioButtonVisual } from '@/components/ui/radio';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export const SelectType = () => {
	const [type, setType] = React.useState<AppType>('USER');
	console.log(type);
	const router = useRouter();
	return (
		<div className="flex flex-col items-end justify-center">
			<RadioGroup
				className="mt-8 flex w-full flex-col gap-8 self-start lg:mt-12"
				onChange={(val) => setType(val as AppType)}
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

			<Button
				className="mt-8 self-end"
				size="md"
				colorScheme="bland"
				isDisabled={!type}
				onPress={() => {
					router.push('/login');
				}}
			>
				Next
			</Button>
		</div>
	);
};
