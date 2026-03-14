'use client';

// External packages
import * as React from 'react';
import { useSearchParams } from 'next/navigation';

// Components
import { SelectContainer, SelectItem } from '@/components/ui/select';

// Hooks
import { useSetParams } from '@/hooks/utils/useSetParams';

export const PeriodSelect = () => {
	const params = useSearchParams();
	const { setParams } = useSetParams();

	const durationDays = params.get('durationDays') ?? '30';

	return (
		<SelectContainer
			value={durationDays}
			onValueChange={(value) => {
				setParams({ durationDays: value }, { replace: true });
			}}
		>
			<SelectItem value="30">30 days ago</SelectItem>
			<SelectItem value="60">60 days ago</SelectItem>
			<SelectItem value="90">90 days ago</SelectItem>
		</SelectContainer>
	);
};
