const {conn, sql} = require("../../config/databaseConnection");
const {Status} = require("../../enums/Status")
const {Message} = require("../../enums/Message")

module.exports = function() {
    this.getAll = async function(result) {
        const pool = await conn;
        const query = "SELECT * FROM PACKAGE";
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

    this.getActive = async function(result) {
        const pool = await conn;
        const query = "SELECT * FROM PACKAGE WHERE GETDATE() <= DenNgay AND GETDATE() >= TuNgay";
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

    this.getOneById = async function(id, result) {
        const pool = await conn;
        const query = "SELECT * FROM PACKAGE WHERE MaGoi = @id";
        return await pool.request().input("id", sql.VarChar, id).query(query, function(err, data) {
            if(!err) {
                if(data.recordset.length > 0) {
                    result(Status.Ok, data.recordset[0], Message.Success, null);
                }else {
                    result(Status.Ok, null, Message.Empty, null);
                }
            }else {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
    }

    this.checkModify = async function(id, result) {
        const pool = await conn;
        const query = "IF EXISTS(SELECT * FROM BOOK WHERE MaGoi=@id) SELECT 'Y' AS KQ " +
            "ELSE SELECT 'N' AS KQ";
        return await pool.request()
            .input("id", sql.VarChar, id)
            .query(query, function(err, data) {
                if(!err) {
                    if(data.recordset.length > 0) {
                        result(Status.Ok, data.recordset[0], Message.Success, null);
                    }else {
                        result(Status.Ok, null, Message.Empty, null);
                    }
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                }
            });
    }

    this.getNewId = async function(result) {
        const pool = await conn;
        const query = "SELECT * FROM PACKAGE";
        return await pool.request().query(query, function(err, data) {
            if(!err) {
                if(data.recordset.length > 0) {
                    let idList = [];
                    let lastId;
                    for(let i=0; i<data.recordset.length; i++) {
                        idList[i] =  parseInt(data.recordset[i].MaGoi.slice(1));
                    }
                    idList.sort(function(a, b) {
                        return a - b;
                    });
                    lastId = "G" + String(idList[data.recordset.length-1]+1);
                    result(Status.Ok, lastId, Message.Success, null);
                }else {
                    result(Status.Ok, "G1", Message.Empty, null);
                }
            }else {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
    }

    this.create = async function(body, result) {
        const pool = await conn;
        const query = "INSERT INTO PACKAGE (MaGoi, TenGoi, GiaGoi, TuNgay, DenNgay) " +
            "VALUES(@id, @name, @price, @dateFrom, @dateTo)";
        return await pool.request()
            .input("id", sql.VarChar, body.id)
            .input("name", sql.NVarChar, body.name)
            .input("price", sql.Money, body.price)
            .input("dateFrom", sql.Date, body.dateFrom)
            .input("dateTo", sql.Date, body.dateTo)
            .query(query, function(err, data) {
                if(!err) {
                    result(Status.Created, null, Message.Success, null);
                    console.log(err);
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                    console.log(data);
                }
            });
    }

    this.update = async function(body, result) {
        const pool = await conn;
        const query = "UPDATE PACKAGE SET TenGoi=@name, GiaGoi=@price, " +
            "TuNgay=@dateFrom, DenNgay=@dateTo WHERE MaGoi=@id";
        return await pool.request()
            .input("name", sql.NVarChar, body.name)
            .input("price", sql.Money, body.price)
            .input("dateFrom", sql.Date, body.dateFrom)
            .input("dateTo", sql.Date, body.dateTo)
            .input("id", sql.VarChar, body.id)
            .query(query, function(err, data) {
                if(!err) {
                    result(Status.Ok, null, Message.Success, null);
                    console.log(err);
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                    console.log(data);
                }
            });
    }

    this.delete = async function(id, result) {
        const pool = await conn;
        const query = "DELETE FROM PACKAGE WHERE MaGoi = @id";
        return await pool.request()
            .input("id", sql.VarChar, id)
            .query(query, function(err, data) {
            if(!err) {
                result(Status.Ok, data, Message.Success, null);
            }else {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
    }

    this.search = async function(info, result) {
        const pool = await conn;
        const query = "SELECT * FROM PACKAGE WHERE TenGoi LIKE N'%" + info + "%'";
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

    this.searchActive = async function(info, result) {
        const pool = await conn;
        const query = "SELECT * FROM PACKAGE WHERE TenGoi LIKE N'%" + info + "%' AND " +
            "GETDATE() <= DenNgay AND GETDATE() >= TuNgay";
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

    this.filterFromTo = async function(body, result) {
        const pool = await conn;
        const query = "SELECT * FROM PACKAGE WHERE NOT (TuNgay > @dateTo OR DenNgay < @dateFrom)";
        return await pool.request()
            .input("dateTo", sql.Date, body.dateTo)
            .input("dateFrom", sql.Date, body.dateFrom)
            .query(query, function(err, data) {
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
}