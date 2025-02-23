"use client";

import { Roboto_Slab } from "next/font/google"
import { Oswald } from "next/font/google";
import Link from "next/link"
import { useSession, signOut } from "next-auth/react";


const robotoSlab = Roboto_Slab({
    subsets: ["latin"],
    weight: ["400", "700"],
    display: "swap"
});

const oswald = Oswald({
    subsets: ["latin"],
    weight: ["400", "700"],
    display: "swap"
})

export default function Footer() {

    const { data: session } = useSession(); // Get user session

    return (
        <footer className="footer">
            {session ?
                (
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className={`footer-link ${oswald.className}`}
                    >
                        Logout
                    </button>
                ) : (
                    <Link
                        href="/register"
                        className={`footer-link ${oswald.className}`}
                    >
                        Register
                    </Link>
                )}
            <Link
                href="/about"
                className={`footer-link ${oswald.className}`}
            >
                About
            </Link>
            <Link
                href="https://divs4u.com"
                target="_blank" 
                rel="noopener noreferrer"
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
                `}
            >
                Divs4U
            </Link>
        </footer>
    )
}