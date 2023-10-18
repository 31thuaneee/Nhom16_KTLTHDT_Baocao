const {conn, sql} = require("../../config/databaseConnection");
const {Status} = require("../../enums/Status")
const {Message} = require("../../enums/Message")

module.exports = function() {
    this.getAll = async function(result) {
        const pool = await conn;
        const query = "SELECT * FROM DISEASE";
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

    this.getAllActive = async function(result) {
        const pool = await conn;
        const query = "SELECT * FROM DISEASE WHERE TrangThai = 1";
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
        const query = "SELECT * FROM DISEASE WHERE MaBenh = @id";
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

    this.checkDuplicateName = async function(body, result) {
        const pool = await conn;
        const query = "IF EXISTS(SELECT * FROM DISEASE WHERE TenBenh=@name AND MaBenh = @id) " +
            "SELECT 'N' AS KQ ELSE IF EXISTS(SELECT * FROM DISEASE WHERE TenBenh=@name) SELECT 'Y'" +
            " AS KQ ELSE SELECT 'N' AS KQ";
        return await pool.request()
            .input("name", sql.NVarChar, body.name)
            .input("id", sql.VarChar, body.id)
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
        const query = "SELECT * FROM DISEASE";
        return await pool.request().query(query, function(err, data) {
            if(!err) {
                if(data.recordset.length > 0) {
                    let idList = [];
                    let lastId;
                    for(let i=0; i<data.recordset.length; i++) {
                        idList[i] =  parseInt(data.recordset[i].MaBenh.slice(1));
                    }
                    idList.sort(function(a, b) {
                        return a - b;
                    });
                    lastId = "B" + String(idList[data.recordset.length-1]+1);
                    result(Status.Ok, lastId, Message.Success, null);
                }else {
                    result(Status.Ok, "B1", Message.Empty, null);
                }
            }else {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
    }

    this.create = async function(body, result) {
        const pool = await conn;
        const query = "INSERT INTO DISEASE (MaBenh, TenBenh, TrangThai) VALUES(@id, @name, 1)";
        return await pool.request()
            .input("id", sql.VarChar, body.id)
            .input("name", sql.NVarChar, body.name)
            .query(query, function(err, data) {
                if(!err) {
                    result(Status.Created, data, Message.Success, null);
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                }
            });
    }

    this.update = async function(body, result) {
        const pool = await conn;
        const query = "UPDATE DISEASE SET TenBenh=@name WHERE MaBenh=@id";
        return await pool.request()
            .input("name", sql.NVarChar, body.name)
            .input("id", sql.VarChar, body.id)
            .query(query, function(err, data) {
                if(!err) {
                    result(Status.Ok, data, Message.Success, null);
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                }
            });
    }

    this.setStatus = async function(body, result) {
        const pool = await conn;
        const query = "UPDATE DISEASE SET TrangThai=@status WHERE MaBenh=@id";
        return await pool.request()
            .input("status", sql.Bit, body.status)
            .input("id", sql.VarChar, body.id)
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
        const query = "SELECT * FROM DISEASE WHERE TenBenh LIKE N'%" + info + "%'";
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
        const query = "SELECT * FROM DISEASE WHERE TenBenh LIKE N'%" + info + "%' AND " +
            "TrangThai = 1";
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
}