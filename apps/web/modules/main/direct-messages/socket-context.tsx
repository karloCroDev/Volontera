'use client';

// React
import * as React from 'react';
import { io, Socket } from 'socket.io-client';

// Hooks
import { useSession } from '@/hooks/data/user';

// Types
import { EmitUsers } from '@repo/types/sockets';
import { withReactQueryProvider } from '@/lib/utils/react-query';

export const SocketContext = React.createContext<{
	onlineUsers: string[];
	socketGlobal: Socket | null;
} | null>(null);

export const useSocketContext = () => {
	const ctx = React.useContext(SocketContext);

	if (!ctx) throw new Error("Oops I can't provide the value");

	return ctx;
};

export const SocketContextProvider: React.FC<{ children: React.ReactNode }> =
	withReactQueryProvider(({ children }) => {
		const [onlineUsers, setOnlineUsers] = React.useState([]);
		const [socketGlobal, setSocketGlobal] = React.useState<Socket | null>(null);

		const { data: user } = useSession();

		React.useEffect(() => {
			if (!user) {
				if (socketGlobal) {
					socketGlobal.close();
					setSocketGlobal(null);
				}
				return;
			}

			const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
				query: {
					userId: user.id, // Korisnika dobivamo sa servera pa nije problem handleati je li online ili nije
				},
			});

			setSocketGlobal(socket);

			socket.on<EmitUsers>('get-online-users', (data) => {
				setOnlineUsers(data);
			});
			return () => {
				socket.close();
			};

			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [user]);

		return (
			<SocketContext.Provider value={{ onlineUsers, socketGlobal }}>
				{children}
			</SocketContext.Provider>
		);
	});
