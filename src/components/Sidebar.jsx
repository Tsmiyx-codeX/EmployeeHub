
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserRoundPlus,
  BriefcaseBusiness,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <BriefcaseBusiness size={23} />
        </div>
        <div>
          <h2>EmployeeHub</h2>
          <p>PEOPLE MANAGEMENT</p>
        </div>
      </div>

      <p className="nav-heading">WORKSPACE</p>

      <nav className="nav-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/employees" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <Users size={19} />
          <span>Employees</span>
        </NavLink>

        <NavLink to="/employees/new" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <UserRoundPlus size={19} />
          <span>Add Employee</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="admin-avatar">A</div>
        <div>
          <strong>Administrator</strong>
          <span>HR Management</span>
        </div>
      </div>
    </aside>
  );
}
