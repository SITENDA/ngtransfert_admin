import Image from "next/image";
import SignInButton from "@/components/SignInButton";
import SignOutButton from "@/components/SignOutButton";
import getSession from "@/lib/getSession";

export default async function Navbar() {
  const session = await getSession(); // Use auth() to get the session
  const user = session?.user;

  return (
    <nav className="flex justify-between items-center py-6 font-bold w-4/5 mx-auto bg-white">
      <h1 className="text-3xl">NextAuth</h1> {/* Updated title */}
      <div className="flex gap-4 items-center">
        {!user ? ( // Check if user exists (more concise)
          <>
            <SignInButton />
            {/* You might not need RegisterLink with NextAuth, handle sign-up differently */}
            {/* <RegisterLink className="bg-black text-white px-4 py-2 rounded">Sign up</RegisterLink> */}
          </>
        ) : (
          <div className="flex gap-4 font-normal">
            {user?.image ? ( // Use user.image from NextAuth
              <Image
                className="rounded-full"
                src={user.image} // Access image directly
                width={55}
                height={55}
                alt="user profile avatar"
              />
            ) : (
              <div className="bg-black text-white rounded-full p-4">
                {/* Fallback initials (if image not available) */}
                {user?.name?.[0]} {/*Simplified name access*/}

              </div>
            )}
            <div>
              <p className="text-2xl">
                {user?.name} {/* Access name directly */}
              </p>
              <SignOutButton />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}