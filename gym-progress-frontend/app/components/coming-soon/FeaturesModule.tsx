import { FaUser } from "react-icons/fa"

export default function FeaturesModule() {
    return (
        <>
            <div className="coming-soon-module">
                <h2>⚙️ Settings</h2>
                <li>Choose between themes like light mode and dark mode</li>
                <li>Choose what kind of units to use, like Lbs or Kgs</li>
            </div>

            <div className="coming-soon-module">
                <h2><FaUser className="inline mr-2 text-xl" /> Profile Page</h2>
                <li>Change password</li>
                <li>Set a custom nickname</li>
                <li>State goals and reflect on progress</li>
                <li>Avatars and badges</li>
            </div>

            <div className="coming-soon-module">
                <h2>📈 More Charts</h2>
                <li>Compare different exercises</li>
                <li>More in-depth analysis</li>
            </div>
        </>
    )
}