// Components
import { Header } from '@/components/ui/header/header';
import { Layout, LayoutColumn } from '@/components/ui/layout-grid';
import { Sidebar } from '@/components/ui/sidebar/sidebar';

export default async function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{/* <div className="flex items-start">
				<Sidebar />
				<Header />
			</div> */}

			<Header />
			<Layout>
				<LayoutColumn>{children}</LayoutColumn>
			</Layout>
		</>
	);
}
