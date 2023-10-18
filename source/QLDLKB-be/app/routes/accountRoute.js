const Controller = require("../controllers/accountController");

module.exports = function(app) {
    app.get("/account/staff/:account", Controller.getAllStaff);
    app.get("/account/customer", Controller.getAllCustomer);
    app.get("/account/checkAccount/:account", Controller.checkAccount);
    app.get("/account/checkDuplicateAccount/:account", Controller.checkDuplicateAccount);
    app.post("/account/checkLogin", Controller.checkLogin);
    app.get("/account/checkAccount/:account", Controller.checkAccount);
    app.post("/account/checkChangePassword", Controller.checkChangePassword);
    app.post("/account", Controller.create);
    app.put("/account/setStatus", Controller.setStatus);
    app.put("/account/sendForgotPassword/:account", Controller.resetPassword);
    app.put("/account/changePassword", Controller.changePassword);
    app.post("/account/search/staff", Controller.searchStaff);
    app.get("/account/search/patient/:info", Controller.searchPatient);
}