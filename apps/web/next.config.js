/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: [
			'lh3.googleusercontent.com',
			'drzavno-projekt.s3.us-east-1.amazonaws.com',
			'https://dx66bn418xf4i.cloudfront.net',
		],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'dx66bn418xf4i.cloudfront.net',
				port: '',
				pathname: '/**', // allow all paths
			},
		],
	},

	async redirects() {
		return [
			{
				source: '/',
				destination: '/auth/login',
				permanent: false, // use true if this will never change
			},
		];
	},
	// output: 'standalone', TODO: Docker
};

export default nextConfig;
