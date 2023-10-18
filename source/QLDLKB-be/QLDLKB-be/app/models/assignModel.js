const {conn, sql} = require("../../config/databaseConnection");
const {Status} = require("../../enums/Status")
const {Message} = require("../../enums/Message")

module.exports = function() {
    this.getAllByInterface = async function(body, result) {
        const pool = await conn;
        const query = "SELECT * FROM ASSIGN WHERE TaiKhoan = @account AND MaDanhMuc=@interfaceId";
        return await pool.request()
            .input("account", sql.VarChar, body.account)
            .input("interfaceId", sql.VarChar, body.interfaceId)
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

    this.checkRole = async function(body, result) {
        const pool = await conn;
        const query = "IF EXISTS(SELECT * FROM ASSIGN WHERE TaiKhoan=@account AND " +
            "MaDanhMuc=@interfaceId AND MaQuyen=@roleId) SELECT 'Y' AS KQ " +
            "ELSE SELECT 'N' AS KQ";
        return await pool.request()
            .input("account", sql.VarChar, body.account)
            .input("interfaceId", sql.VarChar, body.interfaceId)
            .input("roleId", sql.VarChar, body.roleId)
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

    this.create = async function(body, result) {
        const pool = await conn;
        const query = "INSERT INTO ASSIGN (TaiKhoan, MaDanhMuc, MaQuyen) VALUES " +
            "(@account, @interfaceId, @roleId)";
        return await pool.request()
            .input("account", sql.VarChar, body.account)
            .input("interfaceId", sql.VarChar, body.interfaceId)
            .input("roleId", sql.VarChar, body.roleId)
            .query(query, function(err, data) {
                if(!err) {
                    result(Status.Created, data, Message.Success, null);
                }else {
                    result(Status.InternalServerError, null, Message.Error, err);
                }
            });
    }

    this.delete = async function(account, result) {
        const pool = await conn;
        const query = "DELETE FROM ASSIGN WHERE TaiKhoan = @account";
        return await pool.request().input("account", sql.VarChar, account).query(query, function(err, data) {
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