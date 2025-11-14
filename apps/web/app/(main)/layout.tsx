// External packages
import { redirect } from 'next/navigation';

// Components
import { Header } from '@/components/ui/header/header';
import { Sidebar } from '@/components/ui/sidebar/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar/sidebar-provider';

// Types
import { getSession } from '@/lib/server/get-session';

export default async function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await getSession();

	if (!user.success) redirect('/auth/login');
	if (user.success && !user.onboardingFinished)
		redirect('/onboarding/app-type');

	return (
		<SidebarProvider>
			<div className="flex h-screen">
				<Sidebar user={user} />

				<div className="flex flex-1 flex-col">
					<div className="border-input-border rounded-2xl lg:my-7 lg:mb-5 lg:mr-10 lg:h-[calc(100vh-28px-28px)] lg:border">
						<Header />
						<main className="no-scrollbar flex h-[calc(100vh-96px)] flex-col overflow-x-hidden overflow-y-scroll lg:h-[calc(100vh-28px-28px-112px)]">
							{children}
						</main>
					</div>
				</div>
			</div>
		</SidebarProvider>
	);
}
