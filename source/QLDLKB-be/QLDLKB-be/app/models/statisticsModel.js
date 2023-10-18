const {conn, sql} = require("../../config/databaseConnection");
const {Status} = require("../../enums/Status")
const {Message} = require("../../enums/Message")

module.exports = function() {
    this.getCustomer = async function(result) {
        const pool = await conn;
        const query = "SELECT * FROM MOST_BOOKING_CUSTOMER ORDER BY SoLuongDat DESC";
        return await pool.request().query(query, function(err, data) {
            if(!err) {
                if(data.recordset.length > 0) {
                    result(Status.Ok, data.recordset, Message.Success, null);
                }else {
                    result(Status.Ok, null, Message.Empty, null);
                }
            }else {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
    }
    this.getDoctor = async function(body, result) {
        const pool = await conn;
        const query = "EXEC MOST_BOOKED_DOCTOR '" + body.month + "', '" + body.year + "'";
        return await pool.request().query(query, function(err, data) {
                if(!err) {
                    if(data.recordset.length > 0) {
                        result(Status.Ok, data.recordset, Message.Success, null);
                    }else {
                        result(Status.Ok, null, Message.Empty, null);
                    }
                    console.log(data);
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                    console.log(err);
                }
            });
    }

    this.getPackage = async function(body, result) {
        const pool = await conn;
        const query = "EXEC MOST_BOOKED_PACKAGE '" + body.month + "', '" + body.year + "'";
        return await pool.request().query(query, function(err, data) {
            if(!err) {
                if(data.recordset.length > 0) {
                    result(Status.Ok, data.recordset, Message.Success, null);
                }else {
                    result(Status.Ok, null, Message.Empty, null);
                }
            }else {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
    }

    this.getDisease = async function(body, result) {
        const pool = await conn;
        const query = "EXEC MOST_BOOKED_DISEASE '" + body.month + "', '" + body.year + "'";
        return await pool.request().query(query, function(err, data) {
            if(!err) {
                if(data.recordset.length > 0) {
                    result(Status.Ok, data.recordset, Message.Success, null);
                }else {
                    result(Status.Ok, null, Message.Empty, null);
                }
            }else {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
    }

    this.getBook = async function(body, result) {
        const pool = await conn;
        const query = "EXEC BOOK_STATUS_DETAIL '" + body.year + "'";
        return await pool.request().query(query, function(err, data) {
            if(!err) {
                if(data.recordset.length > 0) {
                    result(Status.Ok, data.recordset, Message.Success, null);
                }else {
                    result(Status.Ok, null, Message.Empty, null);
                }
                console.log(data);
            }else {
                result(Status.InternalServerError, null, Message.Error, err);
                console.log(err);
            }
        });
    }
}