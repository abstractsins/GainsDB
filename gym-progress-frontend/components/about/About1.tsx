interface Props {
    isMobile: boolean,
    width: number
}

export default function About1({ isMobile }: Props) {

    return (
        <div id="p1" className="about-section">
            <div className="left">
                <p>
                    <span className="p-lead">This web application </span>is designed to help users log, visualize, and analyze their workout progress over time. The app provides an intuitive interface for tracking exercises, viewing interactive charts, and gaining insights into strength and endurance improvements.
                </p>
            </div>

            <div className="right">
                <ul className="about-list">
                    <li><span className="about-li-lead">Workout Logging</span> Easily input exercises, sets, reps, and weights.</li>
                    <li><span className="about-li-lead">Interactive Charts</span> Visualize progress with dynamic graphs powered by Recharts.</li>
                    <li><span className="about-li-lead">Secure Authentication</span> Protect user data with secure login and session management.</li>
                    <li><span className="about-li-lead">Cloud-Based Storage</span> Access workout history from anywhere.</li>
                </ul>
            </div>
        </div>
    )
}