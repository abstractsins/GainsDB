import Image from "next/image";
import weightsImg from "@/public/delaney-van-I72QeY20Q7o-unsplash.jpg"
import { Tourney } from "next/font/google";

const tourney = Tourney({
    subsets: ["latin"],
    weight: ["400", "700"],
    display: "swap"
});

export default function Charts() {
    return (
        <div id="charts-page">
            <h1 className="page-header">Charts</h1>
            <span className={`${tourney.className} coming-soon`}>Coming Soon!</span>
            <div className="image-container-coming-soon">
                <Image
                    className="coming-soon-img"
                    src={weightsImg}
                    alt="closeup of barbell weight"
                    width={800}
                    height={500}
                />
            </div>
        </div>
    );
}