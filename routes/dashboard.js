const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db/connection");

router.get("/total-books", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT COUNT(*) AS total_books
      FROM books
    `);

    res.json({
      success: true,
      data: result.recordset[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/total-students", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT COUNT(*) AS total_students
      FROM students
    `);

    res.json({
      success: true,
      data: result.recordset[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
router.get("/issued-books", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT COUNT(*) AS issued_books
      FROM issued_books
      WHERE status = 'Issued'
    `);

    res.json({
      success: true,
      data: result.recordset[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/returned-books", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT COUNT(*) AS returned_books
      FROM issued_books
      WHERE status = 'Returned'
    `);

    res.json({
      success: true,
      data: result.recordset[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/available-books", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT SUM(quantity) AS available_books
      FROM books
    `);

    res.json({
      success: true,
      data: result.recordset[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
module.exports = router;
