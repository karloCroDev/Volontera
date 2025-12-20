'use client';

// External packages
import * as React from 'react';

// Components
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export const JoinDialog = () => {
	return (
		<Dialog
			triggerChildren={
				<Button colorScheme="orange" size="md">
					Join
				</Button>
			}
			title="Join Organization"
			subtitle="Please write a motivational letter to why you should join the organization"
		>
			<Textarea label="Motivational Letter" />
		</Dialog>
	);
};
