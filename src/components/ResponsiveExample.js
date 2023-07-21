import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import CSVReader from 'react-csv-reader';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import { Pie } from 'react-chartjs-2';
import { Chart, PieController, ArcElement, CategoryScale } from 'chart.js';

// Register the controllers
Chart.register(PieController, ArcElement, CategoryScale);

function ResponsiveExample() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('');
  const [destination, setDestination] = useState('');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }]
  });

  // handles chart data
  const handleForce = (data, fileInfo) => {
    setData(data);
  
    // Create a map with the types of holes as keys and their distances as values.
    const holesCount = { "18": 0, "9": 0, "Other": 0 };
    data.forEach(row => {
      const hole = row[4];
      switch(hole) {
        case "18":
          holesCount["18"] += 1;
          break;
        case "9":
          holesCount["9"] += 1;
          break;
        default:
          holesCount["Other"] += 1;
          break;
      }
    });
  
    console.log(holesCount); // Log the hole counts
  
    // Set chartData state
    setChartData({
      labels: Object.keys(holesCount),
      datasets: [{
        data: Object.values(holesCount),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          // add more colors if you have more types of holes
        ]
      }]
    });
  }
  
  

  const handleFilterChange = (event) => setFilter(event.target.value);
  const handleDestinationChange = (event) => setDestination(event.target.value);

  const fetchDistanceAndDuration = async (origin) => {
    const response = await fetch(
      'https://distance-app-google-3487e739ad8e.herokuapp.com/distance',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origins: origin,
          destinations: destination,
          units: 'imperial'
        })
      }
    );
  
    const data = await response.json();
  
    if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
      const { distance, duration } = data.rows[0].elements[0];
      return { distance: distance.text, duration: duration.text };
    }
  
    return { distance: 'N/A', duration: 'N/A' };
  };
  
  const fetchAndSetData = async () => {
    const fetchedData = await Promise.all(
      data.map(async (row, index) => {
        const origin = `${row[row.length - 2]},${row[row.length - 1]}`; // use the last two columns as lat and long
        const { distance, duration } = await fetchDistanceAndDuration(origin);
        if(index === 0 && row[row.length - 1] !== 'Duration' && row[row.length - 2] !== 'Distance'){
          //add headers if they do not exist
          return [...row, 'Distance', 'Duration'];
        }
        return [...row, distance, duration];
      })
    );
    setData(fetchedData);
  };

  const filteredData = () => {
    if (!filter) return data;
    return data.filter(row => row.some(cell => cell.includes(filter)));
  };

  return (
    <div>
          <CSVReader
        cssClass="csv-reader-input"
        label="Select CSV file"
        onFileLoaded={handleForce}
        onError={() => alert("An error occurred reading the file")}
        inputId="csvReader"
        inputStyle={{color: 'red'}}
      />

      <FormControl
        type="text"
        placeholder="Search"
        className="mr-sm-2"
        onChange={handleFilterChange}
      />
      <Button variant="outline-success" onClick={fetchAndSetData}>Search</Button>

      <FormControl
        type="text"
        placeholder="Destination"
        className="mr-sm-2"
        onChange={handleDestinationChange}
      />
      <Button variant="outline-success" onClick={fetchAndSetData}>Get Distances and Durations</Button>

      <Pie data={chartData} />


      <Table striped bordered hover responsive variant='dark'>
        <thead>
          <tr>
            {data[0] && data[0].map((heading, index) => (
              <th key={index}>{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData().slice(1).map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ResponsiveExample;
