import { useEffect, useRef, useState } from "react";

const MatchHistory = (props:any) => {

  const [matches, setMatches] = useState([])
  const [user, setUser] = useState()

  useEffect(() => {
    window.Twitch.ext.onAuthorized(() => {
      var config = JSON.parse(
        window.Twitch.ext.configuration.broadcaster.content
      );

      if (config[0] !== "") {
        
        fetch(`https://localhost:7256/api/league/summoner/matches?username=${config[0]}&region=${config[1]}`)
        .then((response) => response.json())
        .then((responseJson) => {
            setUser(responseJson.data.playerPuuid)
            setMatches(responseJson.data.matches);
            props.setLoaded(true)
          });
        }
      });
  }, []); 

  function calculateTimeDiff(time : number) : string {
    var currentDate : Date = new Date();
    var differenceTime : number = Math.floor((currentDate.getTime() - time) / 1000)
    if(differenceTime < 60) {
      return differenceTime + " seconds ago"
    } else if (differenceTime < 3600) {
      return Math.floor(differenceTime / 60) + " minutes ago"
    } else if (differenceTime < 86400) {
      return Math.floor((differenceTime / 60) / 60) + " hours ago"
    } else {
      return Math.floor(((differenceTime / 60) / 60)/24) + " days ago"
    }
  }

  var matchRef = useRef({deaths: 0, kills: 0, assists: 0, win: false});

  function getGameWon(match_: any) : boolean {
    if(user) {
        matchRef.current = match_.info.participants.find((participant : any) => 
          participant.puuid === user
        )

        if(matchRef.current.win) {
          return true
        } else {
          return false
        }
    } else {
      return false
    }
  }

  return (
        <div id="matchHistory">
            <h1>Match History</h1>
            <div id="matches">
                {matches.map((match : any) => (
                  getGameWon(match) ? 
                    ( 
                      <div className="match win"> 
                        <div className="matchFirstBox">
                          <p className="matchDate">{calculateTimeDiff(match.info.gameEndTimestamp)}</p>
                          <p>{matchRef.current.kills}/{matchRef.current.deaths}/{matchRef.current.assists}</p>
                        </div>
                        <p className="gameResult">WIN</p>
                      </div>
                    )
                    : (
                      <div className="match loss"> 
                        <div className="matchFirstBox">
                          <p className="matchDate">{calculateTimeDiff(match.info.gameEndTimestamp)}</p>
                          
                          <p>{matchRef.current.kills}/{matchRef.current.deaths}/{matchRef.current.assists}</p>
                        </div>
                        <p className="gameResult">LOSS</p>
                      </div>
                    )
                  ))}
            </div>
        </div>
    );
};

export default MatchHistory;
