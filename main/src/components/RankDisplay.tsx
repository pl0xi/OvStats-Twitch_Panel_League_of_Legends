import divisions from "../images/Divisions";
import { useEffect, useState } from "react";

const RankDisplay = () => {

    const [summonerName, setSummonerName] = useState("Extension is not configured!");
    const [divison, setDivision] = useState("");
    const [tier, setTier] = useState ("");

    useEffect(() => {    
        window.Twitch.ext.onAuthorized((auth : any) => {
            var config = JSON.parse(window.Twitch.ext.configuration.broadcaster.content);
            setSummonerName(config[0])

        });
    }, []);

    return (
        <div id="rankDisplay">
            <img id="divisionImage" src={divisions.Bronze} alt="league rank"/>
            <h1 id="summonerName">{summonerName}</h1>
            <h1 id="divisonTierTitle">{divison} - {tier}</h1>
        </div>
    )
}

export default RankDisplay;