import React, { useEffect, useState } from "react";
import api from "../api/api";
import "./quiz.css";

export default function TakeQuizPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await api.get("/quizzes");
      setQuizzes(res.data);
    }
    load();
  }, []);

  if (!quizzes.length) {
    return (
      <div className="container mt-5 text-center">
        <h3>No quizzes available</h3>
      </div>
    );
  }

  const q = quizzes[current];

  const selectOption = (optionLetter) => {
    setSelected(optionLetter);
    setAnswers({
      ...answers,
      [q.quizId]: optionLetter,
    });
  };

  const next = () => {
    if (current < quizzes.length - 1) {
      setCurrent(current + 1);
      setSelected(answers[quizzes[current + 1].quizId] || null);
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setSelected(answers[quizzes[current - 1].quizId] || null);
    }
  };

  // -------------------------------------------------------
  // ✅ SUBMIT QUIZ ATTEMPT TO BACKEND (Very Important!)
  // -------------------------------------------------------
  const submitQuiz = async () => {
    if (!selected) {
      alert("Please select an answer before submitting.");
      return;
    }

    try {
      const user = JSON.parse(
        sessionStorage.getItem("user") || localStorage.getItem("user")
      );
      await api.post("/attempts", {
        userId: user.userId,
        quizId: q.quizId,
        selectedAnswer: selected,
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit attempt:", error);
      alert("Error submitting your quiz. Please try again.");
    }
  };

  return (
    <div className="container py-5 quiz-container">
      <div className="quiz-box shadow-lg p-4 rounded-4">
        {/* HEADER */}
        <h2 className="fw-bold text-primary mb-3">Available Quizzes</h2>
        <hr />

        {/* QUESTION */}
        <h4 className="fw-bold">{q.question}</h4>

        {/* OPTIONS */}
        <div className="options-list mt-3">
          {["A", "B", "C", "D"].map((opt) => (
            <div
              key={opt}
              className={`option-card shadow-sm p-3 mb-2 rounded ${
                selected === opt ? "selected" : ""
              }`}
              onClick={() => selectOption(opt)}
            >
              <strong>{opt}:</strong> {q[`option${opt}`]}
            </div>
          ))}
        </div>

        {/* NAVIGATION */}
        <div className="d-flex justify-content-between mt-4">
          <button
            className="btn btn-outline-secondary"
            disabled={current === 0}
            onClick={prev}
          >
            ← Previous
          </button>

          {current < quizzes.length - 1 ? (
            <button className="btn btn-primary" onClick={next}>
              Next →
            </button>
          ) : (
            <button className="btn btn-success" onClick={submitQuiz}>
              Submit Quiz
            </button>
          )}
        </div>

        {/* STATUS */}
        <p className="mt-3 text-muted">
          Question {current + 1} / {quizzes.length}
        </p>

        {submitted && (
          <div className="alert alert-info mt-3">
            🎉 <strong>Quiz submitted!</strong> Your results will appear in the
            dashboard.
          </div>
        )}
      </div>
    </div>
  );
}
