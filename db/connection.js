const sql = require("mssql");

const config = {
  user: "sa",
  password: "Pass@123",
  //server: "localhost",
  server: "host.docker.internal",

  database: "LibraryManagement",
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// const config = {
//   user: process.env.DB_USER || "sa",
//   password: process.env.DB_PASSWORD || "Pass@123",
//   server: process.env.DB_SERVER || "host.docker.internal",
//   //server: process.env.DB_SERVER || "localhost",
//   database: process.env.DB_DATABASE || "LibraryManagement",
//   port: 1433,
//   options: {
//     encrypt: false,
//     trustServerCertificate: true,
//   },
// };

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
