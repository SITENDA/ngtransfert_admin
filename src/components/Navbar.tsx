//  src/components/Navbar.tsx

import Image from "next/image";
import SignInButton from "@/components/SignInButton";
import SignOutButton from "@/components/SignOutButton";
import getSession from "@/lib/getSession";

export default async function Navbar() {
    const session = await getSession();
    const user = session?.user;

    const displayName = user?.fullName || user?.username || user?.email || "User";
    const fallbackInitial = displayName.charAt(0).toUpperCase();

    return (
        <nav className="flex justify-between items-center py-6 font-bold w-4/5 mx-auto bg-white">
            <h1 className="text-3xl">NextAuth</h1>

            <div className="flex gap-4 items-center">
                {!user ? (
                    <SignInButton />
                ) : (
                    <div className="flex gap-4 font-normal items-center">
                        {user.profileImageUrl ? (
                            <Image
                                className="rounded-full"
                                src={user.profileImageUrl}
                                width={55}
                                height={55}
                                alt="user profile avatar"
                            />
                        ) : (
                            <div className="bg-black text-white rounded-full w-[55px] h-[55px] flex items-center justify-center text-xl">
                                {fallbackInitial}
                            </div>
                        )}

                        <div>
                            <p className="text-2xl">{displayName}</p>
                            <SignOutButton />
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}