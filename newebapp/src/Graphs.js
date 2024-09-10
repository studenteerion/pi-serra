import "./Graphs.css";
import React, { useEffect, useRef, useState } from 'react';
import {
  Chart,
  PointElement,
  LineElement,
  LineController,
  CategoryScale,
  LinearScale,
  Tooltip,
} from 'chart.js';
import Header from "./Header";

// Fetch all data from the API
async function fetchData() {
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "9mns924xqak1nkqmkjnpas01742bsino");
  myHeaders.append("ngrok-skip-browser-warning", "69420");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      `https://generally-enormous-snapper.ngrok-free.app/sensors/db-data/all`,
      requestOptions
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Function to filter data based on time filter
const filterDataByTime = (data, timeFilter) => {
  const now = new Date();
  let cutoffDate;

  switch (timeFilter) {
    case 'last-ten-minutes':
      cutoffDate = new Date(now.getTime() - 10 * 60 * 1000);
      break;
    case 'last-hour':
      cutoffDate = new Date(now.getTime() - 60 * 60 * 1000);
      break;
    case 'last-day':
      cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case 'last-week':
      cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'last-month':
      cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'last-three-months':
      cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case 'all':
    default:
      return data; // No filter applied
  }

  return data.filter((entry) => new Date(entry.date) >= cutoffDate);
};

// Function to adapt the fetched data for Chart.js
const adaptData = (data) => {
  const filteredData = data.map((entry) => {
    const temperatureValue =
      entry.valueList.find((item) => item.description === 'Temperature')?.value || 0;
    const humidityValue =
      entry.valueList.find((item) => item.description === 'Humidity')?.value || 0;

    return {
      date: new Date(entry.date).toLocaleDateString('it-IT'),
      time: new Date(entry.date).toLocaleTimeString('it-IT'),
      temperature: parseFloat(temperatureValue),
      humidity: parseFloat(humidityValue),
    };
  });

  return {
    labels: filteredData.map((item) => item.date),
    temperatureData: filteredData.map((item) => item.temperature),
    humidityData: filteredData.map((item) => item.humidity),
    fullData: filteredData,
  };
};

const Graphs = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [timeFilter, setTimeFilter] = useState('last-hour');
  const [chartData, setChartData] = useState({ labels: [], temperatureData: [], humidityData: [], fullData: [] });
  const [showTemperature, setShowTemperature] = useState(true);
  const [showHumidity, setShowHumidity] = useState(true);

  const loadData = async () => {
    const fetchedData = await fetchData();
    const filteredData = filterDataByTime(fetchedData, timeFilter);
    const adaptedData = adaptData(filteredData);
    setChartData(adaptedData);
  };

  useEffect(() => {
    // Load initial data
    loadData();

    // Set up polling every 5 minutes
    const intervalId = setInterval(loadData, 5 * 60 * 1000); // 5 minutes

    // Clean up interval on component unmount or when dependencies change
    return () => clearInterval(intervalId);
  }, [timeFilter]);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');

    Chart.register(
      PointElement,
      LineElement,
      LineController,
      CategoryScale,
      LinearScale,
      [Tooltip]
    );

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const datasets = [];

    if (showTemperature) {
      datasets.push({
        label: 'Temperature',
        data: chartData.temperatureData,
        fill: false,
        borderColor: 'rgb(153, 102, 255)', // Purple color
        tension: 0.1,
        yAxisID: 'y',
      });
    }

    if (showHumidity) {
      datasets.push({
        label: 'Humidity',
        data: chartData.humidityData,
        fill: false,
        borderColor: 'rgb(54, 162, 235)', // Blue color
        tension: 0.1,
        yAxisID: 'y1',
      });
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: datasets,
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          y: {
            min: -10,
            max: 100,
            ticks: {
              stepSize: 5,
            },
            position: 'left',
            title: {
              display: true,
              text: 'Temperature (°C)',
            },
          },
          y1: {
            min: 0,
            max: 100,
            ticks: {
              stepSize: 5,
            },
            position: 'right',
            title: {
              display: true,
              text: 'Humidity (%)',
            },
            grid: {
              drawOnChartArea: false, // Avoid grid lines overlap
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: function (tooltipItems) {
                const index = tooltipItems[0].dataIndex;
                const dataPoint = chartData.fullData[index];
                return `Date: ${dataPoint.date} \nHour: ${dataPoint.time}`;
              },
              label: function (tooltipItem) {
                const index = tooltipItem.dataIndex;
                const datasetLabel = tooltipItem.dataset.label;
                const dataPoint = chartData.fullData[index];
                const value =
                  datasetLabel === 'Temperature'
                    ? dataPoint.temperature
                    : dataPoint.humidity;
                const unit = datasetLabel === 'Temperature' ? '°C' : '%';
                return `${datasetLabel}: ${value} ${unit}`;
              },
            },
          },
        },
      },
    });
  }, [chartData, showTemperature, showHumidity]);

  const handleTimeFilterChange = (e) => {
    setTimeFilter(e.target.value);
  };

  const handleShowTemperatureChange = () => {
    setShowTemperature((prev) => !prev);
  };

  const handleShowHumidityChange = () => {
    setShowHumidity((prev) => !prev);
  };

  const hasData = chartData.temperatureData.length > 0 || chartData.humidityData.length > 0;

  return (
    <>
      <Header />
      <div className={'graph-container'}>
        <div className="select-container">
          <select onChange={handleTimeFilterChange} value={timeFilter}>
            <option value="last-ten-minutes">Last 10 Minutes</option>
            <option value="last-hour">Last Hour</option>
            <option value="last-day">Last Day</option>
            <option value="last-week">Last Week</option>
            <option value="last-month">Last Month</option>
            <option value="last-three-months">Last 3 Months</option>
            <option value="all">All</option>
          </select>
        </div>
        <div className="checkbox-container">
          <label>
            <input
              type="checkbox"
              checked={showTemperature}
              onChange={handleShowTemperatureChange}
            />
            Show Temperature
          </label>
          <label>
            <input
              type="checkbox"
              checked={showHumidity}
              onChange={handleShowHumidityChange}
            />
            Show Humidity
          </label>
        </div>
        <div className="chart-wrapper">
          <canvas ref={chartRef} />
          {!hasData && <p className="no-data-message">NO DATA</p>}
        </div>
      </div>
    </>
  );
};

export default Graphs;
