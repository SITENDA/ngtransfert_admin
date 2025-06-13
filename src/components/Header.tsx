import { LogOut, User, Mail } from "lucide-react"; //Info,
import Image from "next/image";
import { NavButton } from "@/components/NavButton";
import { ModeToggle } from "@/components/ModeToggle";
import getSession from "@/lib/getSession";
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
import { Link } from "@/i18n/navigation"
import {getTranslations} from "next-intl/server";
import {LocaleToggle} from "@/components/LocaleToggle";

export default async function Header() {

  const t = await getTranslations('Header');
  const token = "valid_token"; // Replace with actual token state

  const handleLogout = () => {
    console.log("Logging out...");
  };
  const session = await getSession(); // Use auth() to get the session
  const user = session?.user;
  const ekiddakoProp = user?.ekiddako || null;


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
          {user && token.length > 15 ? (
            <>
              <NavButton href="/home" label="Dashboard" icon={User} />
              <button onClick={handleLogout} className="text-red-500 flex items-center gap-1">
                <LogOut size={22} />
                { t('signOut') }
              </button>
            </>
          ) : (
            <></>
            // <NavButton href="/login" label="Sign in" icon={User} />
          )}
          {/* <NavButton href="/about" label="About" icon={Info} /> */}
          <NavButton href="/contact" label={t('contactUs')} icon={Mail} />
          <ModeToggle label={t('toggleTheme')} themeNames={{ light: t('light'), dark: t('dark'), system: t('system') }} />
          <LocaleToggle label={t('changeLanguage')}/>

          {!user?.fullName ? (<SignInButton hideOnPathSegment={ekiddakoProp} />) : (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-[1.6rem] w-[1.6rem]" />
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
