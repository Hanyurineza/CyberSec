import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [topics, setTopics] = useState([]);

  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState("");

  const [form, setForm] = useState({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
    topicId: "",
  });

  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  /* -------- LOAD QUIZZES & TOPICS -------- */
  const loadData = async () => {
    try {
      const res1 = await api.get("/quizzes");
      const res2 = await api.get("/topics");
      setQuizzes(res1.data);
      setTopics(res2.data);
    } catch (err) {
      console.error("Failed loading quizzes:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* -------- FORM CHANGE -------- */
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  /* -------- CREATE OR UPDATE -------- */
  const saveQuiz = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editing) {
        await api.put(`/quizzes/${editing}`, form);
      } else {
        await api.post("/quizzes", form);
      }

      setForm({
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "",
        topicId: "",
      });
      setEditing(null);
      await loadData();
    } finally {
      setLoading(false);
    }
  };

  /* -------- DELETE QUIZ -------- */
  const remove = async (id) => {
    if (!window.confirm("Delete this quiz?")) return;
    await api.delete(`/quizzes/${id}`);
    await loadData();
  };

  /* -------- FILTER & SEARCH -------- */
  const filtered = quizzes.filter((q) => {
    const matchesSearch = q.question
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesTopic = !topicFilter || q.topicId == topicFilter;

    return matchesSearch && matchesTopic;
  });

  return (
    <div style={page}>
      <h2 style={title}>Manage Quizzes</h2>

      {/* SEARCH + FILTER */}
      <div style={filterBox}>
        <input
          placeholder="Search question..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={input}
        />

        <select
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          style={input}
        >
          <option value="">All Topics</option>
          {topics.map((t) => (
            <option key={t.topicId} value={t.topicId}>
              {t.title}
            </option>
          ))}
        </select>
      </div>

      {/* FORM */}
      <form onSubmit={saveQuiz} style={formBox}>
        <h3 style={{ marginBottom: 10 }}>
          {editing ? "Edit Quiz" : "Create Quiz"}
        </h3>

        <textarea
          name="question"
          placeholder="Enter quiz question"
          value={form.question}
          onChange={onChange}
          style={textarea}
          required
        />

        <div style={grid2}>
          <input
            name="optionA"
            placeholder="Option A"
            value={form.optionA}
            onChange={onChange}
            required
            style={input}
          />
          <input
            name="optionB"
            placeholder="Option B"
            value={form.optionB}
            onChange={onChange}
            required
            style={input}
          />

          <input
            name="optionC"
            placeholder="Option C"
            value={form.optionC}
            onChange={onChange}
            required
            style={input}
          />
          <input
            name="optionD"
            placeholder="Option D"
            value={form.optionD}
            onChange={onChange}
            required
            style={input}
          />
        </div>

        <select
          name="correctAnswer"
          value={form.correctAnswer}
          onChange={onChange}
          style={input}
          required
        >
          <option value="">Correct Answer</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>

        <select
          name="topicId"
          value={form.topicId}
          onChange={onChange}
          style={input}
          required
        >
          <option value="">Choose Topic</option>
          {topics.map((t) => (
            <option key={t.topicId} value={t.topicId}>
              {t.title}
            </option>
          ))}
        </select>

        <button style={btn} disabled={loading}>
          {loading ? "Saving..." : editing ? "Update Quiz" : "Create Quiz"}
        </button>
      </form>

      {/* QUIZZES TABLE */}
      <table style={table}>
        <thead>
          <tr>
            <th style={th}>Question</th>
            <th style={th}>Topic</th>
            <th style={th}>Answer</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((q) => (
            <tr key={q.quizId}>
              <td style={td}>{q.question}</td>
              <td style={td}>
                {topics.find((t) => t.topicId === q.topicId)?.title || "-"}
              </td>
              <td style={td}>{q.correctAnswer}</td>
              <td style={td}>
                <button
                  onClick={() => {
                    setEditing(q.quizId);
                    setForm({ ...q });
                  }}
                  style={editBtn}
                >
                  Edit
                </button>

                <button onClick={() => remove(q.quizId)} style={deleteBtn}>
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {!filtered.length && (
            <tr>
              <td colSpan={4} style={td}>
                No quizzes found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ===================== STYLES ===================== */

const page = { padding: 24 };
const title = { marginBottom: 16 };

const filterBox = {
  display: "flex",
  gap: 10,
  marginBottom: 20,
};

const input = {
  padding: 8,
  fontSize: 14,
  width: "100%",
};

const textarea = {
  padding: 10,
  width: "100%",
  height: 80,
  fontSize: 14,
};

const formBox = {
  padding: 16,
  border: "1px solid #ddd",
  borderRadius: 8,
  marginBottom: 24,
};

const grid2 = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
  marginBottom: 10,
};

const btn = {
  padding: "10px 16px",
  background: "#003366",
  color: "white",
  border: "none",
  borderRadius: 6,
  marginTop: 10,
  cursor: "pointer",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  background: "#003366",
  color: "white",
  padding: 10,
  border: "1px solid #ddd",
};

const td = {
  padding: 10,
  border: "1px solid #ddd",
  verticalAlign: "top",
};

const editBtn = {
  padding: "6px 10px",
  background: "orange",
  border: "none",
  color: "white",
  marginRight: 6,
  cursor: "pointer",
};

const deleteBtn = {
  padding: "6px 10px",
  background: "red",
  border: "none",
  color: "white",
  cursor: "pointer",
};
