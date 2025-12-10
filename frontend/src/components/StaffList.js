import React, { useEffect, useState } from "react";
import api from "../api/api"; // ✅ your backend API config file
import Swal from "sweetalert2"; // ✅ for modern popups

function StaffList() {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    department: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ✅ Fetch staff list on load
  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await api.get("/staff");
      setStaff(res.data || []);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Load Failed",
        text: "Failed to load members list.",
        confirmButtonColor: "#d33",
      });
    }
  };

  // ✅ Handle input change
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Validate form before submit
  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.email.trim()) return "Email is required";
    const re = /\S+@\S+\.\S+/;
    if (!re.test(form.email)) return "Email is invalid";
    if (!form.department.trim()) return "Department is required";
    if (!form.role.trim()) return "Role is required";
    return null;
  };

  // ✅ Add or update member
  const onSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: err,
        confirmButtonColor: "#f39c12",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        department: form.department.trim(),
        role: form.role.trim(),
      };

      if (isEditing && form.id) {
        await api.put(`/staff/${form.id}`, payload);
        Swal.fire({
          icon: "success",
          title: "Updated",
          text: "Member updated successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await api.post("/staff", payload);
        Swal.fire({
          icon: "success",
          title: "Registered",
          text: "Staff registered successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      setForm({ id: null, name: "", email: "", department: "", role: "" });
      setIsEditing(false);
      await fetchStaff();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: "Unable to save member.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit existing member
  const onEdit = (staff) => {
    setForm({
      id: staff.userId ?? staff.id,
      name: staff.name,
      email: staff.email,
      department: staff.department,
      role: staff.role,
    });
    setIsEditing(true);
  };

  // ✅ Cancel editing
  const onCancelEdit = () => {
    setForm({ id: null, name: "", email: "", department: "", role: "" });
    setIsEditing(false);
  };

  // ✅ Delete member with SweetAlert confirmation
  const onDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the staff.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/staff/${id}`);
        await fetchStaff();
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Staff deleted successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: "Unable to delete member.",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Members</h2>

      {/* ✅ Registration / Editing Form */}
      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={onSubmit} className="row g-2 align-items-end">
            <div className="col-md-3">
              <label className="form-label">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                className="form-control"
                placeholder="Full name"
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={onChange}
                className="form-control"
                placeholder="email@example.com"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Department</label>
              <input
                name="department"
                value={form.department}
                onChange={onChange}
                className="form-control"
                placeholder="IT, HR, ..."
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={onChange}
                className="form-control"
              >
                <option value="">Select role</option>
                <option value="Admin">Admin</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
            <div className="col-md-2 d-grid">
              <button
                type="submit"
                className={`btn ${isEditing ? "btn-success" : "btn-primary"}`}
                disabled={loading}
              >
                {loading
                  ? isEditing
                    ? "Updating..."
                    : "Registering..."
                  : isEditing
                  ? "Update"
                  : "Register"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={onCancelEdit}
                  className="btn btn-secondary mt-2"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* ✅ Members Table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {staff.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No members found
              </td>
            </tr>
          ) : (
            staff.map((s) => (
              <tr key={s.userId ?? s.id}>
                <td>{s.userId ?? s.id}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.department}</td>
                <td>
                  {s.role ? (
                    <span
                      className={`badge ${
                        s.role === "Admin" ? "bg-primary" : "bg-secondary"
                      }`}
                      style={{ fontSize: "0.85rem" }}
                    >
                      {s.role}
                    </span>
                  ) : (
                    <span className="text-muted">Not Assigned</span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => onEdit(s)}
                    className="btn btn-sm btn-outline-primary me-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(s.userId ?? s.id)}
                    className="btn btn-sm btn-outline-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StaffList;
