import { clientSession } from '@/lib/data/auth';
import { SessionSuccessResponse } from '@repo/types/auth';
import { ServerHandleResponse } from '@repo/types/general';
import { useQuery } from '@tanstack/react-query';
import { cache } from 'react';

export const useSession = () => {
	return useQuery<SessionSuccessResponse, ServerHandleResponse<false>>({
		queryKey: ['session'],
		queryFn: cache(clientSession),
		staleTime: 5 * 60 * 1000,
	});
};

// export const getUser = async ()=>{
//     return useQuery<SessionSuccessResponse, ServerHandleResponse<false>>({
//         queryKey: ['session'],
//         queryFn: ()=>,
//         staleTime: 5 * 60 * 1000,
//     });
// }
