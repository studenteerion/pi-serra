import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto"; //import is necessary for the chart to work
import { Line } from "react-chartjs-2";
import Header from '../components/header';

const labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const LineChart = () => {
    const [apiData, setApiData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/alldata')
            .then(response => response.json())
            .then(data => {
                const temperatures = data.map(item => item.Temperature);
                setApiData(temperatures);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    const data = {
        labels: labels,
        datasets: [
            {
                label: "My First dataset",
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
                data: apiData,
            },
        ],
    };

    console.log(apiData);

    return (
        <div>
            <Header index={2} />
            <Line data={data} />
        </div>
    );
};

export default LineChart;