const {conn, sql} = require("../../config/databaseConnection");
const {Status} = require("../../enums/Status")
const {Message} = require("../../enums/Message")

module.exports = function() {
    this.getAll = async function(result) {
        const pool = await conn;
        const query = "SELECT * FROM DEPARTMENT";
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
        const query = "SELECT * FROM DEPARTMENT WHERE TrangThai = 1";
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
        const query = "SELECT * FROM DEPARTMENT WHERE MaKhoa = @id";
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
        const query = "IF EXISTS(SELECT * FROM DEPARTMENT WHERE TenKhoa=@name AND MaKhoa = @id) " +
            "SELECT 'N' AS KQ ELSE IF EXISTS(SELECT * FROM DEPARTMENT WHERE TenKhoa=@name) SELECT 'Y'" +
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
        const query = "SELECT * FROM DEPARTMENT";
        return await pool.request().query(query, function(err, data) {
            if(!err) {
                if(data.recordset.length > 0) {
                    let idList = [];
                    let lastId;
                    for(let i=0; i<data.recordset.length; i++) {
                        idList[i] =  parseInt(data.recordset[i].MaKhoa.slice(2));
                    }
                    idList.sort(function(a, b) {
                        return a - b;
                    });
                    lastId = "KH" + String(idList[data.recordset.length-1]+1);
                    result(Status.Ok, lastId, Message.Success, null);
                }else {
                    result(Status.Ok, "KH1", Message.Empty, null);
                }
            }else {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
    }

    this.create = async function(body, result) {
        const pool = await conn;
        const query = "INSERT INTO DEPARTMENT (MaKhoa, TenKhoa, TrangThai) VALUES(@id, @name, 1)";
        return await pool.request()
            .input("id", sql.VarChar, body.id)
            .input("name", sql.NVarChar, body.name)
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
        const query = "UPDATE DEPARTMENT SET TenKhoa=@name WHERE MaKhoa=@id";
        return await pool.request()
            .input("name", sql.NVarChar, body.name)
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

    this.setStatus = async function(body, result) {
        const pool = await conn;
        const query = "UPDATE DEPARTMENT SET TrangThai=@status WHERE MaKhoa=@id";
        return await pool.request()
            .input("status", sql.Bit, body.status)
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

    this.search = async function(info, result) {
        const pool = await conn;
        const query = "SELECT * FROM DEPARTMENT WHERE TenKhoa LIKE N'%" + info + "%'";
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
        const query = "SELECT * FROM DEPARTMENT WHERE TenKhoa LIKE N'%" + info + "%' AND " +
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