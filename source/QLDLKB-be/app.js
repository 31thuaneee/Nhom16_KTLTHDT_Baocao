const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(bodyParser.json());
app.use(cors({
    origin: "*",
    method: ["GET", "POST", "PUT", "DELETE"]
}));

require("./app/routes/accountRoute")(app);
require("./app/routes/interfaceRoute")(app);
require("./app/routes/roleRoute")(app);
require("./app/routes/assignRoute")(app);
require("./app/routes/doctorRoute")(app);
require("./app/routes/staffRoute")(app);
require("./app/routes/patientRoute")(app);
require("./app/routes/departmentRoute")(app);
require("./app/routes/diseaseRoute")(app);
require("./app/routes/packageRoute")(app);
require("./app/routes/scheduleRoute")(app);
require("./app/routes/bookRoute")(app);
require("./app/routes/statisticsRoute")(app);

app.listen(3000);