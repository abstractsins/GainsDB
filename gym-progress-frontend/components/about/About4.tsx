import Image from "next/image";

interface Props {
    isMobile: boolean
    width: number
}

export default function About4({ isMobile, width }: Props) {

    return (


        <div id="p4" className="about-section">

            <div className="left">
                <p>
                    <span className="p-lead">I wanted something simple</span>  to make sure I was accomplishing my goals, which was to pump more iron than the last workout. What began as simple notes in the Samsung notes app became this database web app that I can use at the gym to quickly and easily log my sets and see my progress immediately.
                </p>
            </div>

            {isMobile
                ? (
                    <div className="right">
                        <Image
                            src='/notes_app_2.jpg'
                            width={200}
                            height={300}
                            alt="image of note-taking app"
                            className="img-notes-app zoom-image"
                        />
                    </div>
                )
                : (
                    <div className="right">
                        {width <= 1000 && (
                            <Image
                                src='/notes_app_2.jpg'
                                width={250}
                                height={300}
                                alt="image of note-taking app"
                                className="img-notes-app zoom-image"
                            />
                        )}
                        {width > 1000 &&
                            <Image
                                src='/notes_app_2.jpg'
                                width={300}
                                height={400}
                                alt="image of note-taking app"
                                className="img-notes-app zoom-image"
                            />
                        }
                    </div>
                )}

        </div>
    )
}