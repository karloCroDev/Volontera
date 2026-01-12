'use client';

// External packages
import * as React from 'react';
import { Form } from 'react-aria-components';
import { Ellipsis } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const EditBoard = () => {
	return (
		<Dialog
			title="Edit board"
			subtitle="Please enter the board details below."
			triggerChildren={
				<Button variant="blank">
					<Ellipsis className="text-muted-foreground" />
				</Button>
			}
		>
			<Form className="flex flex-col gap-4 overflow-y-scroll">
				<div>
					<Label className="mb-2">Title</Label>
					<Input label="Enter your board title" />
				</div>
				<div>
					<Label className="mb-2" isOptional>
						Description
					</Label>
					<Textarea label="Enter your description" />
				</div>

				<div className="flex justify-between">
					<Button
						type="submit"
						variant="outline"
						colorScheme="destructive"
						size="md"
					>
						{/* Enter board name */}
						Delete board
					</Button>
					<Button type="submit" size="md">
						Submit
					</Button>
				</div>
			</Form>
		</Dialog>
	);
};
