// Modules
import { SelectType } from '@/modules/onboarding/select-type';

export default async function AppType() {
	return (
		<div className="mt-12 flex flex-col items-center justify-center lg:mt-0 lg:h-full">
			<div className="self-start">
				<h2 className="text-xl">Choose type of user</h2>
				<p className="text-muted-foreground">
					This action is irreversible so please choose wisely
				</p>
			</div>
			<SelectType />
		</div>
	);
}
