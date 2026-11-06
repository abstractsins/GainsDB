import { FaUser } from "react-icons/fa"

export default function FeaturesModule() {
    return (
        <>
            <div className="coming-soon-module">
                <h2>⚙️ Settings</h2>
                <ul className="coming-soon-feature-list">
                    <li>Choose between themes like light mode and dark mode</li>
                    <li>Choose your preferred unit system (e.g., lbs or kgs)</li>
                </ul>
            </div>

            <div className="coming-soon-module">
                <h2><FaUser className="inline mr-2" /> Profile Page</h2>
                <ul className="coming-soon-feature-list">
                    <li>Change password</li>
                    <li>Set a custom nickname</li>
                    <li>State goals and reflect on progress</li>
                    <li>Avatars and badges</li>
                </ul>
            </div>

            <div className="coming-soon-module">
                <h2>📈 More Charts</h2>
                <ul className="coming-soon-feature-list">
                    <li>Compare different exercises</li>
                    <li>More in-depth analysis</li>
                </ul>
            </div>
        </>
    )
}