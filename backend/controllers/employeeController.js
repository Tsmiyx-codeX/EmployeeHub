
import db from "../config/db.js";

const columns = `
  id,
  full_name AS fullName,
  email,
  phone,
  department,
  position,
  salary,
  status,
  DATE_FORMAT(joining_date, '%Y-%m-%d') AS joiningDate,
  created_at AS createdAt
`;

export async function getEmployees(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT ${columns} FROM employees ORDER BY id DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch employees." });
  }
}

export async function getEmployeeById(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT ${columns} FROM employees WHERE id = ?`,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Employee not found." });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch employee." });
  }
}

export async function createEmployee(req, res) {
  const {
    fullName, email, phone, department, position,
    salary, status, joiningDate
  } = req.body;

  if (!fullName || !email || !department || !position ||
      salary === "" || salary == null) {
    return res.status(400).json({
      message: "Name, email, department, position and salary are required."
    });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO employees
       (full_name, email, phone, department, position, salary, status, joining_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fullName.trim(), email.trim(), phone || null,
        department, position, Number(salary),
        status || "Active", joiningDate || null
      ]
    );

    const [rows] = await db.query(
      `SELECT ${columns} FROM employees WHERE id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: "Employee added successfully.",
      employee: rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(error.code === "ER_DUP_ENTRY" ? 409 : 500).json({
      message: error.code === "ER_DUP_ENTRY"
        ? "This email is already registered."
        : "Failed to add employee."
    });
  }
}

export async function updateEmployee(req, res) {
  const {
    fullName, email, phone, department, position,
    salary, status, joiningDate
  } = req.body;

  if (!fullName || !email || !department || !position ||
      salary === "" || salary == null) {
    return res.status(400).json({
      message: "Name, email, department, position and salary are required."
    });
  }

  try {
    const [result] = await db.query(
      `UPDATE employees SET
       full_name = ?, email = ?, phone = ?, department = ?,
       position = ?, salary = ?, status = ?, joining_date = ?
       WHERE id = ?`,
      [
        fullName.trim(), email.trim(), phone || null,
        department, position, Number(salary),
        status || "Active", joiningDate || null, req.params.id
      ]
    );

    if (!result.affectedRows) {
      const [existing] = await db.query(
        "SELECT id FROM employees WHERE id = ?",
        [req.params.id]
      );
      if (!existing.length) {
        return res.status(404).json({ message: "Employee not found." });
      }
    }

    res.json({ message: "Employee updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(error.code === "ER_DUP_ENTRY" ? 409 : 500).json({
      message: error.code === "ER_DUP_ENTRY"
        ? "This email is already registered."
        : "Failed to update employee."
    });
  }
}

export async function deleteEmployee(req, res) {
  try {
    const [result] = await db.query(
      "DELETE FROM employees WHERE id = ?",
      [req.params.id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Employee not found." });
    }

    res.json({ message: "Employee deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete employee." });
  }
}
