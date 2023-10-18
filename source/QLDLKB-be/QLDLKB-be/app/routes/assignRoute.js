const Controller = require("../controllers/assignController");

module.exports = function(app) {
    app.post("/assign/getByInterface", Controller.getAllByInterface);
    app.post("/assign/checkRole", Controller.checkRole);
    app.post("/assign", Controller.create);
    app.delete("/assign/:account", Controller.delete);
}