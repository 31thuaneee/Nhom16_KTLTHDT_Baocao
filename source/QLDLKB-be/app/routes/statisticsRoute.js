const Controller = require("../controllers/statiscticsController");

module.exports = function(app) {
    app.get("/statistics/customer", Controller.getCustomer);
    app.post("/statistics/doctor", Controller.getDoctor);
    app.post("/statistics/package", Controller.getPackage);
    app.post("/statistics/disease", Controller.getDisease);
    app.post("/statistics/book", Controller.getBook);
}