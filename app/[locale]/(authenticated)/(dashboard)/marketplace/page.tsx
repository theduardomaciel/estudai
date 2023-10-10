export default function Page({
	params,
	searchParams,
}: {
	params: { slug: string };
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	return <h1 style={{ fontSize: 128 }}>Marketplace</h1>;
}
