// External packages
import { redirect } from 'next/navigation';

// Components
import { Header } from '@/components/ui/header/header';
import { Layout, LayoutColumn } from '@/components/ui/layout-grid';
import { Sidebar } from '@/components/ui/sidebar/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar/sidebar-provider';

// Config
import { serverFetch } from '@/config/server-fetch';

// Types
import { SessionSuccessResponse } from '@repo/types/auth';

export default async function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user: SessionSuccessResponse = await serverFetch({
		url: 'auth/session',
		init: {
			cache: 'no-store',
			next: { tags: ['session'] },
		},
	});

	console.log(user);

	if (!user.success) redirect('/auth/login');
	if (user.success && !user.onboardingFinished)
		redirect('/onboarding/app-type');

	return (
		<SidebarProvider>
			<div className="flex h-screen">
				<Sidebar />

				<div className="flex flex-1 flex-col">
					<div className="border-input-border rounded-2xl lg:my-7 lg:mb-5 lg:mr-10 lg:h-[calc(100vh-28px-28px)] lg:border">
						<Header />
						<Layout>
							<LayoutColumn className="no-scrollbar flex h-[calc(100vh-96px)] flex-col overflow-x-hidden overflow-y-scroll p-4 py-6 lg:h-[calc(100vh-28px-28px-112px)]">
								{children}
							</LayoutColumn>
						</Layout>
					</div>
				</div>
			</div>
		</SidebarProvider>
	);
}
