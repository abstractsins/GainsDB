import { useSession } from "next-auth/react";
import Link from "next/link";

import { Oswald } from "next/font/google";

import { FaUser } from "react-icons/fa"; // FontAwesome icons
import { MdDashboard } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";

interface SidebarInfo {
    isMenuActive: boolean;
    setIsMenuActive: (_: boolean) => void;
}

interface Props {
    sidebar: SidebarInfo;
}

const oswald = Oswald({
    subsets: ["latin"],
    weight: ["400", "700"],
    display: "swap"
});


export default function Navbar({ sidebar }: Props) {
    const { data: session, status } = useSession();
    const username = session?.user?.name;

    // Until Profile page is released in version
    const profile = false;

    const menuSlide = () => sidebar.isMenuActive ? sidebar.setIsMenuActive(false) : sidebar.setIsMenuActive(true);

    return (
        <header className="mobile-nav-header">

            {username
                ? <Link href="/dashboard" className="hover:text-blue-300 flex items-center">
                    <MdDashboard className="mr-2 text-xl" />
                    <h2 className={`${oswald.className} text-lg font-bold  text-[12pt] sm:text-[14pt] md:text-[16pt] lg:text-[20pt]`}>Dashboard</h2>
                </Link>
                : <Link className="link" href="/register">Register</Link>
            }

            {profile
                ? (
                    <Link href="/dashboard/profile" className="hover:text-blue-300 flex items-center">
                        <FaUser className="mr-2 text-xl" />
                        Profile
                    </Link>)
                : (
                    username && <span>Hi, {username}!</span>
                )
            }

            {username
                ? <div className="hamburger-menu-container" onClick={menuSlide}> <RxHamburgerMenu className="text-[20pt]" /> </div>
                : <Link className="link" href="/">Login</Link>
            }

        </header>

    )
}