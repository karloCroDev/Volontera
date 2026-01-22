// Modules
import { Heading } from '@/components/ui/heading';
import { HomePostsMapping } from '@/modules/main/home/home-posts-mapping';
import { HomeSelect } from '@/modules/main/home/home-select';

export default async function HomePage() {
	return (
		<>
			<div className="flex items-center justify-between">
				<Heading>Home</Heading>
				<HomeSelect />
			</div>
			<HomePostsMapping />
		</>
	);
}
