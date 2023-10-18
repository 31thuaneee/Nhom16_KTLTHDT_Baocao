const {conn, sql} = require("../../config/databaseConnection");
const {Status} = require("../../enums/Status");
const {Message} = require("../../enums/Message");
const bcrypt = require("bcrypt");
const saltRounds = 10
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'n19dccn139@student.ptithcm.edu.vn',
        pass: 'twiceblackpink'
    }
});

const mail = {
    from: "n19dccn139@student.ptithcm.edu.vn",
    to: "",
    subject: "Hồi phục mật khẩu cho tài khoản của bạn",
    text: ""
};

module.exports = function() {
    this.getAllStaff = async function(account, result) {
        const pool = await conn;
        const query = "SELECT ACCOUNT.TaiKhoan, ACCOUNT.TrangThai FROM ACCOUNT, STAFF WHERE " +
            "ACCOUNT.TaiKhoan = STAFF.TaiKhoan AND ACCOUNT.TaiKhoan != @account";
        return await pool.request()
            .input("account", sql.VarChar, account)
            .query(query, function(err, data) {
                if(data.recordset.length > 0) {
                    result(Status.Ok, data.recordset, Message.Success, null);
                }else {
                    result(Status.Ok, null, Message.Empty, null);
                }
        });
    }

    this.getAllCustomer = async function(result) {
        const pool = await conn;
        const query = "SELECT ACCOUNT.TaiKhoan, ACCOUNT.TrangThai FROM ACCOUNT, PATIENT WHERE " +
            "ACCOUNT.TaiKhoan = PATIENT.TaiKhoan";
        return await pool.request().query(query, function(err, data) {
            if(data.recordset.length > 0) {
                result(Status.Ok, data.recordset, Message.Success, null);
            }else {
                result(Status.Ok, null, Message.Empty, null);
            }
        });
    }

    this.checkDuplicateAccount = async function(account, result) {
        const pool = await conn;
        const query = "IF EXISTS(SELECT * FROM ACCOUNT WHERE TaiKhoan = @account) SELECT 'Y' AS KQ " +
            "ELSE SELECT 'N' AS KQ";
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

    this.checkLogin = async function(body, result) {
        const pool = await conn;
        const query = "IF EXISTS(SELECT * FROM STAFF WHERE TaiKhoan = @account) SELECT MatKhau, " +
            "TrangThai, 0 AS KQ FROM ACCOUNT WHERE TaiKhoan = @account ELSE IF EXISTS " +
            "(SELECT * FROM PATIENT WHERE TaiKhoan = @account) SELECT MatKhau, TrangThai, 1 AS " +
            "KQ FROM ACCOUNT WHERE TaiKhoan = @account";
        return await pool.request()
            .input("account", sql.VarChar, body.account)
            .query(query, function(err, data) {
                if(!err) {
                    console.log(data.recordset);
                    if(data.recordset !== undefined) {
                        bcrypt.compare(body.password, data.recordset[0].MatKhau, function(err, res){
                            if(err){
                                result(Status.InternalServerError, null, Message.Error, err);
                            }else {
                                if(res) {
                                    if(data.recordset[0].TrangThai) {
                                        result(Status.Ok, data.recordset[0], Message.Success, err);
                                    }else {
                                        result(Status.Ok, null, Message.Disabled, err);
                                    }
                                }else {
                                    result(Status.Unauthorized, {
                                        category: "password"
                                    }, Message.Unauthorized, null);
                                }
                            }
                        });
                    }else {
                        result(Status.Unauthorized, {
                            category: "account"
                        }, Message.Unauthorized, null);
                    }
                    console.log(data);
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                    console.log(err);
                }
            });
    }

    this.checkAccount = async function(account, result) {
        const pool = await conn;
        const query = "IF EXISTS(SELECT * FROM ACCOUNT WHERE TaiKhoan = @account) SELECT 'Y' AS KQ" +
            " ELSE SELECT 'N' AS KQ";
        return await pool.request()
            .input("account", sql.VarChar, account)
            .query(query, function(err, data) {
                if(!err) {
                    result(Status.Ok, data.recordset[0], Message.Success, null);
                    console.log(data);
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                    console.log(err);
                }
            });
    }

    this.checkChangePassword = async function(body, result) {
        const pool = await conn;
        const query = "SELECT MatKhau FROM ACCOUNT WHERE TaiKhoan = @account";
        return await pool.request()
            .input("account", sql.VarChar, body.account)
            .query(query, function(err, data) {
                if(!err) {
                    if(data.recordset.length > 0) {
                        bcrypt.compare(body.password, data.recordset[0].MatKhau, function(err, res){
                            if(err) {
                                result(Status.InternalServerError, null, Message.Error, err);
                            }else {
                                if(res) {
                                    result(Status.Ok, res, Message.Success, null);
                                }else {
                                    result(Status.Ok, res, Message.Success, null);
                                }
                            }
                        });
                    }else {
                        result(Status.Ok, null, Message.Empty, null);
                    }
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                }
            });
    }

    this.create = async function(body, result) {
        bcrypt.hash(body.password, saltRounds).then(async hash => {
            const pool = await conn;
            const query = "INSERT INTO ACCOUNT (TaiKhoan, MatKhau, TrangThai) VALUES " +
                "(@account, @password, 1)";
            return await pool.request()
                .input("account", sql.VarChar, body.account)
                .input("password", sql.VarChar, hash)
                .query(query, function(err, data) {
                    if(!err) {
                        result(Status.Created, data, Message.Success, null);
                        console.log(data);
                    }else {
                        result(Status.InternalServerError, null, Message.Error, err);
                        console.log(err);
                    }
                });
        })
    }

    this.setStatus = async function(body, result) {
        const pool = await conn;
        const query = "UPDATE ACCOUNT SET TrangThai=@status WHERE TaiKhoan=@account";
        return await pool.request()
            .input("status", sql.Bit, body.status)
            .input("account", sql.VarChar, body.account)
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

    this.resetPassword = async function(account, result) {
        const pool = await conn;
        const query = "IF EXISTS (SELECT * FROM STAFF WHERE TaiKhoan = @account) SELECT Email FROM STAFF " +
            "WHERE TaiKhoan = @account ELSE IF EXISTS (SELECT * FROM PATIENT WHERE TaiKhoan = @account) " +
            "SELECT Email FROM PATIENT WHERE TaiKhoan = @account";
        return await pool.request()
            .input("account", sql.VarChar, account)
            .query(query, function(err, data) {
                if(data.recordset.length > 0) {
                    let rand = Math.floor(Math.random() * 1000000000);
                    let mailTo = data.recordset[0].Email;
                    bcrypt.hash(rand.toString(), saltRounds).then(async hash => {
                        const pool = await conn;
                        const query = "UPDATE ACCOUNT SET MatKhau = @password WHERE TaiKhoan = @account";
                        return await pool.request()
                            .input("account", sql.VarChar, account)
                            .input("password", sql.VarChar, hash)
                            .query(query, function (err, data) {
                                if(!err) {
                                    mail.to = mailTo;
                                    mail.text = "BookingCare xin chào ! Chúng tôi đã nhận được yêu cầu " +
                                        "được phục hồi mật khẩu của bạn. Vui lòng không chia sẻ mật khẩu đã " +
                                        "được phục hồi này cho ai khác và hãy dùng nó để đăng nhập lại vào " +
                                        "tài khoản của bạn trên hệ thống nhé. Mật khẩu mới của bạn là: " +
                                        rand;
                                    transporter.sendMail(mail, function (err, info) {
                                        if(!err) {
                                            result(Status.Ok, info, Message.Success, null);
                                            console.log(info);
                                        }else {
                                            result(Status.InternalServerError, null, Message.Error, err);
                                            console.log(err);
                                        }
                                    });
                                    console.log(data);
                                }else {
                                    result(Status.InternalServerError, null, Message.Error, err);
                                    console.log(err);
                                }
                            });
                    });
                }else {
                    result(Status.Ok, null, Message.Empty, null);
                }
        });
    }

    this.changePassword = async function(body, result) {
        bcrypt.hash(body.password, saltRounds).then(async hash => {
            const pool = await conn;
            const query = "UPDATE ACCOUNT SET MatKhau = @password WHERE TaiKhoan = @account";
            return await pool.request()
                .input("account", sql.VarChar, body.account)
                .input("password", sql.VarChar, hash)
                .query(query, function(err, data) {
                    if(!err) {
                        result(Status.Ok, data, Message.Success, null);
                        console.log(data);
                    }else {
                        result(Status.InternalServerError, null, Message.Error, err);
                        console.log(err);
                    }
                });
        })
    }

    this.searchStaff = async function(body, result) {
        const pool = await conn;
        const query = "SELECT ACCOUNT.* FROM ACCOUNT, STAFF WHERE ACCOUNT.TaiKhoan LIKE N'%" + body.info +"%' AND " +
            "ACCOUNT.TaiKhoan = STAFF.TaiKhoan AND ACCOUNT.TaiKhoan != @account";
        return await pool.request()
            .input("account", sql.VarChar, body.account)
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

    this.searchPatient = async function(info, result) {
        const pool = await conn;
        const query = "SELECT ACCOUNT.* FROM ACCOUNT, PATIENT WHERE ACCOUNT.TaiKhoan LIKE N'%" + info + "%' " +
            "AND ACCOUNT.TaiKhoan = PATIENT.TaiKhoan";
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