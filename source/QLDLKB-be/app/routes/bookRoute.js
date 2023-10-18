const Controller = require("../controllers/bookController");

module.exports = function(app) {
    app.post("/book/staff", Controller.getByScheduleAndStatus);
    app.get("/book/patient/:id", Controller.getByPatient);
    app.post("/book/patient/detail", Controller.getDetailByPatient);
    app.get("/book/amount", Controller.getAmount);
    app.get("/book/getBookAmount/:id", Controller.getActiveBookAmount);
    app.post("/book/getOne", Controller.getOne);
    app.post("/book/checkDuplicateBook", Controller.checkDuplicateBook);
    app.post("/book", Controller.create);
    app.put("/book/setStatus", Controller.setStatus);
}