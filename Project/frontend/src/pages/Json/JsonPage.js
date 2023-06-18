import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import "./JsonPage.css";

ChartJS.register(ArcElement, Tooltip, Legend);
let randomBackgroundColor = [];
let usedColors = new Set();

let dynamicColors = function () {
  let r = Math.floor(Math.random() * 255);
  let g = Math.floor(Math.random() * 255);
  let b = Math.floor(Math.random() * 255);
  let color = "rgb(" + r + "," + g + "," + b + ")";

  if (!usedColors.has(color)) {
    usedColors.add(color);
    return color;
  } else {
    return dynamicColors();
  }
};

const getRequest = async (path) => {
  try {
    const res = await fetch("http://localhost:3000/" + path, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return null;
    }

    const body = await res.json();
    if (body !== null && body !== undefined) {
      return body;
    }

    return null;
  } catch {
    return null;
  }
};

export const JsonPage = () => {
  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [electionId, setElectionId] = useState(null);
  const [participants, setParticipants] = useState(null);
  useEffect(() => {
    getRequest("elections")
      .then((res) => {
        if (res !== null) {
          setElections(res);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
    return () => { };
  }, []);

  useEffect(() => {
    console.log(elections);
    for (let i in elections) {
      randomBackgroundColor.push(dynamicColors());
    }
    return () => { };
  }, [elections]);

  useEffect(() => {
    if (!!electionId) {
      setParticipants(null);
      getRequest(`participations/election/${electionId}`).then((res) => {
        if (res != null) {
          const data = {
            labels: res.map(x => x.name),
            datasets: [
              {
                label: "# of Votes",
                data: res.map(x => Number(x.votes)),
                borderWidth: 1,
                backgroundColor: randomBackgroundColor,
              }
            ]
          }
          setParticipants(data)
          console.log(data)
        }
      });
    }
    return () => { };
  }, [electionId]);

  const selectElection = (electionId) => {
    setElectionId(electionId);
  };
  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {!isLoading &&
        elections.length > 0 &&
        elections.map((election) => (
          <button id={election.id} onClick={() => selectElection(election.id)}>
            {" "}
            {election.name}{" "}
          </button>
        ))}
      {!isLoading && elections.length <= 0 && (
        <div>No elections to be shown!</div>
      )}
      <div class="chart-container">
        {participants != null && <Pie data={participants} />}
      </div>
    </div>
  );
};