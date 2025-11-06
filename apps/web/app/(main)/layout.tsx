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

				<div className="flex flex-1 flex-col">
					<div className="border-input-border rounded-2xl lg:my-7 lg:mb-5 lg:mr-10 lg:h-[calc(100vh-28px-28px)] lg:border">
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
