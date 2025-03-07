"use client"; // Required for state & interactivity in Next.js App Router

import { useRef, useEffect, useState } from "react";
import { Oswald, Tourney } from "next/font/google";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { profile } from "console";



export default function Profile() {

    const { data: session, status } = useSession();
    const [error, setError] = useState<string | null>(null);
    const [customUsername, setCustomName] = useState<string | undefined>(undefined);
    const [joinedDate, setJoinedDate] = useState<string|undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const username = session?.user?.username;
    const userId = session?.user?.id;

    const server = process.env.NEXT_PUBLIC_BACKEND || `http://localhost:5000`;

    const token = session?.user?.authToken || localStorage.getItem("token");


    useEffect(() => {
        fetchProfileData();
    }, [customUsername]);

    const fetchProfileData = async () => {

        if (!token) {
            setError("No authentication session found. Please log in.");
            return;
        }

        try {

            const res = await fetch(`${server}/api/user/${userId}/profile`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) console.error("Failed to fetch workout data");
            const profileData = await res.json();
            console.log(profileData)
            setCustomName(profileData[0]['custom_name']);
            setJoinedDate(profileData[0]['created_on'].split('T')[0]);

        } catch (err: unknown) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    if (error) return <p>{error}</p>

    return (
        <div id="profile-page">


            <div className="page-header-container">
                <h1 className="page-header">Profile</h1>
            </div>


            <div className="profile-body">

                <div className="greeting">
                    <h2 className="greeting">Hi, {customUsername ? customUsername : username}!</h2>
                </div>

                <div className="joined">
                    <p className="joined">Joined: {joinedDate}</p>
                </div>

                <div className="username">
                    <p className="username">username: {username}</p>
                </div>

            </div>

        </div>
    )
}