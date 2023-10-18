const {conn, sql} = require("../../config/databaseConnection");
const {Status} = require("../../enums/Status")
const {Message} = require("../../enums/Message")

module.exports = function() {
    this.getAmount = async function(result) {
        const pool = await conn;
        const query = "SELECT COUNT(*) AS SoLuong FROM STAFF";
        return await pool.request().query(query, function(err, data) {
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

    this.getContact = async function(result) {
        const pool = await conn;
        const query = "SELECT TOP 1 DiaChi, Sdt, Email FROM STAFF";
        return await pool.request().query(query, function(err, data) {
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

    this.getOneById = async function(id, result) {
        const pool = await conn;
        const query = "SELECT * FROM STAFF WHERE MaNhanVien = @id";
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

    this.getOneByAccount = async function(account, result) {
        const pool = await conn;
        const query = "SELECT * FROM STAFF WHERE TaiKhoan = @account";
        return await pool.request()
            .input("account", sql.VarChar, account)
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

    this.checkDuplicateIdentity = async function(body, result) {
        const pool = await conn;
        const query = "IF EXISTS(SELECT * FROM STAFF WHERE Cmnd=@identity AND MaNhanVien = @id) SELECT " +
            "'N' AS KQ ELSE IF EXISTS(SELECT * FROM STAFF WHERE Cmnd=@identity) SELECT 'Y' AS KQ" +
            "ELSE SELECT 'N' AS KQ";
        return await pool.request()
            .input("identity", sql.VarChar, body.identity)
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

    this.checkDuplicatePhoneNumber = async function(body, result) {
        const pool = await conn;
        const query = "IF EXISTS(SELECT * FROM STAFF WHERE Sdt=@phoneNumber AND MaNhanVien = @id) " +
            "SELECT 'N' AS KQ ELSE IF EXISTS(SELECT * FROM STAFF WHERE Sdt=@phoneNumber) SELECT 'Y' AS KQ" +
            "ELSE SELECT 'N' AS KQ";
        return await pool.request()
            .input("phoneNumber", sql.VarChar, body.phoneNumber)
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

    this.checkDuplicateEmail = async function(body, result) {
        const pool = await conn;
        const query = "IF EXISTS(SELECT * FROM STAFF WHERE Email=@email AND MaNhanVien = @id) " +
            "SELECT 'N' AS KQ ELSE IF EXISTS(SELECT * FROM STAFF WHERE Email=@email) SELECT 'Y' AS KQ" +
            "ELSE SELECT 'N' AS KQ";
        return await pool.request()
            .input("email", sql.VarChar, body.email)
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
        const query = "SELECT * FROM STAFF";
        return await pool.request().query(query, function(err, data) {
            if(!err) {
                if(data.recordset.length > 0) {
                    let idList = [];
                    let lastId;
                    for(let i=0; i<data.recordset.length; i++) {
                        idList[i] =  parseInt(data.recordset[i].MaNhanVien.slice(2));
                    }
                    idList.sort(function(a, b) {
                        return a - b;
                    });
                    lastId = "NV" + String(idList[data.recordset.length-1]+1);
                    result(Status.Ok, lastId, Message.Success, null);
                }else {
                    result(Status.Ok, "NV1", Message.Empty, null);
                }
            }else {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
    }

    this.create = async function(body, result) {
        const pool = await conn;
        const query = "INSERT INTO STAFF (MaNhanVien, Ho, Ten, GioiTinh, NgaySinh, Cmnd, Sdt, Email, " +
            "DiaChi, HinhAnh, TaiKhoan) VALUES(@id, @surname, @name, @gender, @birthDate, " +
            "@identity, @phoneNumber, @email, @address, @avatar, @account)";
        return await pool.request()
            .input("id", sql.VarChar, body.id)
            .input("surname", sql.NVarChar, body.surname)
            .input("name", sql.NVarChar, body.name)
            .input("gender", sql.Bit, body.gender)
            .input("birthDate", sql.Date, body.birthDate)
            .input("identity", sql.VarChar, body.identity)
            .input("phoneNumber", sql.VarChar, body.phoneNumber)
            .input("email", sql.VarChar, body.email)
            .input("address", sql.NVarChar, body.address)
            .input("avatar", sql.VarChar, body.avatar)
            .input("account", sql.VarChar, body.account)
            .query(query, function(err, data) {
                if(!err) {
                    result(Status.Created, null, Message.Success, null);
                    console.log(data);
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                    console.log(err);
                }
            });
    }

    this.update = async function(body, result) {
        const pool = await conn;
        const query = "UPDATE STAFF SET Ho=@surname, Ten=@name, GioiTinh=@gender, NgaySinh=@birthDate, " +
            "Cmnd=@identity, Sdt=@phoneNumber, Email=@Email, DiaChi=@address, HinhAnh=@avatar " +
            "WHERE MaNhanVien=@id";
        return await pool.request()
            .input("surname", sql.NVarChar, body.surname)
            .input("name", sql.NVarChar, body.name)
            .input("gender", sql.Bit, body.gender)
            .input("birthDate", sql.Date, body.birthDate)
            .input("identity", sql.VarChar, body.identity)
            .input("phoneNumber", sql.VarChar, body.phoneNumber)
            .input("email", sql.VarChar, body.email)
            .input("address", sql.NVarChar, body.address)
            .input("avatar", sql.VarChar, body.avatar)
            .input("id", sql.VarChar, body.id)
            .query(query, function(err, data) {
                if(!err) {
                    result(Status.Ok, data, Message.Success, null);
                    console.log(data);
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                    console.log(err);
                }
            });
    }
}