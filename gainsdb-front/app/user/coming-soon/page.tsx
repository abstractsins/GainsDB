"use client";

import FeaturesModule from "@/components/coming-soon/FeaturesModule";

import globalStyles from "@/styles/globalStyles.module.css";

export default function ComingSoon() {
  const version = process.env.NEXT_PUBLIC_VERSION;
  const releaseDate = process.env.NEXT_PUBLIC_RELEASE_DATE;

  return (
    <div id="coming-soon-page" className={globalStyles.infoPage}>
      <div className="header-container">
        <h1 className="page-header">Coming Soon!</h1>
        <span>
          Check out some of the features to be added in future versions
        </span>
      </div>

      <div className="coming-soon-page-body">
        <FeaturesModule />
      </div>

      <div className="settings-footer">
        <div className="app-signature">
          <span className="app-signature">{`GainsDB v${version}, released ${releaseDate}`}</span>
        </div>
      </div>
    </div>
  );
}
