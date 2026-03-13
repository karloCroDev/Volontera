'use client';

// External packages
import * as React from 'react';
import Link from 'next/link';

/// Components
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Message } from '@/components/ui/message/message';

// Lib
import { useChat } from '@/modules/main/organization/video-meeting/chat-provider';

export const ChatWindow = () => {
	const { isChatOpen } = useChat();
	const [view, setView] = React.useState<'messages' | 'participants'>(
		'messages'
	);

	const [shouldRender, setShouldRender] = React.useState(isChatOpen);

	React.useEffect(() => {
		if (isChatOpen) setShouldRender(true);
		// timeotam ovo sa animacijom. na animationEnd event listeneru dolazi do malog treptaja jer se prvo zatvori a onda ponovo otvori (ne timeouta dobro, pa ovo je trenutno najbolje rješenje)
		else setTimeout(() => setShouldRender(false), 100);
	}, [isChatOpen]);

	if (!shouldRender) return null;

	return (
		<div
			data-state={isChatOpen ? 'open' : 'closed'}
			className="border-input-border bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right absolute bottom-4 right-4 flex h-[calc(100%-32px)] w-[calc(100%-32px)] flex-col rounded-lg border px-3 py-2.5 shadow-lg duration-300 lg:w-[500px]"
		>
			<div className="flex justify-between gap-4">
				<Button
					className="flex-1"
					variant={view === 'messages' ? 'outline' : 'ghost'}
					onPress={() => {
						setView('messages');
					}}
					size="xs"
				>
					Messages
				</Button>
				<Button
					className="flex-1"
					variant={view === 'participants' ? 'outline' : 'ghost'}
					onPress={() => {
						setView('participants');
					}}
					size="xs"
				>
					Participants
				</Button>
			</div>

			<div className="mt-4 flex flex-1 flex-col overflow-y-scroll">
				{view === 'messages' ? (
					<div>
						<Message
							date={new Date()}
							variant="secondary"
							avatar={
								<Avatar
									imageProps={{
										src: undefined,
									}}
								>
									Ivan Horvat
								</Avatar>
							}
						>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, qui,
							dicta fugit repellendus eius consectetur, quas molestias unde
							maxime odit excepturi corporis dolorem cupiditate! Reprehenderit
							laborum doloremque natus tempore reiciendis?
						</Message>
					</div>
				) : (
					// TODO: fix link
					<Link
						href="/organization/video-meeting"
						className="border-input-border bg-muted flex items-center gap-4 rounded-lg border px-4 py-2.5"
					>
						<Avatar
							imageProps={{
								src: '',
							}}
						>
							Ivan Horvat
						</Avatar>

						<p className="lg:text-md hover:text-muted-foreground underline-offset-4 transition-all hover:underline">
							Ivan Horvat
						</p>
						<p className="text-muted-foreground ml-auto text-sm lg:text-base">
							Host
						</p>
					</Link>
				)}
			</div>
		</div>
	);
};
