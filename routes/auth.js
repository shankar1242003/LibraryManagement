const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db/connection");

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .input("password", sql.VarChar, password).query(`
        SELECT *
        FROM admin
        WHERE username = @username
          AND password = @password
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid Username or Password",
      });
    }

    res.json({
      success: true,
      message: "Login Successful",
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
