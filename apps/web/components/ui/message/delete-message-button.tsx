// External action
import * as React from 'react';
import { Trash2 } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';

export const DeleteMessageButton: React.FC<{
	action: () => void;
}> = ({ action }) => {
	return (
		<Button variant="blank" colorScheme="bland" onPress={action}>
			<Trash2 className="hover:text-destructive text-muted-foreground mt-auto cursor-pointer opacity-0 transition-all group-hover:opacity-100" />
		</Button>
	);
};
