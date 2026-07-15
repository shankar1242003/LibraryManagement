const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db/connection");

router.get("/", async (req, res) => {
  try {
    const query = `
            SELECT
                ib.issue_id,
                b.title,
                s.name,
                ib.issue_date,
                ib.due_date,
                ib.return_date,
                ib.status
            FROM issued_books ib
            INNER JOIN books b
                ON ib.book_id = b.book_id
            INNER JOIN students s
                ON ib.student_id = s.student_id
            ORDER BY ib.issue_id DESC
            `;

    const pool = await poolPromise;

    const result = await pool.request().query(query);

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { book_id, student_id, issue_date, due_date } = req.body;

    const pool = await poolPromise;

    // Check book availability
    const bookResult = await pool.request().input("book_id", sql.Int, book_id)
      .query(`
        SELECT quantity
        FROM books
        WHERE book_id = @book_id
    `);

    if (bookResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (bookResult.recordset[0].quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Book is not available",
      });
    }
    await pool
      .request()
      .input("book_id", sql.Int, book_id)
      .input("student_id", sql.Int, student_id)
      .input("issue_date", sql.Date, issue_date)
      .input("due_date", sql.Date, due_date).query(`
        INSERT INTO issued_books
        (
            book_id,
            student_id,
            issue_date,
            due_date,
            status
        )
        VALUES
        (
            @book_id,
            @student_id,
            @issue_date,
            @due_date,
            'Issued'
        )
    `);
    await pool.request().input("book_id", sql.Int, book_id).query(`
        UPDATE books
        SET quantity = quantity - 1
        WHERE book_id = @book_id
    `);
    return res.status(201).json({
      success: true,
      message: "Book Issued Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.put("/:id/return", async (req, res) => {
  try {
    const { return_date } = req.body;

    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("issue_id", sql.Int, req.params.id)
      .input("return_date", sql.Date, return_date).query(`
        UPDATE issued_books
        SET
            return_date = @return_date,
            status = 'Returned'
        WHERE issue_id = @issue_id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        success: false,
        message: "Issue record not found",
      });
    }

    res.json({
      success: true,
      message: "Book Returned Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("issue_id", sql.Int, req.params.id).query(`
        SELECT
            ib.issue_id,
            b.title,
            s.name,
            ib.issue_date,
            ib.due_date,
            ib.return_date,
            ib.status
        FROM issued_books ib
        INNER JOIN books b
            ON ib.book_id = b.book_id
        INNER JOIN students s
            ON ib.student_id = s.student_id
        WHERE ib.issue_id = @issue_id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Issue record not found",
      });
    }

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
