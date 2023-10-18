const {conn, sql} = require("../../config/databaseConnection");
const {Status} = require("../../enums/Status")
const {Message} = require("../../enums/Message")

module.exports = function() {
    this.getAmount = async function(result) {
        const pool = await conn;
        const query = "SELECT COUNT(*) AS SoLuong FROM PATIENT";
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
        const query = "SELECT * FROM PATIENT WHERE MaKhachHang = @id";
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
        const query = "SELECT * FROM PATIENT WHERE TaiKhoan = @account";
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
        const query = "IF EXISTS(SELECT * FROM PATIENT WHERE Cmnd=@identity AND MaKhachHang = @id) SELECT " +
            "'N' AS KQ ELSE IF EXISTS(SELECT * FROM PATIENT WHERE Cmnd=@identity) SELECT 'Y' AS KQ" +
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
        const query = "IF EXISTS(SELECT * FROM PATIENT WHERE Sdt=@phoneNumber AND MaKhachHang = @id) " +
            "SELECT 'N' AS KQ ELSE IF EXISTS(SELECT * FROM PATIENT WHERE Sdt=@phoneNumber) SELECT 'Y' AS KQ" +
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
        const query = "IF EXISTS(SELECT * FROM PATIENT WHERE Email=@email AND MaKhachHang = @id) " +
            "SELECT 'N' AS KQ ELSE IF EXISTS(SELECT * FROM PATIENT WHERE Email=@email) SELECT 'Y' AS KQ" +
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
        const query = "SELECT * FROM PATIENT";
        return await pool.request().query(query, function(err, data) {
            if(!err) {
                if(data.recordset.length > 0) {
                    let idList = [];
                    let lastId;
                    for(let i=0; i<data.recordset.length; i++) {
                        idList[i] =  parseInt(data.recordset[i].MaKhachHang.slice(2));
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
        const query = "INSERT INTO PATIENT (MaKhachHang, Ho, Ten, GioiTinh, NamSinh, Cmnd, Sdt, Email, " +
            "DiaChi, HinhAnh, TaiKhoan) VALUES(@id, @surname, @name, @gender, @birthYear, " +
            "@identity, @phoneNumber, @email, @address, @image, @account)";
        return await pool.request()
            .input("id", sql.VarChar, body.id)
            .input("surname", sql.NVarChar, body.surname)
            .input("name", sql.NVarChar, body.name)
            .input("gender", sql.Bit, body.gender)
            .input("birthYear", sql.VarChar, body.birthYear)
            .input("identity", sql.VarChar, body.identity)
            .input("phoneNumber", sql.VarChar, body.phoneNumber)
            .input("email", sql.VarChar, body.email)
            .input("address", sql.NVarChar, body.address)
            .input("image", sql.VarChar, body.image)
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
        const query = "UPDATE PATIENT SET Ho=@surname, Ten=@name, GioiTinh=@gender, NamSinh=@birthYear, " +
            "Cmnd=@identity, Sdt=@phoneNumber, Email=@Email, DiaChi=@address, HinhAnh=@image " +
            "WHERE MaKhachHang=@id";
        return await pool.request()
            .input("surname", sql.NVarChar, body.surname)
            .input("name", sql.NVarChar, body.name)
            .input("gender", sql.Bit, body.gender)
            .input("birthYear", sql.VarChar, body.birthYear)
            .input("identity", sql.VarChar, body.identity)
            .input("phoneNumber", sql.VarChar, body.phoneNumber)
            .input("email", sql.VarChar, body.email)
            .input("address", sql.NVarChar, body.address)
            .input("image", sql.VarChar, body.image)
            .input("id", sql.VarChar, body.id)
            .query(query, function(err, data) {
                if(!err) {
                    result(Status.Ok, null, Message.Success, null);
                    console.log(data);
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                    console.log(err);
                }
            });
    }
}