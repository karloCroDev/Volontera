'use client';

// External packages
import * as React from 'react';

const ChatContext = React.createContext<{
	isChatOpen: boolean;
	setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export const ChatProvider: React.FC<React.PropsWithChildren> = ({
	children,
}) => {
	const [isChatOpen, setIsChatOpen] = React.useState(false);

	return (
		<ChatContext.Provider
			value={{
				isChatOpen,
				setIsChatOpen,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
};

export function useChat() {
	const ctx = React.useContext(ChatContext);
	if (!ctx) {
		throw new Error('useChat must be used within ChatProvider');
	}
	return ctx;
}
