// Components
import { Header } from '@/components/ui/header/header';
import { Layout, LayoutColumn } from '@/components/ui/layout-grid';
import { Sidebar } from '@/components/ui/sidebar/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar/sidebar-provider';

export default async function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<div className="flex h-screen">
				<Sidebar />

				<div className="flex flex-1 flex-col px-6 lg:pl-8 lg:pr-12">
					<div className="border-input-border my-7 mb-5 h-[calc(100vh-28px-28px)] rounded-2xl border lg:pl-8 lg:pr-12">
						<Header />
						<Layout>
							<LayoutColumn className="py-6">{children}</LayoutColumn>
						</Layout>
					</div>
				</div>
			</div>
		</SidebarProvider>
	);
}
