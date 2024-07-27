import "./Graphs.css";
import React, { useEffect, useRef, useState } from 'react';
import { Chart, PointElement, LineElement, LineController, CategoryScale, LinearScale, Tooltip } from 'chart.js';
import Header from "./Header";

// Fetch all data from the API
async function fetchData() {
    //console.log("getData");

    const myHeaders = new Headers();
    myHeaders.append("x-api-key", "9mns924xqak1nkqmkjnpas01742bsino");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    try {
        const response = await fetch(`http://192.168.1.5:8080/sensors/db-data/all`, requestOptions);
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

    return data.filter(entry => new Date(entry.date) >= cutoffDate);
};

// Function to adapt the fetched data for Chart.js
const adaptData = (data, type) => {
    const filteredData = data.map(entry => {
        return {
            date: new Date(entry.date).toLocaleDateString('it-IT'),
            time: new Date(entry.date).toLocaleTimeString('it-IT'),
            value: entry.valueList.find(item => item.description === type)?.value || 0
        };
    });

    return {
        labels: filteredData.map(item => item.date),
        data: filteredData.map(item => parseFloat(item.value)),
        fullData: filteredData,
        unit: type === 'Temperature' ? '°C' : '%' // Set the unit here
    };
};

const Graphs = () => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const [chartType, setChartType] = useState('Temperature');
    const [timeFilter, setTimeFilter] = useState('last-hour');
    const [chartData, setChartData] = useState({ labels: [], data: [], fullData: [] });

    const loadData = async () => {
        const fetchedData = await fetchData();
        const filteredData = filterDataByTime(fetchedData, timeFilter);
        const adaptedData = adaptData(filteredData, chartType);
        setChartData(adaptedData);
    };

    useEffect(() => {
        // Load initial data
        loadData();

        // Set up polling every 5 minutes
        const intervalId = setInterval(loadData, 5 * 60 * 1000); // 5 minutes

        // Clean up interval on component unmount or when dependencies change
        return () => clearInterval(intervalId);
    }, [chartType, timeFilter]);

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

        chartInstanceRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: chartType,
                        data: chartData.data,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1,
                    },
                ],
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    y: {
                        min: -10,
                        max: 100,
                        ticks: {
                            stepSize: 5
                        }
                    }
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
                                const dataPoint = chartData.fullData[index];
                                const unit = chartData.unit;
                                return `Value: ${dataPoint.value} ${unit}`;
                            },
                        },
                    },
                },
            },
        });
    }, [chartData]);

    const handleChartTypeChange = (e) => {
        setChartType(e.target.value);
    };

    const handleTimeFilterChange = (e) => {
        setTimeFilter(e.target.value);
    };

    const hasData = chartData.data.length > 0;

    return (
        <>
            <Header />
            <div className={'graph-container'}>
                <div className="select-container">
                    <select onChange={handleChartTypeChange} value={chartType}>
                        <option value="Temperature">Temperature</option>
                        <option value="Humidity">Humidity</option>
                    </select>
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
                <div className="chart-wrapper">
                    <canvas ref={chartRef} />
                    {!hasData && <p className="no-data-message">NO DATA</p>}
                </div>
            </div>
        </>
    );
};

export default Graphs;