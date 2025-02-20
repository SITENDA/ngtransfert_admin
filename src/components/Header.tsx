import {LogOut, User, Info, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { NavButton } from "@/components/NavButton";
import { ModeToggle } from "@/components/ModeToggle";
import transparentIcon from "../app/favicon-transparent.png";
// import Navbar from "@/components/Navbar";

export function Header() {
    const user = true; // Replace with user authentication logic
    const token = "valid_token"; // Replace with actual token state
    const handleLogout = () => {
        console.log("Logging out...");
    };

    return (
        <header className="animate-slide bg-background h-20 p-4 border-b sticky top-0 z-20 w-full shadow-md">
            <div className="flex h-full items-center justify-between max-w-screen-xl mx-auto px-6">
                {/* Center Section - Logo */}
                <div className="flex items-center justify-center">
                    <Link href="/home" className="flex items-center gap-2" title="Home">
                        <Image
                            src={transparentIcon}
                            alt="NG Transfert Logo"
                            width={120}
                            height={120}
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
                        <NavButton href="/login" label="Sign in" icon={User} />
                    )}
                    <NavButton href="/about" label="About" icon={Info} />
                    <NavButton href="/contact" label="Contact Us" icon={Mail} />
                    <ModeToggle />
                </nav>
            </div>
            {/*<Navbar/>*/}
        </header>
    );
}
