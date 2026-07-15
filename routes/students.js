const express = require("express");
const router = express.Router();

const { sql, poolPromise } = require("../db/connection");
// GET /api/students
router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .query("SELECT * FROM students ORDER BY student_id DESC");

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, department, academic_year } = req.body;

    const pool = await poolPromise;

    await pool
      .request()
      .input("name", sql.VarChar, name)
      .input("email", sql.VarChar, email)
      .input("phone", sql.VarChar, phone)
      .input("department", sql.VarChar, department)
      .input("academic_year", sql.Int, academic_year).query(`
                  INSERT INTO students
                  (name,email,phone,department,academic_year)
                  VALUES
                  (@name,@email,@phone,@department,@academic_year)
              `);

    res.json({
      success: true,
      message: "Student Added Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query("SELECT * FROM students WHERE student_id=@id");

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, email, phone, department, academic_year } = req.body;

    const pool = await poolPromise;

    await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .input("name", sql.VarChar, name)
      .input("email", sql.VarChar, email)
      .input("phone", sql.VarChar, phone)
      .input("department", sql.VarChar, department)
      .input("academic_year", sql.Int, academic_year).query(`
                  UPDATE students
                  SET
                      name=@name,
                      email=@email,
                      phone=@phone,
                      department=@department,
                      academic_year=@academic_year
                  WHERE student_id=@id
              `);

    res.json({
      success: true,
      message: "Student Updated Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const pool = await poolPromise;

    await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query("DELETE FROM students WHERE student_id=@id");

    res.json({
      success: true,
      message: "Student Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;
