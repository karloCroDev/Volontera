'use client';

// External packages
import * as React from 'react';

// Components
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

export const MessageIndicator: React.FC<{
	containerRef: React.RefObject<HTMLDivElement | null>;
	lastItemId?: string;
	resetKey?: string;
	offset?: number;
}> = ({ containerRef, lastItemId, resetKey, offset = 120 }) => {
	const isNearBottomRef = React.useRef(true);
	const prevLastItemIdRef = React.useRef<string | undefined>(undefined);
	const [showMessageIndicator, setShowMessageIndicator] = React.useState(false);

	const scrollToBottom = React.useCallback(
		(behavior: ScrollBehavior = 'smooth') => {
			const el = containerRef.current;
			if (!el) return;

			el.scrollTo({
				top: el.scrollHeight,
				behavior,
			});

			isNearBottomRef.current = true;
			setShowMessageIndicator(false);
		},
		[containerRef]
	);

	React.useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		const handleScroll = () => {
			const distanceFromBottom =
				el.scrollHeight - el.scrollTop - el.clientHeight;
			const isNearBottom = distanceFromBottom <= offset;
			isNearBottomRef.current = isNearBottom;

			if (isNearBottom) {
				setShowMessageIndicator(false);
			}
		};

		handleScroll();
		el.addEventListener('scroll', handleScroll);

		return () => {
			el.removeEventListener('scroll', handleScroll);
		};
	}, [containerRef, offset]);

	React.useEffect(() => {
		setShowMessageIndicator(false);
		isNearBottomRef.current = true;
		prevLastItemIdRef.current = undefined;
	}, [resetKey]);

	React.useLayoutEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		const hasNewItem =
			typeof lastItemId === 'string' &&
			lastItemId !== prevLastItemIdRef.current;

		prevLastItemIdRef.current = lastItemId;

		if (!hasNewItem) return;

		if (isNearBottomRef.current) {
			scrollToBottom('auto');
			return;
		}

		setShowMessageIndicator(true);
	}, [containerRef, lastItemId, scrollToBottom]);

	if (!showMessageIndicator) return null;

	return (
		<Button
			isFullyRounded
			variant="outline"
			className="absolute bottom-4 right-4 z-10 p-2"
			onClick={() => scrollToBottom()}
		>
			<ArrowDown />
		</Button>
	);
};
