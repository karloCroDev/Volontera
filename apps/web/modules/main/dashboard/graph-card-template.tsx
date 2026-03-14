// Components
import { Container } from '@/components/ui/container';

export const GraphCardTemplate = ({
	title,
	subtitle,
	children,
}: {
	title: string;
	subtitle: string;
	children: React.ReactNode;
}) => {
	return (
		<Container className="flex flex-1 flex-col rounded-lg px-6 py-5">
			<div className="flex justify-between">
				<div>
					<p className="text-md font-medium"> {title}</p>
					<p className="text-muted-foreground mb-4 text-xs">{subtitle}</p>
				</div>
			</div>

			<div className="flex-1">
				<div className="max-w-84 mx-auto flex aspect-video size-full items-center justify-center text-sm">
					{children}
				</div>
			</div>
		</Container>
	);
};
