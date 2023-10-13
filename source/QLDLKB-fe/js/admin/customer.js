let user;
let updateRole = false;
const avatarMain = document.getElementById("avatar-main");
const accountMain = document.getElementById("account-main");
const customerTable = document.getElementById("customer-table");
const body = customerTable.getElementsByTagName("tbody")[0];
let customerDataRows = [];
let $errorNotification = $("#error-notification");

function init() {
    user = JSON.parse(localStorage.getItem("user"));
    if(user === null) {
        location.href = "../../html/index.html";
    }else {
        if(user.account === null || user.password === null || user.role === 1) {
            location.href = "../../html/index.html";
        }else {
            loadStaffAmount();
            loadScheduleAmount();
            loadBookAmount();
            loadPatientAmount();
            getRoleData();
            loadProfileData();
            loadCustomerData();
        }
    }
}

function loadStaffAmount() {
    fetch("http://localhost:3000/staff/amount",{
        method:"GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            const staff = document.getElementById("staff");
            let data = res.data.data.SoLuong;
            staff.innerHTML = data.toString();
    })).catch(error => console.log(error));
}

function loadScheduleAmount() {
    fetch("http://localhost:3000/schedule/amount",{
        method:"GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            const schedule = document.getElementById("schedule");
            let data = res.data.data.SoLuong;
            schedule.innerHTML = data.toString();
    })).catch(error => console.log(error));
}

function loadBookAmount() {
    fetch("http://localhost:3000/book/amount",{
        method:"GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            const book = document.getElementById("book");
            let data = res.data.data.SoLuong;
            book.innerHTML = data.toString();
    })).catch(error => console.log(error));
}

function loadPatientAmount() {
    fetch("http://localhost:3000/patient/amount",{
        method:"GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            const patient = document.getElementById("patient");
            let data = res.data.data.SoLuong;
            patient.innerHTML = data.toString();
    })).catch(error => console.log(error));
}

function getRoleData() {
    fetch("http://localhost:3000/assign/getByInterface",{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            account: user.account,
            interfaceId: "DM7"
        })
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            let result = res.data.data;
            if(result !== null) {
                for(let i=0; i<result.length; i++) {
                    if(result[i].MaQuyen === "Q3") {
                        updateRole = true;
                    }
                }
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy thông tin quyền thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function loadProfileData() {
    fetch("http://localhost:3000/staff/account/" + user.account,{
        method:"GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            let result = res.data.data;
            if(result !== null) {
                avatarMain.src = result.HinhAnh;
                accountMain.innerHTML = user.account;
            }else if(res.data.error !== null) {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy thông tin cá nhân thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy thông tin cá nhân thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function loadCustomerData() {
    fetch("http://localhost:3000/account/customer",{
        method:"GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            let result = res.data.data;
            clearAll();
            if(result !== null) {
                for(let i=0; i<result.length; i++) {
                    let row = result[i];
                    let data = body.insertRow();
                    let position = data.insertCell();
                    let account = data.insertCell();
                    let status = data.insertCell();
                    account.id = "account " + i.toString();
                    position.appendChild(document.createTextNode((i+1).toString()))
                    account.appendChild(document.createTextNode(row.TaiKhoan.toString()));
                    status.appendChild(document.createTextNode(row.TrangThai === true ? "Mở" : "Khóa"));
                    $(data).append("<td>\n" +
                    "                   <a style='cursor:pointer'>\n" +
                    "                       <span class='badge badge-complete'>\n" +
                    "                           <button style='background-color:transparent; border:none; cursor:pointer' onclick='toCustomerProfile(this)'>\n" +
                    "                               <i class='fa fa-eye' style='color:white'></i>\n" +
                    "                           </button>\n" +
                    "                       </span>\n" +
                    "                   </a>\n" +
                    "               </td>")
                    $(data).append("<td>\n" +
                    "                   <span class='badge badge-danger' style='background-color:transparent'>\n" +
                    "                       <button style='background-color:transparent; border:none; cursor:pointer' onclick='setAccountStatus(this, 1)'>\n" +
                    "                           <i class='fa fa-check' style='color:green'></i>\n" +
                    "                       </button>\n" +
                    "                       <button style='background-color:transparent; border:none; cursor:pointer' onclick='setAccountStatus(this, 0)'>\n" +
                    "                           <i class='fa fa-lock' style='color:red'></i>\n" +
                    "                       </button>\n" +
                    "                   </span>\n" +
                    "               </td>")
                    customerDataRows.push(data);
                }
            }else if(res.data.error !== null) {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy thông tin khách hàng thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy thông tin khách hàng thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function toCustomerProfile(navigator) {
    for(let i=0; i<customerDataRows.length; i++) {
        if(customerDataRows[i].contains(navigator)) {
            let account = document.getElementById("account " + i).innerHTML;
            window.location.href = "customer-profile.html" + "#" + "account/" + account;
            break;
        }
    }
}

function setAccountStatus(navigator, status) {
    if(!updateRole) {
        window.scroll(0, 0);
        $errorNotification.find("#error-message")
            .text("Bạn không có quyền sử dụng chức năng này");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
        return;
    }
    for(let i=0; i<customerDataRows.length; i++) {
        if(customerDataRows[i].contains(navigator)) {
            let account = document.getElementById("account " + i).innerHTML;
            fetch("http://localhost:3000/account/setStatus",{
                method:"PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    account: account,
                    status: status !== 0
                })
            }).then(response =>
                response.json().then(data => ({
                        data: data,
                        status: response.status
                    })
                ).then(res => {
                    if(res.data.status === "200") {
                        location.reload();
                    }else if(res.data.status === "500") {
                        window.scrollTo(0, 0);
                        $errorNotification.find("#error-message")
                            .text("Cập nhật trạng thái thất bại, vui lòng thử lại sau");
                        $errorNotification.fadeIn(500, "swing", function() {
                            setTimeout(function() {
                                $errorNotification.fadeOut(2000, "linear");
                            }, 2500);
                        });
                    }
            })).catch(error => {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Cập nhật trạng thái thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            });
            break;
        }
    }
}

function searchAccount() {
    const accountSearch = document.getElementById("account-search");
    if(accountSearch.value !== "") {
        fetch("http://localhost:3000/account/search/patient/" + accountSearch.value,{
            method:"GET",
            headers: {
                "Content-Type": "application/json"
            },
        }).then(response =>
            response.json().then(data => ({
                    data: data,
                    status: response.status
                })
            ).then(res => {
                let result = res.data.data;
                clearAll();
                if(result !== null) {
                    for(let i=0; i<result.length; i++) {
                        let row = result[i];
                        let data = body.insertRow();
                        let position = data.insertCell();
                        let account = data.insertCell();
                        let status = data.insertCell();
                        account.id = "account " + i.toString();
                        position.appendChild(document.createTextNode((i+1).toString()))
                        account.appendChild(document.createTextNode(row.TaiKhoan.toString()));
                        status.appendChild(document.createTextNode(row.TrangThai === true ? "Mở" : "Khóa"));
                        $(data).append("<td>\n" +
                        "                   <a style='cursor:pointer'>\n" +
                        "                       <span class='badge badge-complete'>\n" +
                        "                           <button style='background-color:transparent; border:none; cursor:pointer' onclick='toCustomerProfile(this)'>\n" +
                        "                               <i class='fa fa-eye' style='color:white'></i>\n" +
                        "                           </button>\n" +
                        "                       </span>\n" +
                        "                   </a>\n" +
                        "               </td>")
                        $(data).append("<td>\n" +
                        "                   <span class='badge badge-danger' style='background-color:transparent'>\n" +
                        "                       <button style='background-color:transparent; border:none; cursor:pointer' onclick='setAccountStatus(this, 1)'>\n" +
                        "                           <i class='fa fa-check' style='color:green'></i>\n" +
                        "                       </button>\n" +
                        "                       <button style='background-color:transparent; border:none; cursor:pointer' onclick='setAccountStatus(this, 0)'>\n" +
                        "                           <i class='fa fa-lock' style='color:red'></i>\n" +
                        "                       </button>\n" +
                        "                   </span>\n" +
                        "               </td>")
                        customerDataRows.push(data);
                    }
                }else if(res.data.error !== null) {
                    window.scrollTo(0, 0);
                    $errorNotification.find("#error-message")
                        .text("Lấy thông tin khách hàng thất bại, vui lòng thử lại sau");
                    $errorNotification.fadeIn(500, "swing", function() {
                        setTimeout(function() {
                            $errorNotification.fadeOut(2000, "linear");
                        }, 2500);
                    });
                }
        })).catch(error => {
            window.scrollTo(0, 0);
            $errorNotification.find("#error-message")
                .text("Lấy thông tin khách hàng thất bại, vui lòng thử lại sau");
            $errorNotification.fadeIn(500, "swing", function() {
                setTimeout(function() {
                    $errorNotification.fadeOut(2000, "linear");
                }, 2500);
            });
        });
    }else {
        loadCustomerData();
    }
}

function checkRole(interfaceId, roleId, interfacePath) {
    fetch("http://localhost:3000/assign/checkRole",{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            account: user.account,
            interfaceId: interfaceId,
            roleId: roleId
        })
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            let result = res.data.data;
            if(result !== null) {
                if(result.KQ === "Y") {
                    location.href = interfacePath;
                }else {
                    window.scroll(0, 0);
                    $errorNotification.find("#error-message")
                        .text("Bạn không có quyền truy cập");
                    $errorNotification.fadeIn(500, "swing", function() {
                        setTimeout(function() {
                            $errorNotification.fadeOut(2000, "linear");
                        }, 2500);
                    });
                }
            }else if(res.data.error !== null) {
                window.scroll(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy thông tin quyền thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scroll(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy thông tin quyền thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function clearAll() {
    for (let i=customerTable.rows.length-1; i>0; i--) {
        customerTable.deleteRow(i);
    }
    customerDataRows = [];
}

function logOut() {
    let user = null;
    localStorage.setItem("user", JSON.stringify(user));
    location.href = "../../html/index.html";
}
