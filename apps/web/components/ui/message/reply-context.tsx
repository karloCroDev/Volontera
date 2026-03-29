'use client';

// External packages
import * as React from 'react';

type ReplyingToMessage = {
	id: string;
	content: string;
};

const MessagesReplyContext = React.createContext<
	| {
			replyingTo: ReplyingToMessage | null;
			setReplyingTo: React.Dispatch<
				React.SetStateAction<ReplyingToMessage | null>
			>;
	  }
	| undefined
>(undefined);

export const useMessagesReply = () => {
	const context = React.useContext(MessagesReplyContext);
	if (!context) {
		throw new Error(
			'useMessagesReply must be used within MessagesReplyProvider'
		);
	}

	return context;
};

export const MessagesReplyProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const [replyingTo, setReplyingTo] = React.useState<ReplyingToMessage | null>(
		null
	);

	return (
		<MessagesReplyContext.Provider
			value={{
				replyingTo,
				setReplyingTo,
			}}
		>
			{children}
		</MessagesReplyContext.Provider>
	);
};
