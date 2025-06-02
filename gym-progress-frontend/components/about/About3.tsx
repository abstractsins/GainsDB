import Image from "next/image";

interface Props {
    isMobile: boolean
    width: number
}

export default function About3({ isMobile, width }: Props) {

    return (

        <div id="p3" className="about-section">
            <div className="left">
                <p>
                    <span className="p-lead">This app originally started</span> as a desktop Java application that would sync the gym records on my phone with a local directory. I then had a script that would parse the plaintext notes with REGEX and chart the values using Google charts.
                </p>
            </div>
            <div className="right">
                {width <= 1000 &&
                    <Image
                        src='/java_app_2.png'
                        height={300}
                        width={450}
                        alt="image of app window"
                        className="img-app-window"
                    />
                }
                {width > 1000 &&
                    <Image
                        src='/java_app_2.png'
                        width={600}
                        height={200}
                        alt="image of app window"
                        className="img-app-window"
                    />
                }
            </div>
        </div>

    )
}