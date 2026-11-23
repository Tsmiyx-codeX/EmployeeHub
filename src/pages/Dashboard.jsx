
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserCheck, Coffee, Building2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const API = "http://localhost:5000/api/employees";

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(API)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Could not load employees");
        setEmployees(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const active = employees.filter((e) => e.status === "Active").length;
  const onLeave = employees.filter((e) => e.status === "On Leave").length;
  const departments = new Set(employees.map((e) => e.department)).size;

  const stats = [
    { label: "Total Employees", value: employees.length, icon: Users, tone: "blue" },
    { label: "Active Employees", value: active, icon: UserCheck, tone: "green" },
    { label: "On Leave", value: onLeave, icon: Coffee, tone: "orange" },
    { label: "Departments", value: departments, icon: Building2, tone: "purple" },
  ];

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Good day, Admin 👋</h1>
          <p className="subtitle">Here's an overview of your workforce.</p>
        </div>
        <button className="primary-btn" onClick={() => navigate("/employees/new")}>
          + Add Employee
        </button>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              className="stat-card"
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <div className={`stat-icon ${stat.tone}`}><Icon size={21} /></div>
              <p>{stat.label}</p>
              <h2>{loading ? "…" : stat.value}</h2>
            </motion.div>
          );
        })}
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Recently Added Employees</h2>
            <p>Your latest employee records</p>
          </div>
          <button className="text-btn" onClick={() => navigate("/employees")}>
            View all <ArrowRight size={16} />
          </button>
        </div>

        {loading ? (
          <p className="message">Loading employees…</p>
        ) : employees.length === 0 ? (
          <div className="empty-state">
            <Users size={30} />
            <p>No employees yet. Add your first employee to get started.</p>
            <button className="primary-btn" onClick={() => navigate("/employees/new")}>
              Add Employee
            </button>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.slice(0, 5).map((employee) => (
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
                    <td><span className={`status-badge ${employee.status.toLowerCase().replace(" ", "-")}`}>{employee.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
