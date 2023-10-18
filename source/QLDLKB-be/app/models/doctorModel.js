const {conn, sql} = require("../../config/databaseConnection");
const {Status} = require("../../enums/Status")
const {Message} = require("../../enums/Message")

module.exports = function() {
    this.getAll = async function(result) {
        const pool = await conn;
        const query = "SELECT * FROM DOCTOR";
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

    this.getAllForPatient = async function(result) {
        const pool = await conn;
        const query = "SELECT HinhAnh, Ho + ' ' + Ten AS HoTen, TenKhoa FROM DOCTOR, DEPARTMENT " +
            "WHERE DOCTOR.MaKhoa = DEPARTMENT.MaKhoa";
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

    this.getOneById = async function(id, result) {
        const pool = await conn;
        const query = "SELECT * FROM DOCTOR WHERE MaBacSi = @id";
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

    this.checkDuplicateIdentity = async function(body, result) {
        const pool = await conn;
        const query = "IF EXISTS(SELECT * FROM DOCTOR WHERE Cmnd=@identity AND " +
            "MaBacSi = @id) SELECT 'N' AS KQ ELSE IF EXISTS(SELECT * FROM DOCTOR WHERE " +
            "Cmnd=@identity) SELECT 'Y' AS KQ ELSE SELECT 'N' AS KQ";
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
        const query = "IF EXISTS(SELECT * FROM DOCTOR WHERE Sdt=@phoneNumber AND " +
            "MaBacSi = @id) SELECT 'N' AS KQ ELSE IF EXISTS(SELECT * FROM DOCTOR WHERE " +
            "Sdt=@phoneNumber) SELECT 'Y' AS KQ ELSE SELECT 'N' AS KQ";
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
        const query = "IF EXISTS(SELECT * FROM DOCTOR WHERE Email=@email AND MaBacSi=@id) " +
            "SELECT 'N' AS KQ ELSE IF EXISTS(SELECT * FROM DOCTOR WHERE Email=@email) " +
            "SELECT 'Y' AS KQ ELSE SELECT 'N' AS KQ";
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

    this.checkDelete = async function(id, result) {
        const pool = await conn;
        const query = "IF EXISTS(SELECT * FROM SCHEDULE WHERE MaBacSi=@id) SELECT 'Y' AS KQ " +
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
        const query = "SELECT * FROM DOCTOR";
        return await pool.request().query(query, function(err, data) {
            if(!err) {
                if(data.recordset.length > 0) {
                    let idList = [];
                    let lastId;
                    for(let i=0; i<data.recordset.length; i++) {
                        idList[i] =  parseInt(data.recordset[i].MaBacSi.slice(2));
                    }
                    idList.sort(function(a, b) {
                        return a - b;
                    });
                    lastId = "BS" + String(idList[data.recordset.length-1]+1);
                    result(Status.Ok, lastId, Message.Success, null);
                }else {
                    result(Status.Ok, "BS1", Message.Empty, null);
                }
            }else {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
    }

    this.create = async function(body, result) {
        const pool = await conn;
        const query = "INSERT INTO DOCTOR (MaBacSi, Ho, Ten, GioiTinh, NgaySinh, Cmnd, Sdt, Email, " +
            "DiaChi, QueQuan, HinhAnh, MaKhoa) VALUES(@id, @surname, @name, @gender, @birthDate, " +
            "@identity, @phoneNumber, @email, @address, @homeTown, @image, @departmentId)";
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
            .input("homeTown", sql.NVarChar, body.homeTown)
            .input("image", sql.VarChar, body.image)
            .input("departmentId", sql.VarChar, body.departmentId)
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
        const query = "UPDATE DOCTOR SET Ho=@surname, Ten=@name, GioiTinh=@gender, NgaySinh=@birthDate, " +
            "Cmnd=@identity, Sdt=@phoneNumber, Email=@Email, DiaChi=@address, QueQuan=@homeTown, " +
            "HinhAnh=@image, MaKhoa=@departmentId WHERE MaBacSi=@id";
        return await pool.request()
            .input("surname", sql.NVarChar, body.surname)
            .input("name", sql.NVarChar, body.name)
            .input("gender", sql.Bit, body.gender)
            .input("birthDate", sql.Date, body.birthDate)
            .input("identity", sql.VarChar, body.identity)
            .input("phoneNumber", sql.VarChar, body.phoneNumber)
            .input("email", sql.VarChar, body.email)
            .input("address", sql.NVarChar, body.address)
            .input("homeTown", sql.NVarChar, body.homeTown)
            .input("image", sql.VarChar, body.image)
            .input("departmentId", sql.VarChar, body.departmentId)
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

    this.delete = async function(id, result) {
        const pool = await conn;
        const query = "DELETE FROM DOCTOR WHERE MaBacSi = @id";
        return await pool.request().input("id", sql.VarChar, id).query(query, function(err, data) {
            if(!err) {
                result(Status.Ok, data, Message.Success, null);
            }else {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
    }

    this.search = async function(info, result) {
        const pool = await conn;
        const query = "SELECT * FROM DOCTOR WHERE Ho + ' ' + Ten LIKE N'%" + info + "%'";
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

    this.searchForPatient = async function(info, result) {
        const pool = await conn;
        const query = "SELECT HinhAnh, Ho + ' ' + Ten AS HoTen, TenKhoa FROM DOCTOR, DEPARTMENT " +
            "WHERE Ho + ' ' + Ten LIKE N'%" + info + "%' AND DOCTOR.MaKhoa = DEPARTMENT.MaKhoa";
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

    this.filterByDepartmentId = async function(id, result) {
        const pool = await conn;
        const query = "SELECT * FROM DOCTOR WHERE MaKhoa = @id";
        return await pool.request().input("id", sql.VarChar, id).query(query, function(err, data) {
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