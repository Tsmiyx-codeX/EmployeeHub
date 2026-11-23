
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Pencil, Trash2, Users } from "lucide-react";
import { motion } from "framer-motion";

const API = "http://localhost:5000/api/employees";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(API);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load employees");
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const removeEmployee = async (employee) => {
    if (!window.confirm(`Delete ${employee.fullName}?`)) return;

    try {
      const res = await fetch(`${API}/${employee.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");
      setEmployees((current) => current.filter((e) => e.id !== employee.id));
    } catch (err) {
      setError(err.message);
    }
  };

  const departments = [...new Set(employees.map((e) => e.department))].sort();

  const filtered = employees.filter((employee) => {
    const term = search.toLowerCase();
    const matchesSearch =
      employee.fullName?.toLowerCase().includes(term) ||
      employee.email?.toLowerCase().includes(term) ||
      employee.position?.toLowerCase().includes(term);
    const matchesDepartment =
      department === "All" || employee.department === department;

    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">PEOPLE DIRECTORY</p>
          <h1>Employees</h1>
          <p className="subtitle">Manage your team's employee records.</p>
        </div>
        <button className="primary-btn" onClick={() => navigate("/employees/new")}>
          <Plus size={17} /> Add Employee
        </button>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <section className="panel">
        <div className="toolbar">
          <div className="search-box">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email or position..."
            />
          </div>

          <select value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="All">All departments</option>
            {departments.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>

        <div className="results-label">
          {loading ? "Loading employees…" : `${filtered.length} employee${filtered.length === 1 ? "" : "s"} found`}
        </div>

        {loading ? (
          <p className="message">Loading employees…</p>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Users size={32} />
            <p>{employees.length ? "No matching employees found." : "No employees added yet."}</p>
            {!employees.length && (
              <button className="primary-btn" onClick={() => navigate("/employees/new")}>
                Add Employee
              </button>
            )}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Salary</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <div className="employee-cell">
                        <div className="avatar">{employee.fullName?.charAt(0).toUpperCase()}</div>
                        <div>
                          <strong>{employee.fullName}</strong>
                          <span>{employee.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>{employee.department}</td>
                    <td>{employee.position}</td>
                    <td>₹{Number(employee.salary || 0).toLocaleString("en-IN")}</td>
                    <td><span className={`status-badge ${employee.status.toLowerCase().replace(" ", "-")}`}>{employee.status}</span></td>
                    <td>
                      <div className="actions">
                        <button className="icon-btn" title="Edit employee" onClick={() => navigate(`/employees/edit/${employee.id}`)}>
                          <Pencil size={16} />
                        </button>
                        <button className="icon-btn danger" title="Delete employee" onClick={() => removeEmployee(employee)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </section>
    </div>
  );
}
