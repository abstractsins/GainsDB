import { FaUser } from "react-icons/fa"; // FontAwesome icons
import { MdDashboard } from "react-icons/md"; // Material Icons
import { Oswald } from "next/font/google";
import Link from "next/link";

const oswald = Oswald({
    subsets: ["latin"],
    weight: ["400", "700"],
    display: "swap"
});

export default function Navbar() {
    return (
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">

        <Link href="/dashboard" className="hover:text-blue-300 flex items-center">
            <MdDashboard className="mr-2 text-xl" />
            <h2 className={`${oswald.className} text-lg font-bold  text-[12pt] sm:text-[14pt] md:text-[16pt] lg:text-[20pt]`}>Dashboard</h2>
        </Link>
        
        <Link href="/dashboard/profile" className="hover:text-blue-300 flex items-center">
            <FaUser className="mr-2 text-xl" />
            Profile
        </Link>
      </header>

    )   
}