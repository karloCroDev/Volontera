'use client';

// External packages
import * as React from 'react';
import {
	Button as AriaButton,
	Form,
	Input as AriaInput,
	Label as AriaLabel,
} from 'react-aria-components';
import { Camera, CircleX, Plus, X } from 'lucide-react';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';

export const NewPostDialog = () => {
	const [images, setImages] = React.useState<File[]>([]);

	const moveItem = (arr: File[], from: number, to: number) => {
		if (to < 0 || to >= arr.length) return arr;
		const next = [...arr];
		const [item] = next.splice(from, 1);

		if (!item) return arr;
		next.splice(to, 0, item);
		return next;
	};
	return (
		<Dialog
			triggerChildren={
				<AriaButton className="border-input-border mb-6 flex w-full items-center gap-4 rounded-2xl border p-5 outline-none">
					<Avatar
						imageProps={{
							src: '',
						}}
						colorScheme="gray"
						size="md"
					>
						Admin Name
					</Avatar>
					<p className="text-md text-muted-foreground font-medium">
						Add new post
					</p>

					<Plus className="text-muted-foreground ml-auto size-8" />
				</AriaButton>
			}
			title="Create new post"
			subtitle="Let's create new post for your organization"
		>
			<Form className="flex flex-col gap-4">
				<div>
					<Label>Title</Label>
					<Input label="Enter your post title" className="mt-2" />
				</div>

				<div>
					<Label>Content</Label>
					<Textarea label="Enter your post content" className="mt-2" />
				</div>

				<div className="flex items-end gap-4">
					<div className="flex-1">
						<Label className="mb-2">Post image(s)</Label>
						<div className="flex flex-wrap gap-4">
							{images.map((image, index) => (
								<div
									key={index}
									className="size-30 border-input-border relative overflow-hidden rounded-lg border"
								>
									<Image
										src={URL.createObjectURL(image)}
										alt="Woah awesome"
										fill
										className="object-cover"
									/>

									{/* Move left / right (or up / down) */}
									<div className="absolute bottom-2 left-2 flex gap-1">
										<Button
											size="sm"
											isDisabled={index === 0}
											onPress={() =>
												setImages((prev) => moveItem(prev, index, index - 1))
											}
										>
											←
										</Button>

										<Button
											size="sm"
											isDisabled={index === images.length - 1}
											onPress={() =>
												setImages((prev) => moveItem(prev, index, index + 1))
											}
										>
											→
										</Button>
									</div>

									{/* Remove */}
									<Button
										className="absolute right-2 top-2 p-1"
										isFullyRounded
										colorScheme="destructive"
										onPress={() => {
											setImages((prev) => prev.filter((_, i) => i !== index));
										}}
									>
										<X className="size-4" />
									</Button>
								</div>
							))}

							{/* Add image tile */}
							<label
								htmlFor="image-upload"
								className="border-input-border hover:border-primary size-30 text-muted-foreground hover:text-primary flex cursor-pointer items-center justify-center gap-4 rounded-lg border border-dashed transition-colors"
							>
								<p>Image</p>
								<Plus />
							</label>

							<AriaInput
								type="file"
								accept="image/*"
								id="image-upload"
								multiple
								className="sr-only"
								onChange={(e) => {
									const files = e.target?.files;
									if (!files) return;
									setImages((prev) => [...prev, ...Array.from(files)]);
									e.currentTarget.value = '';
								}}
							/>
						</div>
					</div>

					<Button type="submit" className="ml-auto">
						Submit
					</Button>
				</div>
			</Form>
		</Dialog>
	);
};
