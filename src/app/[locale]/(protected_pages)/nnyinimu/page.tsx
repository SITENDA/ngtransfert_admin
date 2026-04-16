//  src/app/[locale]/(protected_pages)/nnyinimu/page.tsx

// import getSession from "@/lib/getSession";
// import { redirect } from "next/navigation";
import AdminDashboardForm from "./AdminDashboardForm";
import ProtectedWrapper from "@/components/ProtectedWrapper";

export const metadata = {
    title: "Dashboard",
};

export default async function AdminDashboardPage() {
    // const session = await getSession();
    // const user = session?.user;

    // if (!user || !session?.accessToken) {
    //     redirect("/");
    // }

    // Fetch users and accounts using Prisma
    // let users: User[] = [];
    // let accounts: Account[] = [];
    // try {
    //     users = await prisma.user.findMany();
    //     accounts = await prisma.account.findMany();
    // } catch (error) {
    //     console.error("Error fetching data:", error);
    // }

    return (
        <ProtectedWrapper><AdminDashboardForm/></ProtectedWrapper>
    );
}