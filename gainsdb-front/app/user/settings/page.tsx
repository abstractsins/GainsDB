export default function Settings() {

    const version = process.env.NEXT_PUBLIC_VERSION;
    const releaseDate = process.env.NEXT_PUBLIC_RELEASE_DATE;

    return (
        <div id="settings-page">
            <div className="header-container">
                <h1 className="page-header">Settings</h1>
            </div>

            <div className="settings-body">

                <div className="settings-module" id="theme-module">
                    <div className="settings-module-header">
                        <h2>Color Theme</h2>
                    </div>
                </div>

                <div className="settings-module" id="units-module">
                    <div className="settings-module-header">
                        <h2>units</h2>
                    </div>
                </div>

            </div>

            <div className="settings-footer">
                <div className="app-signature">
                    <span className="app-signature">{`GainsDB v${version}, released ${releaseDate}`}</span>
                </div>
            </div>
        </div>
    )
}