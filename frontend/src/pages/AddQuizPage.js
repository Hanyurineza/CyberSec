import React, { useEffect, useState } from "react";
import api from "../api/api";

const pageWrapper = {
  padding: 24,
  minHeight: "100vh",
  backgroundColor: "#f3f4f6",
};

const container = {
  maxWidth: 1000,
  margin: "0 auto",
};

const card = {
  backgroundColor: "#ffffff",
  borderRadius: 12,
  padding: 24,
  boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
  border: "1px solid #e5e7eb",
};

const header = {
  marginBottom: 24,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: 16,
};

const title = {
  fontSize: 24,
  fontWeight: 700,
  color: "#0f172a",
  margin: 0,
};

const subtitle = {
  margin: 0,
  marginTop: 4,
  fontSize: 14,
  color: "#6b7280",
};

const badge = {
  fontSize: 12,
  padding: "4px 10px",
  borderRadius: 999,
  backgroundColor: "#e0f2fe",
  color: "#0369a1",
  fontWeight: 600,
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 12,
  marginTop: 16,
};

const label = {
  fontSize: 13,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 4,
  display: "block",
};

const select = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  fontSize: 14,
  outline: "none",
};

const input = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  fontSize: 14,
  outline: "none",
};

const textarea = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  fontSize: 14,
  outline: "none",
  resize: "vertical",
};

const primaryButton = {
  marginTop: 16,
  padding: "10px 18px",
  borderRadius: 999,
  border: "none",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  background: "linear-gradient(135deg, #0f766e 0%, #0ea5e9 50%, #1d4ed8 100%)",
  color: "#ffffff",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};

const secondaryButton = {
  padding: "6px 12px",
  borderRadius: 999,
  border: "1px solid #d1d5db",
  fontSize: 13,
  cursor: "pointer",
  backgroundColor: "#ffffff",
};

const tableWrapper = {
  marginTop: 32,
};

const tableTitle = {
  fontSize: 18,
  fontWeight: 600,
  color: "#111827",
  marginBottom: 8,
};

const tableDescription = {
  fontSize: 13,
  color: "#6b7280",
  marginBottom: 12,
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#ffffff",
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)",
};

const th = {
  padding: 10,
  fontSize: 13,
  textAlign: "left",
  borderBottom: "1px solid #e5e7eb",
  backgroundColor: "#0f172a",
  color: "#f9fafb",
};

const td = {
  padding: 10,
  fontSize: 13,
  borderBottom: "1px solid #e5e7eb",
  verticalAlign: "top",
};

const tdActions = {
  ...td,
  whiteSpace: "nowrap",
};

const emptyState = {
  padding: 16,
  fontSize: 13,
  color: "#6b7280",
  textAlign: "center",
};

const tag = {
  display: "inline-block",
  padding: "2px 8px",
  borderRadius: 999,
  backgroundColor: "#eff6ff",
  color: "#1d4ed8",
  fontSize: 11,
  fontWeight: 600,
};

const correctAnswerTag = {
  display: "inline-block",
  marginTop: 4,
  padding: "2px 8px",
  borderRadius: 999,
  backgroundColor: "#ecfdf5",
  color: "#047857",
  fontSize: 11,
  fontWeight: 600,
};

const topicBadgeSmall = {
  display: "inline-block",
  padding: "2px 8px",
  borderRadius: 999,
  backgroundColor: "#f3f4f6",
  color: "#4b5563",
  fontSize: 11,
};

const resetButton = {
  ...secondaryButton,
  marginLeft: 8,
};

const statusText = {
  fontSize: 12,
  color: "#6b7280",
  marginTop: 4,
};

export default function AddQuizPage() {
  const [topics, setTopics] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [quiz, setQuiz] = useState({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
    topicId: "",
  });
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const loadTopics = async () => {
    try {
      const res = await api.get("/topics");
      setTopics(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadQuizzes = async () => {
    try {
      const res = await api.get("/quizzes");
      setQuizzes(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadTopics();
    loadQuizzes();
  }, []);

  const change = (e) =>
    setQuiz({
      ...quiz,
      [e.target.name]: e.target.value,
    });

  const resetForm = () => {
    setQuiz({
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
      topicId: "",
    });
    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!quiz.topicId) {
      alert("Please select a topic.");
      return;
    }

    const payload = {
      question: quiz.question,
      optionA: quiz.optionA,
      optionB: quiz.optionB,
      optionC: quiz.optionC,
      optionD: quiz.optionD,
      correctAnswer: quiz.correctAnswer,
      topicId: parseInt(quiz.topicId, 10),
    };

    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/quizzes/${editingId}`, payload);
        alert("Quiz updated!");
      } else {
        await api.post("/quizzes", payload);
        alert("Quiz added!");
      }

      resetForm();
      await loadQuizzes();
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (q) => {
    setQuiz({
      question: q.question,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctAnswer: q.correctAnswer,
      topicId: String(q.topicId),
    });
    setEditingId(q.quizId); // adjust if your field is different (e.g. q.id)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this quiz?")) return;
    try {
      await api.delete(`/quizzes/${id}`);
      if (editingId === id) {
        resetForm();
      }
      await loadQuizzes();
    } catch (e) {
      console.error(e);
    }
  };

  const getTopicTitle = (topicId) =>
    topics.find((t) => t.topicId === topicId)?.title || "—";

  return (
    <div style={pageWrapper}>
      <div style={container}>
        <div style={card}>
          {/* HEADER */}
          <div style={header}>
            <div>
              <h2 style={title}>Quiz Management</h2>
              <p style={subtitle}>
                Create and maintain multiple-choice questions for each awareness
                topic. Use them later in training and assessments.
              </p>
            </div>
            <div style={badge}>
              {editingId ? "Editing existing quiz" : "Add new quiz"}
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={submit}>
            <div>
              <label style={label}>Topic</label>
              <select
                name="topicId"
                value={quiz.topicId}
                onChange={change}
                required
                style={select}
              >
                <option value="">Select a topic…</option>
                {topics.map((t) => (
                  <option key={t.topicId} value={t.topicId}>
                    {t.title}
                  </option>
                ))}
              </select>
              <p style={statusText}>
                This topic will group the question inside the right awareness
                category.
              </p>
            </div>

            <div style={formGrid}>
              <div>
                <label style={label}>Question</label>
                <textarea
                  name="question"
                  value={quiz.question}
                  onChange={change}
                  placeholder="Type the quiz question here…"
                  rows={3}
                  required
                  style={textarea}
                />
              </div>

              <div>
                <label style={label}>Option A</label>
                <input
                  name="optionA"
                  value={quiz.optionA}
                  onChange={change}
                  placeholder="Option A"
                  required
                  style={input}
                />
              </div>

              <div>
                <label style={label}>Option B</label>
                <input
                  name="optionB"
                  value={quiz.optionB}
                  onChange={change}
                  placeholder="Option B"
                  required
                  style={input}
                />
              </div>

              <div>
                <label style={label}>Option C</label>
                <input
                  name="optionC"
                  value={quiz.optionC}
                  onChange={change}
                  placeholder="Option C"
                  required
                  style={input}
                />
              </div>

              <div>
                <label style={label}>Option D</label>
                <input
                  name="optionD"
                  value={quiz.optionD}
                  onChange={change}
                  placeholder="Option D"
                  required
                  style={input}
                />
              </div>

              <div>
                <label style={label}>Correct Answer</label>
                <select
                  name="correctAnswer"
                  value={quiz.correctAnswer}
                  onChange={change}
                  required
                  style={select}
                >
                  <option value="">Select correct option</option>
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <button style={primaryButton} disabled={saving}>
                {saving
                  ? editingId
                    ? "Updating quiz…"
                    : "Saving quiz…"
                  : editingId
                  ? "Update Quiz"
                  : "Add Quiz"}
              </button>
              {editingId && (
                <button type="button" style={resetButton} onClick={resetForm}>
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* QUIZ LIST TABLE */}
        <div style={tableWrapper}>
          <h3 style={tableTitle}>Existing Quizzes</h3>
          <p style={tableDescription}>
            All questions stored in the system. You can update a question or
            remove it completely.
          </p>

          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Question</th>
                <th style={th}>Topic</th>
                <th style={th}>Options</th>
                <th style={th}>Correct</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.length === 0 && (
                <tr>
                  <td colSpan={5} style={emptyState}>
                    No quizzes yet. Add your first question using the form
                    above.
                  </td>
                </tr>
              )}

              {quizzes.map((q) => (
                <tr key={q.quizId}>
                  <td style={td}>
                    <span style={tag}>Q</span>{" "}
                    <span style={{ fontWeight: 500 }}>{q.question}</span>
                  </td>
                  <td style={td}>
                    <span style={topicBadgeSmall}>
                      {getTopicTitle(q.topicId)}
                    </span>
                  </td>
                  <td style={td}>
                    <div>A. {q.optionA}</div>
                    <div>B. {q.optionB}</div>
                    <div>C. {q.optionC}</div>
                    <div>D. {q.optionD}</div>
                  </td>
                  <td style={td}>
                    <span style={correctAnswerTag}>
                      Correct: {q.correctAnswer}
                    </span>
                  </td>
                  <td style={tdActions}>
                    <button
                      type="button"
                      style={secondaryButton}
                      onClick={() => startEdit(q)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      style={{
                        ...secondaryButton,
                        marginLeft: 6,
                        color: "#b91c1c",
                        borderColor: "#fecaca",
                      }}
                      onClick={() => remove(q.quizId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
