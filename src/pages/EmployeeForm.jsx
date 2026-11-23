
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

const API = "http://localhost:5000/api/employees";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  department: "",
  position: "",
  salary: "",
  status: "Active",
  joiningDate: "",
};

export default function EmployeeForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;

    const loadEmployee = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to load employee");

        setForm({
          fullName: data.fullName ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          department: data.department ?? "",
          position: data.position ?? "",
          salary: String(data.salary ?? ""),
          status: data.status ?? "Active",
          joiningDate: data.joiningDate ?? "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadEmployee();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(isEditing ? `${API}/${id}` : API, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          salary: Number(form.salary),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Could not save employee");

      navigate("/employees");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isEditing && loading && !form.email) {
    return <div className="page"><p className="message">Loading employee…</p></div>;
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">PEOPLE DIRECTORY</p>
          <h1>{isEditing ? "Edit Employee" : "Add Employee"}</h1>
          <p className="subtitle">
            {isEditing ? "Update this employee's information." : "Enter the details of a new team member."}
          </p>
        </div>

        <button className="secondary-btn" onClick={() => navigate("/employees")}>
          <ArrowLeft size={17} /> Back to Employees
        </button>
      </header>

      <form className="form-panel" onSubmit={handleSubmit}>
        <div className="form-heading">
          <div className="form-heading-icon">👤</div>
          <div>
            <h2>Employee Information</h2>
            <p>Fields marked * are required.</p>
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <div className="form-grid">
          <div className="field">
            <label htmlFor="fullName">Full Name *</label>
            <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} placeholder="e.g. Priya Sharma" required maxLength={100} />
          </div>

          <div className="field">
            <label htmlFor="email">Email Address *</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="name@company.com" required maxLength={150} />
          </div>

          <div className="field">
            <label htmlFor="phone">Phone Number</label>
            <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Enter phone number" maxLength={20} />
          </div>

          <div className="field">
            <label htmlFor="department">Department *</label>
            <select id="department" name="department" value={form.department} onChange={handleChange} required>
              <option value="">Select department</option>
              <option>Engineering</option>
              <option>Human Resources</option>
              <option>Marketing</option>
              <option>Finance</option>
              <option>Sales</option>
              <option>Operations</option>
              <option>Design</option>
              <option>Customer Support</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="position">Job Position *</label>
            <input id="position" name="position" value={form.position} onChange={handleChange} placeholder="e.g. Software Developer" required maxLength={100} />
          </div>

          <div className="field">
            <label htmlFor="salary">Monthly Salary (₹) *</label>
            <input id="salary" name="salary" type="number" min="0" step="0.01" value={form.salary} onChange={handleChange} placeholder="e.g. 35000" required />
          </div>

          <div className="field">
            <label htmlFor="joiningDate">Joining Date</label>
            <input id="joiningDate" name="joiningDate" type="date" value={form.joiningDate} onChange={handleChange} />
          </div>

          <div className="field">
            <label htmlFor="status">Employee Status *</label>
            <select id="status" name="status" value={form.status} onChange={handleChange} required>
              <option>Active</option>
              <option>On Leave</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="secondary-btn" onClick={() => navigate("/employees")}>
            Cancel
          </button>
          <button type="submit" className="primary-btn" disabled={loading}>
            <Save size={17} />
            {loading ? "Saving…" : isEditing ? "Save Changes" : "Add Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}
