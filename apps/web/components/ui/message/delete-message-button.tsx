// External action
import * as React from 'react';
import { Trash } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';

export const DeleteMessageButton: React.FC<{
	action: () => void;
}> = ({ action }) => {
	return (
		<Button variant="blank" colorScheme="bland" onPress={action}>
			<Trash className="hover:text-destructive text-muted-foreground mt-auto cursor-pointer opacity-0 transition-all group-hover:opacity-100" />
		</Button>
	);
};
