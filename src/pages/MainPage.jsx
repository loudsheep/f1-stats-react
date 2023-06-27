import './MainPage.css';
import { useNavigate } from "react-router-dom";

export default function MainPage() {
    const navigate = useNavigate();

    const handleClick = (url) => {
        navigate(url);
    }

    return (
        <>
            <div className="title">
                <h1>
                    F1 Stats
                </h1>
            </div>

            <div className="menu">
                <div className="tile" onClick={() => handleClick("/results")}>
                    <img src="https://media.formula1.com/image/upload/f_auto/q_auto/v1678476266/EventApp/1396156441.jpg" alt="" />
                    <div className="text">
                        <h1>Results</h1>
                        <h2 className="animate-text">Results from every session</h2>
                        <p className="animate-text">Delve into the Results section of our Formula 1 website to access driver details, points, and finishing statuses. Click on a driver to reveal lap times and tire compounds used. Uncover the excitement of Formula 1 with comprehensive data at your fingertips.</p>
                    </div>
                </div>

                <div className="tile" onClick={() => handleClick("/winners")}>
                    <img src="https://www.formula1.com/content/dam/fom-website/sutton/2020/Portugal/Sunday/1282134941.jpg.transform/6col/image.jpg" alt="" />
                    <div className="text">
                        <h1>Drivers championship</h1>
                        <h2 className="animate-text">Results from every session</h2>
                        <p className="animate-text">Discover the Drivers World Championship page, featuring a table with current points, theoretical max points, and championship-winning possibilities for each driver. Stay updated on the race for the ultimate Formula 1 title.</p>
                    </div>
                </div>

                <div className="tile" onClick={() => handleClick("/winners")}>
                    <img src="https://www.grandprix247.com/wp-content/uploads/2016/03/large-001.jpg" alt="" />
                    <div className="text">
                        <h1>Standings heatmap</h1>
                        <h2 className="animate-text">Results from every session</h2>
                        <p className="animate-text">Discover our Points Heatmap page, featuring a dynamic chart showcasing the points earned by each driver in every race. Uncover trends and patterns in their performance throughout the season. Experience the excitement of Formula 1 through captivating visualizations.</p>
                    </div>
                </div>

                <div className="tile" onClick={() => handleClick("/winners")}>
                    <img src="https://www.investopedia.com/thmb/dTk0Wakf0vy0PEnl8Qk-3CGPnws=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1311007681-2afbfba73b744b88ab3bd388ae6c8b00.jpg" alt="" />
                    <div className="text">
                        <h1>Telemetry</h1>
                        <h2 className="animate-text">Results from every session</h2>
                        <p className="animate-text">Unleash the power of Telemetry! Explore detailed data including speed, gear, RPM, and throttle for selected laps of Formula 1 drivers. Compare multiple laps and experience a visual speed map. Gain valuable insights into their performance and discover the secrets of their high-speed machines.</p>
                    </div>
                </div>
            </div>
        </>
    );
}