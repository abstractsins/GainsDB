interface Props {
    isMobile: boolean,
    width: number
}

export default function About2({ isMobile }: Props) {

    return (
        <div id="p2" className="about-section">
            <div className="body">
                <ul className="about-list"><span className="p-lead ul-title">Tech Stack</span>
                    <li><span className="about-li-lead">Frontend</span> Next.js (React + TypeScript), Recharts for data visualization, GSAP for animations.</li>
                    <li><span className="about-li-lead">Backend</span> Node.js with Express, PostgreSQL for database management.</li>
                    <li><span className="about-li-lead">Authentication</span> Secure login system with JWT-based authentication.</li>
                    <li><span className="about-li-lead">Hosting & Deployment</span> Cloud-hosted for scalability and accessibility.</li>
                </ul>
            </div>
            {!isMobile && <div className="animate-pulse nav-arrow" id="right">{'->'}</div>}
        </div>
    )
}