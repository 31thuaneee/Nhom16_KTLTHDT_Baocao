const Controller = require("../controllers/staffController");

module.exports = function(app) {
    app.get("/staff/amount", Controller.getAmount);
    app.get("/staff/contact", Controller.getContact);
    app.get("/staff/id/:id", Controller.getOneById);
    app.get("/staff/account/:account", Controller.getOneByAccount);
    app.post("/staff/checkDuplicate/identity", Controller.checkDuplicateIdentity);
    app.post("/staff/checkDuplicate/phoneNumber", Controller.checkDuplicatePhoneNumber);
    app.post("/staff/checkDuplicate/email", Controller.checkDuplicateEmail);
    app.get("/staff/create/newId", Controller.getNewId);
    app.post("/staff", Controller.create);
    app.put("/staff", Controller.update);
}