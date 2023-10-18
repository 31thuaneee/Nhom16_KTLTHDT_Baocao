const Controller = require("../controllers/packageController");

module.exports = function(app) {
    app.get("/package", Controller.getAll);
    app.get("/package/getActive", Controller.getActive);
    app.get("/package/:id", Controller.getOneById);
    app.get("/package/checkModify/:id", Controller.checkModify);
    app.get("/package/create/newId", Controller.getNewId);
    app.post("/package", Controller.create);
    app.put("/package", Controller.update);
    app.delete("/package/:id", Controller.delete);
    app.get("/package/search/:info", Controller.search);
    app.get("/package/searchActive/:info", Controller.searchActive);
    app.post("/package/getFromTo", Controller.filterFromTo)
}