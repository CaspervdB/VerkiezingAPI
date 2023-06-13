// import { Link , Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const randColor = () => {
  return Math.floor(Math.random() * (255 - 1 + 1) + 1)
}
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
    return () => {};
  }, []);

  useEffect(() => {
    console.log(elections);
    return () => {};
  }, [elections]);

  useEffect(() => {
    if (!!electionId) {
      setParticipants(null);
      getRequest(`participations/election/${electionId}`).then((res) => {
        if (res != null) {
          // setParticipants(res);
          const data = {
            labels: res.map(x => x.name),
            datasets: [
              {
                label: "# of Votes",
                data: res.map(x => Number(x.votes)),
                borderWidth: 1,
                backgroundColor: res.map(x => `rgba(255,${randColor},${randColor},0.3)`)
              }
            ]
          }
          setParticipants(data)
          console.log(data)
        }
      });
    }
    return () => {};
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
      {participants != null && <Pie height={10} width={10} data={participants} />}
    </div>
  );
};