const Controller = require("../controllers/interfaceController");

module.exports = function(app) {
    app.get("/interface", Controller.getAll);
    app.get("/interface/search/:info", Controller.search);
}