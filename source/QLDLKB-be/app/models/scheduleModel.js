const {conn, sql} = require("../../config/databaseConnection");
const {Status} = require("../../enums/Status")
const {Message} = require("../../enums/Message")

module.exports = function() {

    this.getAll = async function(result) {
        const pool = await conn;
        const query = "SELECT SCHEDULE.*, Ho + ' ' +Ten AS HoTen FROM SCHEDULE, DOCTOR WHERE " +
            "SCHEDULE.MaBacSi = DOCTOR.MaBacSi ORDER BY Ngay";
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

    this.getAmount = async function(result) {
        const pool = await conn;
        const query = "SELECT COUNT(*) AS SoLuong FROM SCHEDULE";
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
        const query = "SELECT SCHEDULE.*, Ho + ' ' + Ten AS HoTen FROM SCHEDULE, STAFF " +
            "WHERE MaLichKham = @id AND SCHEDULE.MaNhanVien = STAFF.MaNhanVien";
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
        const query = "IF EXISTS(SELECT * FROM BOOK WHERE MaLichKham=@id) SELECT 'Y' AS KQ " +
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
        const query = "SELECT * FROM SCHEDULE";
        return await pool.request().query(query, function(err, data) {
            if(!err) {
                if(data.recordset.length > 0) {
                    let idList = [];
                    let lastId;
                    for(let i=0; i<data.recordset.length; i++) {
                        idList[i] =  parseInt(data.recordset[i].MaLichKham.slice(2));
                    }
                    idList.sort(function(a, b) {
                        return a - b;
                    });
                    lastId = "LK" + String(idList[data.recordset.length-1]+1);
                    result(Status.Ok, lastId, Message.Success, null);
                }else {
                    result(Status.Ok, "LK1", Message.Empty, null);
                }
            }else {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
    }

    this.create = async function(body, result) {
        const pool = await conn;
        const query = "INSERT INTO SCHEDULE (MaLichKham, MaBacSi, DiaChiKham, Ngay, Gio, SoLuongKham, " +
            "TrangThai, MaNhanVien) VALUES(@id, @doctorId, @address, @date, @time, @amount, 0, @staffId)";
        return await pool.request()
            .input("id", sql.VarChar, body.id)
            .input("doctorId", sql.VarChar, body.doctorId)
            .input("address", sql.NVarChar, body.address)
            .input("date", sql.Date, body.date)
            .input("time", sql.VarChar, body.time)
            .input("amount", sql.Int, body.amount)
            .input("staffId", sql.VarChar, body.staffId)
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
        const query = "UPDATE SCHEDULE SET MaBacSi=@doctorId, DiaChiKham=@address, Ngay=@date, " +
            "Gio=@time, SoLuongKham=@amount, MaNhanVien=@staffId WHERE MaLichKham=@id";
        return await pool.request()
            .input("doctorId", sql.VarChar, body.doctorId)
            .input("address", sql.NVarChar, body.address)
            .input("date", sql.Date, body.date)
            .input("time", sql.VarChar, body.time)
            .input("amount", sql.Int, body.amount)
            .input("staffId", sql.VarChar, body.staffId)
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
        const query = "UPDATE SCHEDULE SET TrangThai=@status WHERE MaLichKham=@scheduleId";
        return await pool.request()
            .input("status", sql.Bit, body.status)
            .input("scheduleId", sql.VarChar, body.scheduleId)
            .query(query, function(err, data) {
                if(!err) {
                    result(Status.Ok, data, Message.Success, null);
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                }
            });
    }

    this.delete = async function(id, result) {
        const pool = await conn;
        const query = "DELETE FROM SCHEDULE WHERE MaLichKham = @id";
        return await pool.request().input("id", sql.VarChar, id).query(query, function(err, data) {
            if(!err) {
                result(Status.Ok, data, Message.Success, null);
            }else {
                result(Status.InternalServerError, null, Message.Error, err);
            }
        });
    }

    this.filterByStaff = async function(body, result) {
        const getAllQuery = " IS NOT NULL ";
        const doctorId = body.doctorId !== null ? "='" + body.doctorId.toString() + "'": getAllQuery;
        const fromDate = body.fromDate !== null ? ">='" + body.fromDate.toString() + "'": getAllQuery;
        const toDate = body.toDate !== null ? "<='" + body.toDate.toString() + "'": getAllQuery;
        const status = body.status !== null ? "=" + body.status.toString() : getAllQuery;
        const pool = await conn;
        const query = "SELECT SCHEDULE.*, Ho + ' ' +Ten AS HoTen FROM SCHEDULE, DOCTOR WHERE " +
            "SCHEDULE.MaBacSi" + doctorId + " AND Ngay" + fromDate + " AND Ngay" + toDate +
            " AND TrangThai" + status + " AND SCHEDULE.MaBacSi = DOCTOR.MaBacSi ORDER BY Ngay";
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

    this.filterByPatient = async function(body, result) {
        const getAllQuery = " IS NOT NULL";
        const fromDate = body.fromDate !== null ? ">='" + body.fromDate.toString() + "'": getAllQuery;
        const toDate = body.toDate !== null ? "<='" + body.toDate.toString() + "'": getAllQuery;
        const departmentId = body.departmentId !== null ? "='" + body.departmentId.toString() + "'": getAllQuery;
        const pool = await conn;
        const query = "SELECT SCHEDULE.MaLichKham, Ho + ' ' + Ten AS HoTen, TenKhoa, Ngay, Gio, " +
            "DiaChiKham, ConLai = SoLuongKham - COUNT(CASE WHEN BOOK.MaLichKham = " +
            "SCHEDULE.MaLichKham AND BOOK.TrangThai != 2 then 1 END) FROM SCHEDULE, DOCTOR, " +
            "DEPARTMENT, BOOK WHERE SCHEDULE.MaBacSi = DOCTOR.MaBacSi AND " +
            "DOCTOR.MaKhoa = DEPARTMENT.MaKhoa AND Ngay" + fromDate + " AND NGAY" + toDate +
            " AND DOCTOR.MaKhoa" + departmentId + " GROUP BY SCHEDULE.MaLichKham, " +
            "Ho + ' ' + Ten, TenKhoa, Gio, DiaChiKham, SoLuongKham, Ngay ORDER BY Ngay";
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