// Components
import { Layout, LayoutColumn } from '@/components/ui/layout-grid';

export default async function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Everything gets inffered from the last layout (including the prevention from user sessions), so there is no need to repeat the logic here
	return (
		<Layout className="h-full">
			<LayoutColumn
				className="no-scrollbar flex flex-col overflow-x-hidden overflow-y-scroll px-4 py-6"
				id="column-scroll"
			>
				{children}
			</LayoutColumn>
		</Layout>
	);
}
