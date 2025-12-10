// src/components/ReportChart.js
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ReportChart({ data }) {
  // Convert backend reports to chart format
  const chartData = data?.map((r) => ({
    name: r.user?.name || "Unknown User",
    score: Number(r.awarenessScore) || 0,
    correct: Number(r.correctCount) || 0,
  }));

  return (
    <div style={{ width: "100%", height: 300, padding: "0 0 10px 0" }}>
      {!chartData || chartData.length === 0 ? (
        <p style={{ textAlign: "center", color: "#777" }}>No data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />

            <Bar
              dataKey="score"
              fill="#0d6efd"
              radius={[6, 6, 0, 0]}
              name="Awareness Score (%)"
            />

            <Bar
              dataKey="correct"
              fill="#198754"
              radius={[6, 6, 0, 0]}
              name="Correct Answers"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
