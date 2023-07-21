// import libraries
import React, { useState } from "react";
import "./index.css";
import Table from "react-bootstrap/Table";
import CSVReader from "react-csv-reader";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import { Pie } from "react-chartjs-2";
import { Chart, PieController, ArcElement, CategoryScale } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Card from "react-bootstrap/Card";
////////////////////////////////////////////////////////////////

function ResponsiveExample() {
  // Register the controllers
  Chart.register(PieController, ArcElement, CategoryScale);
  Chart.register(ChartDataLabels);

  //usestate hooks
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");
  const [destination, setDestination] = useState("");
  const [isFileLoaded, setIsFileLoaded] = useState(false); // add this state
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }],
  });

  // Define the numbers you're interested in
  const numbersOfInterest = new Set([18, 9, 21, 6]);

  // handles chart data
  const handleForce = (data, fileInfo) => {
    setData(data);
    setIsFileLoaded(true);
    // Create a map with unique values in column 6 as keys and their count as values.
    const column6Count = new Map();
    data.forEach((row) => {
      const column6Value = Number(row[5]); // Parse the value as a number
      if (numbersOfInterest.has(column6Value)) {
        // Only count the number if it's one you're interested in
        column6Count.set(
          column6Value,
          (column6Count.get(column6Value) || 0) + 1
        );
      }
    });

    // Convert keys and values of the map to arrays
    const column6Labels = Array.from(column6Count.keys());
    const column6Values = Array.from(column6Count.values());

    // Set chartData state
    setChartData({
      labels: column6Labels,
      datasets: [
        {
          data: column6Values,
          // Use a color generator to assign a different color to each category
          backgroundColor: column6Labels.map(
            (_, i) => "#" + Math.floor(Math.random() * 16777215).toString(16)
          ),
        },
      ],
    });
  };

  const handleFilterChange = (event) => setFilter(event.target.value);
  const handleDestinationChange = (event) => setDestination(event.target.value);

  //fetches the API endpoint
  const fetchDistanceAndDuration = async (origin) => {
    const response = await fetch(
      "https://distance-app-google-3487e739ad8e.herokuapp.com/distance",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origins: origin,
          destinations: destination,
          units: "imperial",
        }),
      }
    );

    const data = await response.json();

    if (data.status === "OK" && data.rows[0].elements[0].status === "OK") {
      const { distance, duration } = data.rows[0].elements[0];
      return { distance: distance.text, duration: duration.text };
    }

    return { distance: "N/A", duration: "N/A" };
  };

  // once data is fetched its sets it to the table and displays it on the browser
  const fetchAndSetData = async () => {
    const fetchedData = await Promise.all(
      data.map(async (row, index) => {
        const origin = `${row[row.length - 2]},${row[row.length - 1]}`; // use the last two columns as lat and long
        const { distance, duration } = await fetchDistanceAndDuration(origin);
        if (
          index === 0 &&
          row[row.length - 1] !== "Duration" &&
          row[row.length - 2] !== "Distance"
        ) {
          //add headers if they do not exist
          return [...row, "Distance", "Duration"];
        }
        return [...row, distance, duration];
      })
    );
    setData(fetchedData);
  };
// when search componenet is uncommented it filters through the data for the inputed search field
  const filteredData = () => {
    if (!filter) return data;
    return data.filter((row) => row.some((cell) => cell.includes(filter)));
  };

  return (
    <div className="main-div-table">
      <Card>
        <Card.Body>
      {/* imports a CSV File */}
      <CSVReader
        cssClass="csv-reader-input"
        label="Select CSV file"
        onFileLoaded={handleForce}
        onError={() => {
          alert("An error occurred reading the file");
          setIsFileLoaded(false); // set the state to false when an error occurred
        }}
        inputId="csvReader"
        inputStyle={{ color: isFileLoaded ? "green" : "red" }} // conditional styling
      />

      {/* Input destination address to display distance and duration for each dynamic row in the table */}
      <FormControl
   
        type="text"
        placeholder="Destination"
        className="mr-sm-2"
        onChange={handleDestinationChange}
      />

      {/* onclick button that fecthes data from the api and returns duration and distance */}
      <Button variant="dark" onClick={fetchAndSetData}>
        Get Distances and Durations
      </Button>

      {/* Pie Chart */}
      <div
        style={{
          width: "850px",
          height: "850px",
          margin: "0 auto", // This will center the div horizontally
        }}
      >
        <Pie
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              datalabels: {
                formatter: function (value, context) {
                  const label = context.chart.data.labels[context.dataIndex];
                  return `${label} holes\n${value} total`;
                },
                color: "#fff",
              },
            },
          }}
        />
      </div>

      {/* Search Form that searchs  returns data in CSV File */}
      {/* <FormControl
        type="text"
        placeholder="Search"
        className="mr-sm-2"
        onChange={handleFilterChange}
      /> */}

      {/* Search Button */}
      {/* <Button variant="outline-success" onClick={fetchAndSetData}>
        Search
      </Button> */}

      {/* CSV Data Table  */}

      <Table striped bordered hover responsive variant="dark">
        <thead>
          <tr>
            {data[0] &&
              data[0].map((heading, index) => <th key={index}>{heading}</th>)}
          </tr>
        </thead>
        <tbody>
          {filteredData()
            .slice(1)
            .map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </Table>
      </Card.Body>
      </Card>
    </div>
  );
}

export default ResponsiveExample;
