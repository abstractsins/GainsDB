import Image from "next/image";

interface Props {
  isMobile: boolean;
  width: number;
}

export default function About3(_: Props) {
  return (
    <div id="p3" className="about-section">
      <div className="left">
        <p>
          <span className="p-lead">This app originally started</span> as a
          desktop Java application that would sync the gym records on my phone
          with a local directory. I then had a script that would parse the
          plaintext notes with REGEX and chart the values using Google charts.
        </p>
      </div>
      <div className="right">
        <Image
          src="/java_app_2.png"
          width={550}
          height={350}
          alt="image of app window"
          className="img-app-window"
        />
      </div>
      <div className="nav-arrow" id="right">
        <span className="nav-text">3/5</span>
      </div>
    </div>
  );
}
