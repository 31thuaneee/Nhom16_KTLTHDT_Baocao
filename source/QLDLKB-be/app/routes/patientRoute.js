const Controller = require("../controllers/patientController");

module.exports = function(app) {
    app.get("/patient/amount", Controller.getAmount);
    app.get("/patient/id/:id", Controller.getOneById);
    app.get("/patient/account/:account", Controller.getOneByAccount);
    app.post("/patient/checkDuplicate/identity", Controller.checkDuplicateIdentity);
    app.post("/patient/checkDuplicate/phoneNumber", Controller.checkDuplicatePhoneNumber);
    app.post("/patient/checkDuplicate/email", Controller.checkDuplicateEmail);
    app.get("/patient/create/newId", Controller.getNewId);
    app.post("/patient", Controller.create);
    app.put("/patient", Controller.update);
}