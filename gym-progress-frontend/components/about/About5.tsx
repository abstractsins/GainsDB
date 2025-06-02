import Link from "next/link"
import { Roboto_Slab } from "next/font/google";

interface Props {
    isMobile: boolean
    width: number
}

const robotoSlab = Roboto_Slab({
    subsets: ["latin"],
    weight: ["400", "700"],
    display: "swap"
});

export default function About3({ isMobile }: Props) {

    return (

        <div id="p5" className="about-section">

            <div className="body">
                <p>
                    <span className="p-lead">This project showcases</span> my full-stack development skills, including building a modern, interactive UI, designing RESTful APIs, and implementing secure authentication and database management.
                </p>
                <p className="flex flex-col justify-center items-center">
                    Check out my other projects or drop me a message at
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
                </p>
            </div>
        </div>
    )
}