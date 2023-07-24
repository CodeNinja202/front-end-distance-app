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
import Spinner from "react-bootstrap/Spinner";
import {
  Bar,
  Legend,
  BarChart,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
} from "recharts";
////////////////////////////////////////////////////////////////

function ResponsiveExample() {
  // Register the controllers
  Chart.register(PieController, ArcElement, CategoryScale);
  Chart.register(ChartDataLabels);

  //usestate hooks
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [filter, setFilter] = useState("");
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

  // const handleFilterChange = (event) => setFilter(event.target.value);
  const handleDestinationChange = (event) => setDestination(event.target.value);

  //fetches the API endpoint
  const fetchDistanceAndDuration = async (origin) => {
    const response = await fetch(
      "https://radiant-wildwood-27431-f72705ead57e.herokuapp.com/distance",
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
    setIsLoading(true); // set loading to true at the start of data fetch
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
    setDestination("");
    setData(fetchedData);
    setIsLoading(false);
  };
  // when search componenet is uncommented it filters through the data for the inputed search field
  // const filteredData = () => {
  //   if (!filter) return data;
  //   return data.filter((row) => row.some((cell) => cell.includes(filter)));
  // };

  const data1 = [
    {
      name: "Baptist Center",
      miles: 134 ,
      rating: 2,
      
    },
    {
      name: "Ace Run",
      miles: 105 ,
      rating: 2,
      
    },
    {
      name: "City Park",
      miles: 	54.5  ,
      rating: 5,
      
    },
    {
      name: "Whitetail",
      miles: 	304 ,
      rating: 5,
      
    },
    {
      name: "Magnolia ",
      miles: 93.2 ,
      rating: 5,
      
    },
    {
      name: "Pa Davis ",
      miles: 102 ,
      rating: 4,
      
    },
    {
      name: "Summerfield",
      miles: 2.8 ,
      rating: 5,
      
    },
  
  ];
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

          {/* Search Form that searchs  returns data in CSV File */}
          {/* <FormControl
        type="text"
        placeholder="Search"
        className="mr-sm-2"
        onChange={handleFilterChange}
      /> */}
      {isFileLoaded && (
          <div style={{ display: "flex" }}>
            {/* Line Chart */}
            <div style={{ width: "50%" }}>
            <h1 style={{ color:"white"}}>Ross's Top 7 courses in LA</h1>
             
             
              <AreaChart
                style={{ background: "black" }}
                width={730}
                height={250}
                data={data1}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
               
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="miles"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorUv)"
                />
                <Area
                  type="monotone"
                  dataKey="rating"
                  stroke="#82ca9d"
                  fillOpacity={1}
                  fill="url(#colorPv)"
                />
              </AreaChart>
           
            {/* Bar Char */}
            <BarChart
              style={{ background: "black" }}
              width={730}
              height={250}
              data={data1}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="miles" fill="#8884d8" />
              <Bar dataKey="rating" fill="#82ca9d" />
            </BarChart>
            </div>
        
          {/* Search Form that searchs  returns data in CSV File */}
          {/* <FormControl
        type="text"
        placeholder="Search"
        className="mr-sm-2"
        onChange={handleFilterChange}
      /> */}

          {/* Pie Chart */}
          <div style={{ width: "70%" }}>
            <Pie
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  datalabels: {
                    formatter: function (value, context) {
                      const label =
                        context.chart.data.labels[context.dataIndex];
                      return `${label} holes\n${value} total`;
                    },
                    color: "#fff",
                  },
                },
              }}
            />
          </div>




          </div>
                )}

          {/* end pir chart */}

          {/* Search Button */}
          {/* <Button variant="outline-success" onClick={fetchAndSetData}>
        Search
      </Button> */}

          {/* onclick button that fecthes data from the api and returns duration and distance */}
          <Button variant="dark" onClick={fetchAndSetData} disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Loading...
              </>
            ) : (
              "Get Distances and Durations"
            )}
          </Button>

          {/* Input destination address to display distance and duration for each dynamic row in the table */}
          <FormControl
            type="text"
            placeholder="Input starting destination"
            className="mr-sm-2"
            onChange={handleDestinationChange}
          />

          {/* CSV Data Table  */}

          <Table striped bordered hover responsive variant="dark">
            <thead>
              <tr>
                {data[0] &&
                  data[0].map((heading, index) => (
                    <th key={index}>{heading}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(1).map((row, i) => (
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
