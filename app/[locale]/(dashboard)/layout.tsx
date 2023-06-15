import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className="flex flex-row w-full h-full">
			<Sidebar isAuthenticated />
			{children}
		</main>
	);
}
