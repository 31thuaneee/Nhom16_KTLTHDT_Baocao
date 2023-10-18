const Controller = require("../controllers/doctorController");

module.exports = function(app) {
    app.get("/doctor", Controller.getAll);
    app.get("/doctor/patient", Controller.getAllForPatient);
    app.get("/doctor/:id", Controller.getOneById);
    app.post("/doctor/checkDuplicate/identity", Controller.checkDuplicateIdentity);
    app.post("/doctor/checkDuplicate/phoneNumber", Controller.checkDuplicatePhoneNumber);
    app.post("/doctor/checkDuplicate/email", Controller.checkDuplicateEmail);
    app.get("/doctor/checkDelete/:id", Controller.checkDelete);
    app.get("/doctor/create/newId", Controller.getNewId);
    app.post("/doctor", Controller.create);
    app.put("/doctor", Controller.update);
    app.delete("/doctor/:id", Controller.delete);
    app.get("/doctor/search/:info", Controller.search);
    app.get("/doctor/patient/search/:info", Controller.searchForPatient);
    app.get("/doctor/departmentId/:id", Controller.filterByDepartmentId);
}