let user;
let updateRole = false;
const avatarMain = document.getElementById("avatar-main");
const accountMain = document.getElementById("account-main");
const bookTable = document.getElementById("book-table");
const body = bookTable.getElementsByTagName("tbody")[0];
const statusFilter = document.getElementById("status-filter");
let patientDataRows = [];
let scheduleId;
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
            loadBookData();
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
            interfaceId: "DM13"
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
                window.scroll(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy thông tin cá nhân thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scroll(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy thông tin cá nhân thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function loadBookData() {
    scheduleId = window.location.hash.substring(1);
    fetch("http://localhost:3000/book/staff",{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            scheduleId: scheduleId,
            status: Number(statusFilter.value)
        })
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
                    let patientId = data.insertCell();
                    let patientName = data.insertCell();
                    let packageName = data.insertCell();
                    patientId.id = "id " + i.toString();
                    position.appendChild(document.createTextNode((i+1).toString()));
                    patientId.appendChild(document.createTextNode(row.MaKhachHang.toString()));
                    patientName.appendChild(document.createTextNode(row.HoTen.toString()));
                    packageName.appendChild(document.createTextNode(row.TenGoi.toString()));
                    $(data).append("<td>\n" +
                    "                   <a style='cursor:pointer'>\n" +
                    "                       <span class='badge badge-complete'>\n" +
                    "                           <button style='background-color:transparent; border:none; cursor:pointer' onclick='toCustomerProfile(this)'>\n" +
                    "                               <i class='fa fa-eye' style='color:white'></i>\n" +
                    "                           </button>\n" +
                    "                       </span>\n" +
                    "                   </a>\n" +
                    "               </td>")
                    $(data).append("<td style='text-align:start'>\n" +
                    "                   <a style='cursor:pointer'>\n" +
                    "                       <span class='badge badge-complete'>\n" +
                    "                           <button style='background-color:transparent; border:none; cursor:pointer' onclick='toBookProfile(this)'>\n" +
                    "                               <i class='fa fa-eye' style='color:white'></i>\n" +
                    "                           </button>\n" +
                    "                       </span>\n" +
                    "                   </a>\n" +
                    "               </td>")
                    if(statusFilter.value === "0") {
                        $("#book-table th:last-child").show();
                        $(data).append("<td>\n" +
                        "                   <span class='badge badge-danger' style='background-color:transparent'>\n" +
                        "                       <button style='background-color:transparent; border:none; cursor:pointer' onclick='cancelConfirmation(this, 1)'>\n" +
                        "                           <i class='fa fa-check' style='color:green'></i>\n" +
                        "                       </button>\n" +
                        "                       <button style='background-color:transparent; border:none; cursor:pointer' onclick='cancelConfirmation(this, 2)'>\n" +
                        "                           <i class='fa fa-lock' style='color:red'></i>\n" +
                        "                       </button>\n" +
                        "                   </span>\n" +
                        "               </td>")
                    }else {
                        $("#book-table th:last-child").hide();
                    }
                    patientDataRows.push(data);
                }
            }else if(res.data.error !== null) {
                window.scroll(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy thông tin đặt khám thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scroll(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy thông tin đặt khám thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function toCustomerProfile(navigator) {
    for(let i=0; i<patientDataRows.length; i++) {
        if(patientDataRows[i].contains(navigator)) {
            let id = document.getElementById("id " + i).innerHTML;
            window.location.href = "customer-profile.html" + "#" + "id/" + id;
            return;
        }
    }
    window.location.href = "patient-profile.html" + "#" + "new";
}

function toBookProfile(navigator) {
    for(let i=0; i<patientDataRows.length; i++) {
        if(patientDataRows[i].contains(navigator)) {
            let id = document.getElementById("id " + i).innerHTML;
            window.location.href = "book-profile.html" + "#" + id + "-" + scheduleId;
            return;
        }
    }
}

function cancelConfirmation(navigator, status) {
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
    window.scroll(0, 0);
    let cancelConfirmationBox = document.getElementById("confirmation");
    cancelConfirmationBox.style.display = "block";
    document.getElementById("confirm-title").innerHTML = status === 1 ? "Xác nhận lịch hẹn" : "Hủy lịch hẹn";
    document.getElementById("confirm-message").innerHTML = status === 1 ? "Bạn có chắc muốn xác nhận lịch hẹn này ?" : "Bạn có chắc muốn hủy lịch hẹn này ?";
    document.getElementById("confirm").addEventListener("click", function () {
        setBookStatus(navigator, status);
        cancelConfirmationBox.style.display = "none";
    })
    document.getElementById("cancel").addEventListener("click", function () {
        cancelConfirmationBox.style.display = "none";
    })
}

function setBookStatus(navigator, status) {
    for(let i=0; i<patientDataRows.length; i++) {
        if(patientDataRows[i].contains(navigator)) {
            let id = document.getElementById("id " + i).innerHTML;
            fetch("http://localhost:3000/book/setStatus",{
                method:"PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    scheduleId: scheduleId,
                    patientId: id,
                    status: status
                })
            }).then(response =>
                response.json().then(data => ({
                        data: data,
                        status: response.status
                    })
                ).then(res => {
                    if(res.data.status === "200") {
                        if(status === 2) {
                            setScheduleStatus();
                        }
                        location.reload();
                    }else if(res.data.status === "500") {
                        window.scroll(0, 0);
                        $errorNotification.find("#error-message")
                            .text("Cập nhật trạng thái thất bại");
                        $errorNotification.fadeIn(500, "swing", function() {
                            setTimeout(function() {
                                $errorNotification.fadeOut(2000, "linear");
                            }, 2500);
                        });
                    }
            })).catch(error => {
                window.scroll(0, 0);
                $errorNotification.find("#error-message")
                    .text("Cập nhật trạng thái thất bại");
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

function setScheduleStatus() {
    fetch("http://localhost:3000/schedule/setStatus",{
        method:"PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            status: false,
            scheduleId: scheduleId
        })
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            if(res.data.status === "500") {
                window.scroll(0, 0);
                $errorNotification.find("#error-message")
                    .text("Cập nhật trạng thái thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scroll(0, 0);
        $errorNotification.find("#error-message")
            .text("Cập nhật trạng thái thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
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
    for (let i=bookTable.rows.length-1; i>0; i--) {
        bookTable.deleteRow(i);
    }
    patientDataRows = [];
}

function logOut() {
    let user = null;
    localStorage.setItem("user", JSON.stringify(user));
    location.href = "../../html/index.html";
}