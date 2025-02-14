"use client";

import { Roboto_Slab } from "next/font/google"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react";


const robotoSlab = Roboto_Slab({
    subsets: ["latin"],
    weight: ["400", "700"],
    display: "swap"
});

export default function Footer() {

    const { data: session } = useSession(); // Get user session

    return (
        <footer
            className="
            absolute 
            bottom-0 
            flex 
            justify-end 
            w-screen
            p-2
            sm:p-4
            md:p-8"
        >

            {session ?
                (
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="footer-link"
                    >
                        Logout
                    </button>
                ) : (
                    <Link
                        href="/register"
                        className="footer-link"
                    >
                        Register
                    </Link>
                )}
            <Link
                href="/about"
                className="footer-link"
            >
                About
            </Link>
            <a
                href="https://divs4u.com"
                className={`
                    ${robotoSlab.className} 
                    flex
                    items-center
                    hover:text-blue-300
                    hover:underline
                    text-white 
                    m-1
                    p-4
                    font-semibold
                    text-[16pt]
                    sm:text-[18pt]
                    md:text-[20pt]
                    lg:text-[22pt]
                    xl:text-[24pt]
                `}>
                Divs4U
            </a>
        </footer>
    )
}