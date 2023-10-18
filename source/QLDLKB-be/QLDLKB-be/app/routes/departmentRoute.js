const Controller = require("../controllers/departmentController");

module.exports = function(app) {
    app.get("/department", Controller.getAll);
    app.get("/department/getActive", Controller.getAllActive);
    app.get("/department/:id", Controller.getOneById);
    app.post("/department/checkDuplicateName", Controller.checkDuplicateName);
    app.get("/department/create/newId", Controller.getNewId);
    app.post("/department", Controller.create);
    app.put("/department", Controller.update);
    app.put("/department/setStatus", Controller.setStatus);
    app.get("/department/search/:info", Controller.search);
    app.get("/department/searchActive/:info", Controller.searchActive);
}