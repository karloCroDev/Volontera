'use client';

// External packages
import * as React from 'react';
import { Radio, RadioGroup } from 'react-aria-components';

// Components
import { RadioButtonVisual } from '@/components/ui/radio';

export const SelectType = () => {
	return (
		<RadioGroup className="mt-8 flex w-full flex-col gap-8 self-start lg:mt-12">
			<Radio className="group" value="user">
				<RadioButtonVisual titleLabel="User">
					Apply and attend various erasmus programme, or volunteer actions and
					similar events!
				</RadioButtonVisual>
			</Radio>
			<Radio className="group" value="organization">
				<RadioButtonVisual titleLabel="Organization">
					Manifest the erasmus programme or volunteer action etc.
				</RadioButtonVisual>
			</Radio>
		</RadioGroup>
	);
};
