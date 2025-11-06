'use client';

// External packages
import * as React from 'react';

export function useIsMobile(MOBILE_BREAKPOINT = 1024) {
	const [isMobile, setIsMobile] = React.useState<undefined | boolean>(
		undefined
	);

	React.useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};

		mql.addEventListener('change', onChange);

		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

		return () => {
			mql.removeEventListener('change', onChange);
		};
	}, [MOBILE_BREAKPOINT]);

	return !!isMobile;
}
