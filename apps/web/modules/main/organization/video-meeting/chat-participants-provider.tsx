'use client';

// External packages
import * as React from 'react';

const ChatParticipantsContext = React.createContext<{
	isChatOpen: boolean;
	setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export const ChatParticipantsProvider: React.FC<React.PropsWithChildren> = ({
	children,
}) => {
	const [isChatOpen, setIsChatOpen] = React.useState(false);

	return (
		<ChatParticipantsContext.Provider
			value={{
				isChatOpen,
				setIsChatOpen,
			}}
		>
			{children}
		</ChatParticipantsContext.Provider>
	);
};

export function useChat() {
	const ctx = React.useContext(ChatParticipantsContext);
	if (!ctx) {
		throw new Error('useChat must be used within ChatProvider');
	}
	return ctx;
}
