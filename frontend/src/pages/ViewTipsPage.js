import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function ViewTipsPage() {
  const [tips, setTips] = useState([]);

  const loadTips = async () => {
    const { data } = await api.get("/awareness/tips");
    setTips(data);
  };

  useEffect(() => {
    loadTips();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Cybersecurity Awareness Tips</h2>

      <ul>
        {tips.map((tip) => (
          <li key={tip.tipId} style={{ marginBottom: "10px" }}>
            {tip.description}
          </li>
        ))}
      </ul>

      {!tips.length && <p>No tips available.</p>}
    </div>
  );
}
