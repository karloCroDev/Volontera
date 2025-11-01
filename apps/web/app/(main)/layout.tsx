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

				<div className="flex flex-1 flex-col overflow-y-auto">
					<Header />
					<Layout>
						<LayoutColumn>{children}</LayoutColumn>
					</Layout>
				</div>
			</div>
		</SidebarProvider>
	);
}
