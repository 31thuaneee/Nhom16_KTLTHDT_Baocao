const Schedule = require("../models/scheduleModel");
let model = new Schedule();

exports.getAll = function(req, res) {
    model.getAll(function (status, data, message, error) {
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

exports.getAmount = function(req, res) {
    model.getAmount(function (status, data, message, error) {
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

exports.getOneById = function(req, res) {
    model.getOneById(req.params.id, function (status, data, message, error) {
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

exports.checkModify = function(req, res) {
    model.checkModify(req.params.id, function (status, data, message, error) {
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

exports.getNewId = function(req, res) {
    model.getNewId(function (status, data, message, error) {
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

exports.update = function(req, res) {
    model.update(req.body, function (status, data, message, error) {
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

exports.setStatus = function(req, res) {
    model.setStatus(req.body, function (status, data, message, error) {
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
    model.delete(req.params.id, function (status, data, message, error) {
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

exports.filterByStaff = function(req, res) {
    model.filterByStaff(req.body, function (status, data, message, error) {
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

exports.filterByPatient = function(req, res) {
    model.filterByPatient(req.body, function (status, data, message, error) {
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

