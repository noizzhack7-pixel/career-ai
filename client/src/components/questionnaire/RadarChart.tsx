import React from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  labels: string[];
  myScores: number[];
  marketScores?: number[];
}

export const SkillsRadarChart: React.FC<RadarChartProps> = ({
  labels,
  myScores,
}) => {
  const data = {
    labels,
    datasets: [
      {
        label: "הציון שלי",
        data: myScores,
        backgroundColor: "rgba(59, 130, 246, 0.25)",
        borderColor: "rgba(59, 130, 246, 0.8)",
        pointBackgroundColor: "rgba(59, 130, 246, 0.8)",
        pointBorderColor: "#fff",
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: {
          display: false,
          stepSize: 1,
        },
        grid: {
          color: "rgba(59, 130, 246, 0.12)",
          circular: true, // Makes the grid lines circular
        },
        angleLines: {
          color: "rgba(59, 130, 246, 0.12)",
        },
        pointLabels: {
          color: "#64748b",
          font: {
            size: 10,
            weight: "normal" as const,
          },
          padding: 8,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#1e293b",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderRadius: 8,
        padding: 10,
      },
    },
  };

  return (
    <div className="w-full">
      <Radar data={data} options={options} />
    </div>
  );
};

