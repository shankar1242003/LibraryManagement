const express = require("express");
const router = express.Router();

const { poolPromise } = require("../db/connection");

// GET ALL BOOKS
router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query("SELECT * FROM books");

    res.json(result.recordset);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
});

// ADD BOOK
router.post("/", async (req, res) => {
  try {
    const { title, author, category, quantity } = req.body;

    const pool = await poolPromise;

    await pool
      .request()
      .input("title", title)
      .input("author", author)
      .input("category", category)
      .input("quantity", quantity).query(`
                INSERT INTO books
                (title, author, category, quantity)
                VALUES
                (@title, @author, @category, @quantity)
            `);

    res.status(201).json({
      success: true,
      message: "Book Added Successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// GET BOOK BY ID
router.get("/:id", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().input("book_id", req.params.id).query(`
                SELECT *
                FROM books
                WHERE book_id = @book_id
            `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// UPDATE BOOK
router.put("/:id", async (req, res) => {
  try {
    const { title, author, category, quantity } = req.body;

    const pool = await poolPromise;

    await pool
      .request()
      .input("book_id", req.params.id)
      .input("title", title)
      .input("author", author)
      .input("category", category)
      .input("quantity", quantity).query(`
                UPDATE books
                SET
                    title = @title,
                    author = @author,
                    category = @category,
                    quantity = @quantity
                WHERE book_id = @book_id
            `);

    res.json({
      success: true,
      message: "Book Updated Successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// DELETE BOOK
router.delete("/:id", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().input("book_id", req.params.id).query(`
                DELETE FROM books
                WHERE book_id = @book_id
            `);

    // Check if a row was deleted
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.json({
      success: true,
      message: "Book Deleted Successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
module.exports = router;
