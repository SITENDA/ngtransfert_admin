import { LogOut, User, Info, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { NavButton } from "@/components/NavButton";
import { ModeToggle } from "@/components/ModeToggle";
import { auth } from "@/auth"; // Import the auth function
import SignInButton from "@/components/SignInButton";
import SignOutButton from "@/components/SignOutButton";
import transparentIcon from "@/app/[locale]/favicon-transparent.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import Navbar from "@/components/Navbar";

export async function Header() {
  const token = "valid_token"; // Replace with actual token state
  const handleLogout = () => {
    console.log("Logging out...");
  };
  const session = await auth(); // Use auth() to get the session
  const user = session?.user;

  return (
    <header className="animate-slide bg-background h-20 p-4 border-b sticky top-0 z-20 w-full shadow-md">
      <div className="flex h-full items-center justify-between max-w-screen-xl mx-auto px-6">
        {/* Center Section - Logo */}
        <div className="flex items-center justify-center">
          <Link href="/home" className="flex items-center gap-2" title="Home">
            <Image
              src={transparentIcon}
              alt="NG Transfert Logo"
              width={70}
              height={70}
              className="h-20 w-20 object-contain mb-4"
            />
            <h1 className="text-2xl font-bold hidden sm:block">NG Transfert</h1>
          </Link>
        </div>

        {/* Right Section - Navigation Links */}
        <nav className="flex items-center gap-6">
          {user && token.length > 15 ? (
            <>
              <NavButton href="/home" label="Dashboard" icon={User} />
              <button onClick={handleLogout} className="text-red-500 flex items-center gap-1">
                <LogOut size={22} />
                Sign out
              </button>
            </>
          ) : (
            <></>
            // <NavButton href="/login" label="Sign in" icon={User} />
          )}
          {/* <NavButton href="/about" label="About" icon={Info} /> */}
          <NavButton href="/contact" label="Contact Us" icon={Mail} />
          <ModeToggle />

          {!user ? (
    <SignInButton />
) : (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
                {user?.image ? (
                    <Image
                        className="rounded-full"
                        src={user.image}
                        width={40}  // Adjust size as needed
                        height={40} // Adjust size as needed
                        alt="user profile avatar"
                    />
                ) : (
                    <User className="h-[1.6rem] w-[1.6rem]" /> // Use User icon if no image
                )}
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem className="flex flex-col items-start"> {/* Use flex column */}
                <div className="flex items-center gap-2"> {/* User info container */}
                    {user?.image ? (
                        <Image
                            className="rounded-full"
                            src={user.image}
                            width={30}  // Adjust size as needed
                            height={30} // Adjust size as needed
                            alt="user profile avatar"
                        />
                    ) : (
                        <User className="h-[1.2rem] w-[1.2rem]" /> // Smaller icon
                    )}
                    <div className="flex flex-col">
                        <p className="text-base font-medium">{user?.name}</p>
                        <p className="text-sm text-gray-500">{/* Add any other user info */}</p>
                    </div>
                </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
                <SignOutButton />
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
)}
        </nav>
      </div>
      {/* <Navbar/> */}
    </header>
  );
}
