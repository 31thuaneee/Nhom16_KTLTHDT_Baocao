const sql_server = require("mssql/msnodesqlv8");

const config = {
    server: "localhost",
    port:1443,
    user: "sa",
    password: "139",
    database: "QLDLKB",
    driver: "msnodesqlv8"
}

const connection = new sql_server.ConnectionPool(config).connect().then(pool => { return pool; });

module.exports = {
    conn: connection,
    sql: sql_server
}
