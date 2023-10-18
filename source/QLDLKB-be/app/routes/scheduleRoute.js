const Controller = require("../controllers/scheduleController");

module.exports = function(app) {
    app.get("/schedule", Controller.getAll);
    app.get("/schedule/amount", Controller.getAmount);
    app.get("/schedule/checkModify/:id", Controller.checkModify);
    app.get("/schedule/:id", Controller.getOneById);
    app.get("/schedule/create/newId", Controller.getNewId);
    app.post("/schedule", Controller.create);
    app.put("/schedule", Controller.update);
    app.put("/schedule/setStatus", Controller.setStatus);
    app.delete("/schedule/:id", Controller.delete);
    app.post("/schedule/filter/staff", Controller.filterByStaff);
    app.post("/schedule/filter/patient", Controller.filterByPatient);
}