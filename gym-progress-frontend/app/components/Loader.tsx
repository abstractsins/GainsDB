"use client";

import { Roboto_Slab } from "next/font/google"
import { Oswald } from "next/font/google";
import Link from "next/link"
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";


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

export default function Loader() {
    const [loadText, setLoadText] = useState('Loading');

    useEffect(() => {

        setTimeout(() => {
            switch (loadText.toLowerCase()) {
                case 'loading': setLoadText('Loading.'); break;
                case 'loading.': setLoadText('Loading..'); break;
                case 'loading..': setLoadText('Loading...'); break;
                case 'loading...': setLoadText('Loading'); break;
            }
        }, 250);
    });

    return (
        <div className="loader">
            <span className="load-text">
                {loadText}
            </span>
        </div>
    )
}