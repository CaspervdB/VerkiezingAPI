import { useEffect, useState } from 'react';
import './App.css';
import { PieChart, Pie, Cell } from "recharts";
import Axios, * as others from 'axios';

function App() {

  const partysToWatch = [ "CDA", "PVDA", "D66" ];
  

  let data = [];
  const [elections, setElections ] = useState([]);
  const [partys, setPartys ] = useState(""); 
  const [participations, setParticipations ] = useState([]);
  let colors = [
    '#2f4cdd',
    'rgb(255, 109, 76)',
    '#2bc155',
    '#1abc9c',
    '#2ecc71',
    '#3498db',
    '#9b59b6',
    '#34495e',
    '#16a085',
    '#27ae60',
    '#2980b9',
    '#8e44ad',
    '#2c3e50',
    '#f1c40f',
    '#e67e22',
    '#e74c3c',
    '#ecf0f1',
    '#95a5a6',
    '#d35400',
    '#c0392b',
    '#bdc3c7',
    '#7f8c8d'
  ];

  const fetchData = async () => {
    try {
      let response = await fetch('http://localhost:3000/elections', { method: "GET", mode: 'no-cors' });
      let data = await response.json();
      setPartys(data);

      response = await fetch('http://localhost:3000/partys', { method: "GET", mode: 'no-cors' });
      data = await response.json();
      setElections(data);

      response = await fetch('http://localhost:3000/participations', { method: "GET", mode: 'no-cors' });
      data = await response.json();
      setParticipations(data);
    } catch (error) {
      console.log(error);
    }
}

  useEffect(() => {
    fetchData();
  }, []);

  const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

  const getVotes = (party, election) => {
    return participations.filter(participation => participation.electionId === election.id && participation.partyId === party)[0]?.votes;
  }


  return (
    <div style={{textAlign: "center"}}>
      <h1>Verkiezingsuitslag vergelijker</h1>
    <div className="App">
    <PieChart width={400} height={400}>
      <Pie
        data={participations}
        cx={200}
        cy={200}
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={80}
        fill="#8884d8"
        dataKey="votes"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
    </PieChart>
      {

        partysToWatch.map(party => {
          return (
            <div>
              <p>{party} had the following number of votes during GR22: { getVotes(party, "GR22") }</p>
              <p>{party} had the following number of votes during GR18: { getVotes(party, "GR18") }</p>
              <p>{party} had the following number of votes during GR14: { getVotes(party, "GR14") }</p>
            </div>
          )
      })
    }
    </div>
    </div>
  );
}

export default App;
