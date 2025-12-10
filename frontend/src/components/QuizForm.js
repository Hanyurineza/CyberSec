// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";

// function QuizForm() {
//   const [topics, setTopics] = useState([]);
//   const [form, setForm] = useState({
//     question: "",
//     optionA: "",
//     optionB: "",
//     optionC: "",
//     optionD: "",
//     correctAnswer: "",
//     topicId: "",
//   });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchTopics();
//   }, []);

//   const fetchTopics = async () => {
//     try {
//       const res = await axios.get("http://localhost:8080/api/topics");
//       setTopics(res.data);
//     } catch (err) {
//       Swal.fire("Error", "Failed to load topics", "error");
//     }
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await axios.post("http://localhost:8080/api/quizzes", form);
//       Swal.fire("Success", "Quiz added successfully!", "success");
//       setForm({
//         question: "",
//         optionA: "",
//         optionB: "",
//         optionC: "",
//         optionD: "",
//         correctAnswer: "",
//         topicId: "",
//       });
//     } catch (error) {
//       Swal.fire("Error", "Failed to add quiz", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="card p-4 shadow-sm">
//       <h4 className="mb-3 text-primary">Add New Quiz Question</h4>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label className="form-label">Question</label>
//           <textarea
//             name="question"
//             value={form.question}
//             onChange={handleChange}
//             className="form-control"
//             required
//           ></textarea>
//         </div>

//         <div className="row">
//           {["A", "B", "C", "D"].map((opt) => (
//             <div className="col-md-6 mb-3" key={opt}>
//               <label className="form-label">Option {opt}</label>
//               <input
//                 type="text"
//                 name={`option${opt}`}
//                 value={form[`option${opt}`]}
//                 onChange={handleChange}
//                 className="form-control"
//                 required
//               />
//             </div>
//           ))}
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Correct Answer</label>
//           <select
//             name="correctAnswer"
//             value={form.correctAnswer}
//             onChange={handleChange}
//             className="form-select"
//             required
//           >
//             <option value="">Select correct option</option>
//             <option value="A">Option A</option>
//             <option value="B">Option B</option>
//             <option value="C">Option C</option>
//             <option value="D">Option D</option>
//           </select>
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Related Topic</label>
//           <select
//             name="topicId"
//             value={form.topicId}
//             onChange={handleChange}
//             className="form-select"
//             required
//           >
//             <option value="">Select topic</option>
//             {topics.map((t) => (
//               <option key={t.topicId} value={t.topicId}>
//                 {t.title}
//               </option>
//             ))}
//           </select>
//         </div>

//         <button type="submit" className="btn btn-primary" disabled={loading}>
//           {loading ? "Saving..." : "Save Quiz"}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default QuizForm;
