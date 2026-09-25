const pool = require('../db');

// Only allow these three branches — prevents SQL injection via the URL
const allowedBranches = ['csm', 'cse', 'csd'];

function getTableName(branch) {
  if (!allowedBranches.includes(branch)) {
    return null;
  }
  return `${branch}_students`;
}

// GET all students in a branch
exports.getAllStudents = async (req, res) => {
  const table = getTableName(req.params.branch);
  if (!table) return res.status(400).json({ error: 'Invalid branch' });

  try {
    const result = await pool.query(`SELECT * FROM ${table} ORDER BY roll_no`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET one student by roll_no
exports.getStudentByRollNo = async (req, res) => {
  const table = getTableName(req.params.branch);
  if (!table) return res.status(400).json({ error: 'Invalid branch' });

  try {
    const result = await pool.query(
      `SELECT * FROM ${table} WHERE roll_no = $1`,
      [req.params.roll_no]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST - add a new student
exports.addStudent = async (req, res) => {
  const table = getTableName(req.params.branch);
  if (!table) return res.status(400).json({ error: 'Invalid branch' });

  const { roll_no, student_name, sec, age, ph_number, email } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO ${table} (roll_no, student_name, sec, age, ph_number, email)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [roll_no, student_name, sec, age, ph_number, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT - update an existing student
exports.updateStudent = async (req, res) => {
  const table = getTableName(req.params.branch);
  if (!table) return res.status(400).json({ error: 'Invalid branch' });

  const { student_name, sec, age, ph_number, email } = req.body;

  try {
    const result = await pool.query(
      `UPDATE ${table}
       SET student_name = $1, sec = $2, age = $3, ph_number = $4, email = $5
       WHERE roll_no = $6 RETURNING *`,
      [student_name, sec, age, ph_number, email, req.params.roll_no]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE a student
exports.deleteStudent = async (req, res) => {
  const table = getTableName(req.params.branch);
  if (!table) return res.status(400).json({ error: 'Invalid branch' });

  try {
    const result = await pool.query(
      `DELETE FROM ${table} WHERE roll_no = $1 RETURNING *`,
      [req.params.roll_no]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted', student: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};