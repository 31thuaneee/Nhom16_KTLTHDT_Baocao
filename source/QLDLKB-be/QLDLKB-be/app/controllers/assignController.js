const Assign = require("../models/assignModel");
let model = new Assign();

exports.getAllByInterface = function(req, res) {
    model.getAllByInterface(req.body, function (status, data, message, error) {
        res.send({
            status: status,
            data: data,
            message: message,
            error: error
        })
    }).then(value => {
        console.log(value);
    });
};

exports.checkRole = function(req, res) {
    model.checkRole(req.body, function (status, data, message, error) {
        res.send({
            status: status,
            data: data,
            message: message,
            error: error
        })
    }).then(value => {
        console.log(value);
    });
};

exports.create = function(req, res) {
    model.create(req.body, function (status, data, message, error) {
        res.send({
            status: status,
            data: data,
            message: message,
            error: error
        })
    }).then(value => {
        console.log(value);
    });
};

exports.delete = function(req, res) {
    model.delete(req.params.account, function (status, data, message, error) {
        res.send({
            status: status,
            data: data,
            message: message,
            error: error
        })
    }).then(value => {
        console.log(value);
    });
};

