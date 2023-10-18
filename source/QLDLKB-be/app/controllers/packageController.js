const Package = require("../models/packageModel");
let model = new Package();

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

exports.getActive = function(req, res) {
    model.getActive(function (status, data, message, error) {
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

exports.search = function(req, res) {
    model.search(req.params.info, function (status, data, message, error) {
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

exports.searchActive = function(req, res) {
    model.searchActive(req.params.info, function (status, data, message, error) {
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

exports.filterFromTo = function(req, res) {
    model.filterFromTo(req.body, function (status, data, message, error) {
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


