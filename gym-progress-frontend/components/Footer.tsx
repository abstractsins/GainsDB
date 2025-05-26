"use client";

import { Roboto_Slab } from "next/font/google"
import { Oswald } from "next/font/google";
import Link from "next/link"
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

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

    // const router = useRouter();
    // const { pathname, asPath } = router;
    const { data: session } = useSession();
    const [isRegistering, setIsRegistering] = useState(false);

    // console.log('pathname: ' + pathname);

    return (
        <footer className="footer">
            {session ?
                (
                    <button onClick={() => signOut({ callbackUrl: "/" })} className={`footer-link ${oswald.className}`} >
                        Logout
                    </button>
                ) : (
                    isRegistering
                        ? <Link href="/" onClick={() => setIsRegistering(false)} className={`footer-link ${oswald.className}`}>
                            Login
                        </Link>
                        : <Link href="/register" onClick={() => setIsRegistering(true)} className={`footer-link ${oswald.className}`}>
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