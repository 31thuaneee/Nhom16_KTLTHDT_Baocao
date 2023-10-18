const  Controller = require("../controllers/roleController");

module.exports = function(app) {
    app.get("/role", Controller.getAll);
    app.get("/role/search/:info", Controller.search);
}