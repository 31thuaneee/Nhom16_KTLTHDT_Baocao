const {conn, sql} = require("../../config/databaseConnection");
const {Status} = require("../../enums/Status")
const {Message} = require("../../enums/Message")

module.exports = function() {
    this.getByScheduleAndStatus = async function(body, result) {
        const pool = await conn;
        const query = "SELECT BOOK.MaKhachHang, Ho + ' ' + Ten AS HoTen, TenGoi FROM " +
            "BOOK, PATIENT, PACKAGE WHERE MaLichKham = @scheduleId AND TrangThai = @status AND " +
            "BOOK.MaKhachHang = PATIENT.MaKhachHang AND BOOK.MaGoi = PACKAGE.MaGoi";
        return await pool.request()
            .input("scheduleId", sql.VarChar, body.scheduleId)
            .input("status", sql.Int, body.status)
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

    this.getByPatient = async function(patientId, result) {
        const pool = await conn;
        const query = "SELECT BOOK.MaLichKham, Ho + ' ' + Ten AS HoTen, DiaChiKham, Ngay, Gio FROM " +
            "DOCTOR, SCHEDULE, BOOK WHERE BOOK.MaKhachHang = @patientId AND " +
            "BOOK.MaLichKham = SCHEDULE.MaLichKham AND SCHEDULE.MaBacSi = DOCTOR.MaBacSi " +
            "ORDER BY Ngay";
        return await pool.request()
            .input("patientId", sql.VarChar, patientId)
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

    this.getDetailByPatient = async function(body, result) {
        const pool = await conn;
        const query = "SELECT BOOK.MaKhachHang, BOOK.MaLichKham, DOCTOR.Ho + ' ' + DOCTOR.Ten AS " +
            "HoTenBS, PATIENT.Ho + ' ' + PATIENT.Ten AS HoTenKH, Ngay, Gio, DiaChiKham, TenGoi, " +
            "GiaGoi, MaBenh, BOOK.TrangThai, MoTa FROM DOCTOR, PATIENT, PACKAGE, " +
            "SCHEDULE, BOOK WHERE BOOK.MaLichKham = @scheduleId AND BOOK.MaKhachHang = @patientId " +
            "AND BOOK.MaLichKham = SCHEDULE.MaLichKham AND BOOK.MaKhachHang = PATIENT.MaKhachHang " +
            "AND SCHEDULE.MaBacSi = DOCTOR.MaBacSi AND BOOK.MaGoi = PACKAGE.MaGoi";
        return await pool.request()
            .input("scheduleId", sql.VarChar, body.scheduleId)
            .input("patientId", sql.VarChar, body.patientId)
            .query(query, function(err, data) {
                if(!err) {
                    if(data.recordset.length > 0) {
                        result(Status.Ok, data.recordset[0], Message.Success, null);
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

    this.getAmount = async function(result) {
        const pool = await conn;
        const query = "SELECT COUNT(*) AS SoLuong FROM BOOK";
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

    this.getActiveBookAmount = async function(scheduleId, result) {
        const pool = await conn;
        const query = "SELECT * FROM BOOK WHERE MaLichKham = @scheduleId AND TrangThai != 2";
        return await pool.request()
            .input("scheduleId", sql.VarChar, scheduleId)
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

    this.getOne = async function(body, result) {
        const pool = await conn;
        const query = "SELECT MaBenh, MoTa FROM BOOK WHERE " +
            "MaLichKham = @scheduleId AND MaKhachHang=@patientId";
        return await pool.request()
            .input("scheduleId", sql.VarChar, body.scheduleId)
            .input("patientId", sql.VarChar, body.patientId)
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

    this.checkDuplicateBook = async function(body, result) {
        const pool = await conn;
        const query = "IF EXISTS(SELECT * FROM BOOK WHERE MaLichKham=@scheduleId AND " +
            "MaKhachHang = @patientId) SELECT 'Y' AS KQ ELSE SELECT 'N' AS KQ";
        return await pool.request()
            .input("scheduleId", sql.VarChar, body.scheduleId)
            .input("patientId", sql.VarChar, body.patientId)
            .query(query, function(err, data) {
                if(!err) {
                    if(data.recordset.length > 0) {
                        result(Status.Ok, data.recordset[0], Message.Success, null);
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

    this.create = async function(body, result) {
        const pool = await conn;
        const query = "INSERT INTO BOOK (MaLichKham, MaKhachHang, MaGoi, MaBenh, MoTa, TrangThai) " +
            "VALUES(@scheduleId, @patientId, @packageId, @diseaseId, @description, 0)";
        return await pool.request()
            .input("scheduleId", sql.VarChar, body.scheduleId)
            .input("patientId", sql.VarChar, body.patientId)
            .input("packageId", sql.VarChar, body.packageId)
            .input("diseaseId", sql.VarChar, body.diseaseId)
            .input("description", sql.NVarChar, body.description)
            .query(query, function(err, data) {
                if(!err) {
                    result(Status.Created, data, Message.Success, null);
                    console.log(data);
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                    console.log(err);
                }
            });
    }

    this.setStatus = async function(body, result) {
        const pool = await conn;
        const query = "UPDATE BOOK SET TrangThai=@status WHERE MaLichKham=@scheduleId AND " +
            "MaKhachHang=@patientId";
        return await pool.request()
            .input("status", sql.Int, body.status)
            .input("scheduleId", sql.VarChar, body.scheduleId)
            .input("patientId", sql.VarChar, body.patientId)
            .query(query, function(err, data) {
                if(!err) {
                    result(Status.Ok, data, Message.Success, null);
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                }
            });
    }
}