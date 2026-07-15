const sql = require("mssql");

const config = {
  user: "sa",
  password: "Pass@123",
  server: "localhost",
  database: "LibraryManagement",
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("✅ Connected to SQL Server");
    return pool;
  })
  .catch((err) => {
    console.error("❌ Database Connection Failed");
    console.error(err);
  });

module.exports = {
  sql,
  poolPromise,
};
