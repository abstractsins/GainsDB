"use client";

import { useEffect, useState } from "react";
import { toTitleCase } from "@/utils/utils";

interface Props { msg: string }

export default function Loader({ msg }: Props) {
    const [loadText, setLoadText] = useState(msg);
    
    msg = msg.toLowerCase();
    
    useEffect(() => {
        setTimeout(() => {
            const cap = toTitleCase(msg);
            console.log(cap);
            console.log(loadText, msg);
            switch (loadText.toLowerCase()) {
                case msg: setLoadText(cap + '.'); break;
                case msg + '.': setLoadText(cap + '..'); break;
                case msg + '..': setLoadText(cap + '...'); break;
                case msg + '...': setLoadText(cap); break;
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