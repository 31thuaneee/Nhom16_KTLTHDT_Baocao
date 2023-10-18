const Controller = require("../controllers/diseaseController");

module.exports = function(app) {
    app.get("/disease", Controller.getAll);
    app.get("/disease/getActive", Controller.getAllActive);
    app.get("/disease/:id", Controller.getOneById);
    app.post("/disease/checkDuplicateName", Controller.checkDuplicateName);
    app.get("/disease/create/newId", Controller.getNewId);
    app.post("/disease", Controller.create);
    app.put("/disease", Controller.update);
    app.put("/disease/setStatus/", Controller.setStatus);
    app.get("/disease/search/:info", Controller.search);
    app.get("/disease/searchActive/:info", Controller.searchActive);
}