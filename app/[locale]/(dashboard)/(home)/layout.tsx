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
			<div className="flex flex-col w-full h-full items-start overflow-y-auto px-14 pt-14 pb-[calc(3.5rem+var(--sidebar-height))] lg:p-14 overflow-x-hidden">
				<Profile user={user} />
				{children}
			</div>
			<Menu />
		</>
	);
}
