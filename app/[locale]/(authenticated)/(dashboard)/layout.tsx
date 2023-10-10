import Profile from "@/components/Profile";
import Menu from "@/components/Menu";

import getUser from "@/services/getUser";

export default async function MainHomeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await getUser();

	return (
		<>
			<div className="flex flex-col w-full h-full items-start overflow-y-auto px-9 pt-9 pb-[calc(3.5rem+var(--sidebar-height))] lg:px-12 lg:py-9 overflow-x-hidden gap-6">
				<Profile user={user} />
				{children}
			</div>
			<Menu />
		</>
	);
}
