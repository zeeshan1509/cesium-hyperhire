import React from "react";
import { Bar } from "react-chartjs-2";
import "./Popup.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const Popup = ({ position, temperature }) => {
  const chartData = {
    labels: ["Temperature"],
    datasets: [
      {
        label: "°C",
        data: [temperature],
        backgroundColor: ["rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(255, 99, 132, 1)"],
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { grid: { display: false } },
      y: { min: -2, max: 50, grid: { display: true } },
    },
  };

  if (!position) return null;

  return (
    <div
      className="popup-container"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <h4>Temperature</h4>
      <Bar data={chartData} options={chartOptions} height={300} />
    </div>
  );
};

export default Popup;
