import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="flex flex-col lg:flex-row w-full h-fit lg:h-full">
            <Sidebar isAuthenticated />
            {children}
        </main>
    );
}
