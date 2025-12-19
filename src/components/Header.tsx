import {LogOut, User, Mail, Settings} from "lucide-react";

import Image from "next/image";
import {NavButton} from "@/components/NavButton";
import {ModeToggle} from "@/components/ModeToggle";
import getSession from "@/lib/getSession";
import SignOutButton from "@/components/SignOutButton";
import transparentIcon from "@/app/[locale]/favicon-transparent.png";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import Navbar from "@/components/Navbar";
import {Link} from "@/i18n/navigation"
import {getTranslations} from "next-intl/server";
import {LocaleToggle} from "@/components/LocaleToggle";
import {generalPaths} from "@/util/frontend-paths";

export default async function Header() {

    const t = await getTranslations('Header');
    const token = "valid_token"; // Replace with actual token state

    const handleLogout = () => {
        console.log("Logging out...");
    };
    const session = await getSession(); // Use auth() to get the session
    const user = session?.user;

    return (
        <header className="animate-slide bg-background h-20 p-4 border-b sticky top-0 z-20 w-full shadow-md ">
            <div className="flex h-full items-center justify-between max-w-screen-xl mx-auto px-6">
                {/* Center Section - Logo */}
                <div className="flex items-center justify-center">
                    <Link href="/" className="flex items-center gap-2" title="Home">
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
                        <>
                            <NavButton href="/home" label="Dashboard" icon={User}/>
                            <button onClick={handleLogout} className="text-red-500 flex items-center gap-1">
                                <LogOut size={22}/>
                                {t('signOut')}
                            </button>
                        </>
                    {/* <NavButton href="/about" label="About" icon={Info} /> */}
                    <NavButton href={generalPaths.contactPath} label={t('contactUs')} icon={Mail}/>
                    <NavButton href={generalPaths.settingsPath} label={t('settings')} icon={Settings}/>
                    <ModeToggle label={t('toggleTheme')}
                                themeNames={{light: t('light'), dark: t('dark'), system: t('system')}}/>
                    <LocaleToggle label={t('changeLanguage')}/>

                    {user && <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <User className="h-[1.6rem] w-[1.6rem]"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="flex flex-col items-start"> {/* Use flex column */}
                                <Link href={generalPaths.userProfilePath}>
                                    <div className="flex items-center gap-2"> {/* User info container */}
                                        {user?.profileImageUrl ? (
                                            <div className="w-[30px] h-[30px] rounded-full overflow-hidden">
                                                <Image
                                                    src={user.profileImageUrl}
                                                    width={30}
                                                    height={30}
                                                    alt="user profile avatar"
                                                    unoptimized
                                                    className="rounded-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <User className="h-[1.2rem] w-[1.2rem]"/>
                                        )}

                                        <div className="flex flex-col">
                                            <p className="text-base font-medium">{user.fullName}</p>
                                            <p className="text-sm text-gray-500">{/* Add any other user info */}</p>
                                        </div>
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <SignOutButton/>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>}
                </nav>
            </div>
            {/* <Navbar/> */}
        </header>
    );
}
