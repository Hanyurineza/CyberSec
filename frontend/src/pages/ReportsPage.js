import React, { useEffect, useState } from "react";
import api from "../api/api";

// Excel export
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// PDF export
import jsPDF from "jspdf";
import "jspdf-autotable";

// Chart
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

// Labels plugin for showing % above bars
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

export default function ReportsPage() {
  const user = JSON.parse(
    sessionStorage.getItem("user") || localStorage.getItem("user")
  );
  const role = user?.role?.toLowerCase();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const loadReports = async () => {
    try {
      const { data } = await api.get("/reports");
      setReports(data);
    } catch (err) {
      console.error("Failed loading reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  // FILTER LOGIC
  const filtered = reports.filter((r) => {
    const matchesSearch =
      r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.user?.email?.toLowerCase().includes(search.toLowerCase());

    const matchesDept =
      !departmentFilter || r.user?.department === departmentFilter;

    const date = new Date(r.createdAt);
    const matchesDateFrom = dateFrom ? date >= new Date(dateFrom) : true;
    const matchesDateTo = dateTo ? date <= new Date(dateTo) : true;

    return matchesSearch && matchesDept && matchesDateFrom && matchesDateTo;
  });

  /* -------------------------------------------------------
     🌈 IMPROVED MODERN GRADIENT CHART
  ---------------------------------------------------------*/

  const chartData = {
    labels: filtered.map((r) => r.user?.name),
    datasets: [
      {
        label: "Awareness Score (%)",
        data: filtered.map((r) => r.awarenessScore),
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const { ctx: c } = chart;

          const gradient = c.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(13,110,253,0.95)");
          gradient.addColorStop(1, "rgba(13,110,253,0.45)");
          return gradient;
        },
        borderRadius: 10,
        barThickness: 40,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        backgroundColor: "#fff",
        borderColor: "#0d6efd",
        borderWidth: 1,
        titleColor: "#0d6efd",
        bodyColor: "#000",
      },
      datalabels: {
        anchor: "end",
        align: "top",
        formatter: (value) => `${Math.round(value)}%`,
        color: "#003366",
        font: { weight: "bold", size: 12 },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  /* -------------------- EXPORT TO EXCEL -------------------- */
  const exportExcel = () => {
    const sheet = XLSX.utils.json_to_sheet(
      filtered.map((r) => ({
        Name: r.user?.name,
        Email: r.user?.email,
        Department: r.user?.department,
        Attempts: r.totalAttempts,
        Correct: r.correctCount,
        Score: r.awarenessScore + "%",
        Date: new Date(r.createdAt).toLocaleString(),
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Reports");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), "Awareness_Reports.xlsx");
  };

  /* -------------------- EXPORT TO PDF -------------------- */
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Awareness Reports", 14, 10);

    doc.autoTable({
      startY: 20,
      head: [
        ["Name", "Email", "Department", "Attempts", "Correct", "Score", "Date"],
      ],
      body: filtered.map((r) => [
        r.user?.name,
        r.user?.email,
        r.user?.department,
        r.totalAttempts,
        r.correctCount,
        r.awarenessScore + "%",
        new Date(r.createdAt).toLocaleString(),
      ]),
    });

    doc.save("Awareness_Reports.pdf");
  };

  /* -------------------- PAGE RENDER -------------------- */

  return (
    <div style={page}>
      <h2 style={{ marginBottom: 16 }}>
        {role === "superadmin"
          ? "All Staff Awareness Reports"
          : role === "admin"
          ? "Department Awareness Reports"
          : "My Awareness Report"}
      </h2>

      {/* FILTER BAR */}
      <div style={filterBox}>
        <input
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={input}
        />

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          style={input}
        >
          <option value="">All Departments</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Administration">Administration</option>
          <option value="Statistics">Statistics</option>
        </select>

        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          style={input}
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          style={input}
        />

        <button style={btn} onClick={exportExcel}>
          Export Excel
        </button>
        <button style={btn} onClick={exportPDF}>
          Export PDF
        </button>
      </div>

      {/* CHART */}
      <div style={{ marginTop: 20, marginBottom: 30 }}>
        <h3 style={{ marginBottom: 10 }}>Score Distribution</h3>

        {filtered.length === 0 ? (
          <div style={{ padding: 20, textAlign: "center", color: "#777" }}>
            No data available to display chart.
          </div>
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>

      {/* TABLE */}
      {loading ? (
        <div style={loadingBox}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={noData}>No reports found.</div>
      ) : (
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>User</th>
              <th style={th}>Email</th>
              <th style={th}>Department</th>
              <th style={th}>Total Attempts</th>
              <th style={th}>Correct Answers</th>
              <th style={th}>Score (%)</th>
              <th style={th}>Date</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((r) => (
              <tr key={r.reportId}>
                <td style={td}>{r.user?.name || "Unknown"}</td>
                <td style={td}>{r.user?.email}</td>
                <td style={td}>{r.user?.department || "-"}</td>
                <td style={td}>{r.totalAttempts}</td>
                <td style={td}>{r.correctCount}</td>
                <td style={score(r.awarenessScore)}>
                  {Math.round(r.awarenessScore)}%
                </td>
                <td style={td}>{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ===== STYLES ===== */
const page = { padding: 24 };

const filterBox = {
  display: "flex",
  gap: 10,
  marginBottom: 20,
};

const input = {
  padding: 8,
  fontSize: 14,
};

const btn = {
  padding: "8px 12px",
  background: "#003366",
  color: "white",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 14,
};

const th = {
  background: "#003366",
  color: "white",
  padding: 10,
  border: "1px solid #ddd",
  fontSize: 14,
};

const td = {
  padding: 10,
  border: "1px solid #ddd",
  fontSize: 14,
};

const loadingBox = {
  padding: 20,
  textAlign: "center",
  background: "#f5f5f5",
  borderRadius: 8,
};

const noData = {
  padding: 20,
  background: "#fff3cd",
  color: "#856404",
  borderRadius: 8,
};

const score = (value) => ({
  ...td,
  fontWeight: "bold",
  color: value >= 70 ? "green" : value >= 40 ? "orange" : "red",
});
