let user;
let deleteRole = false;
const avatarMain = document.getElementById("avatar-main");
const accountMain = document.getElementById("account-main");
const scheduleTable = document.getElementById("schedule-table");
const body = scheduleTable.getElementsByTagName("tbody")[0];
const statusFilter = document.getElementById("status-filter");
const doctorFilter = document.getElementById("doctor-filter");
const fromDateFilter = document.getElementById("from-date-filter");
const toDateFilter = document.getElementById("to-date-filter");
 let scheduleDataRows = [];
let $errorNotification = $("#error-notification");
let $successNotification = $("#success-notification");

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
            fillDoctor();
            loadScheduleData();
            checkCreateSuccess();
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
            interfaceId: "DM12"
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
                    if(result[i].MaQuyen === "Q4") {
                        deleteRole = true;
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

function loadScheduleData() {
    fetch("http://localhost:3000/schedule",{
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
                    let scheduleId = data.insertCell();
                    let doctorName = data.insertCell();
                    let date = data.insertCell();
                    let time = data.insertCell();
                    let amount = data.insertCell();
                    let status = data.insertCell();
                    let dateRaw = row.Ngay.toString().substring(0, 10).split("-");
                    let dateInfo = dateRaw[2] + "/" + dateRaw[1] + "/" + dateRaw[0];
                    scheduleId.id = "id " + i.toString();
                    position.appendChild(document.createTextNode((i+1).toString()));
                    scheduleId.appendChild(document.createTextNode(row.MaLichKham.toString()));
                    doctorName.appendChild(document.createTextNode(row.HoTen.toString()));
                    date.appendChild(document.createTextNode(dateInfo));
                    time.appendChild(document.createTextNode(row.Gio.toString()));
                    amount.appendChild(document.createTextNode(row.SoLuongKham.toString()));
                    status.appendChild(document.createTextNode(row.TrangThai === true ? "Hết" : "Còn"));
                    $(data).append("<td>\n" +
                    "                   <a style='cursor:pointer'>\n" +
                    "                       <span class='badge badge-complete'>\n" +
                    "                           <button style='background-color:transparent; border:none; cursor:pointer' onclick='toBook(this)'>\n" +
                    "                               <i class='fa fa-eye' style='color:white'></i>\n" +
                    "                           </button>\n" +
                    "                       </span>\n" +
                    "                   </a>\n" +
                    "               </td>")
                    $(data).append("<td>\n" +
                    "                   <a style='cursor:pointer'>\n" +
                    "                       <span class='badge badge-warning'>\n" +
                    "                           <button style='background-color:transparent; border:none; cursor:pointer' onclick='checkModifyData(this, true)'>\n" +
                    "                              <i class='fa fa-edit' style='color:white'></i>\n" +
                    "                           </button>\n" +
                    "                       </span>\n" +
                    "                   </a>\n" +
                    "               </td>")
                    $(data).append("<td>\n" +
                    "                   <a style='cursor:pointer'>\n" +
                    "                       <span class='badge badge-danger'>\n" +
                    "                           <button style='background-color:transparent; border:none; cursor:pointer' onclick='checkModifyData(this, false)'>\n" +
                    "                              <i class='fa fa-trash-o' style='color:white'></i>\n" +
                    "                           </button>\n" +
                    "                       </span>\n" +
                    "                   </a>\n" +
                    "               </td>")
                    scheduleDataRows.push(data);
                }
            }else if(res.data.error !== null) {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy thông tin lịch khám thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy thông tin lịch khám thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function checkCreateSuccess() {
    if(window.location.hash.substring(1) === "success") {
        window.scrollTo(0, 0);
        $successNotification.find("#success-message")
            .text("Thông tin lịch khám mới đã được thêm");
        $successNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $successNotification.fadeOut(1000, "linear");;
            }, 1500);
        });
    }
}

function fillDoctor() {
    fetch("http://localhost:3000/doctor",{
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
                for(let i=0; i<result.length; i++) {
                    let doctor = result[i];
                    const option = document.createElement("option");
                    option.value = doctor.MaBacSi;
                    option.innerHTML = doctor.Ho + " " + doctor.Ten;
                    option.style.color = "#000000";
                    doctorFilter.appendChild(option);
                }
            }else if(res.data.error !== null) {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy danh sách bác sĩ thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy danh sách bác sĩ thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function toBook(navigator) {
    fetch("http://localhost:3000/assign/checkRole",{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            account: user.account,
            interfaceId: 'DM13',
            roleId: 'Q1'
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
                    for(let i=0; i<scheduleDataRows.length; i++) {
                        if(scheduleDataRows[i].contains(navigator)) {
                            let id = document.getElementById("id " + i).innerHTML;
                            window.location.href = "book.html#" + id;
                            return;
                        }
                    }
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

function filter() {
    fetch("http://localhost:3000/schedule/filter/staff",{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            doctorId: doctorFilter.value !== "-1" ? doctorFilter.value : null,
            fromDate: fromDateFilter.value !== "" ? fromDateFilter.value : null,
            toDate: toDateFilter.value !== "" ? toDateFilter.value : null,
            status: statusFilter.value !== "-1" ? Number(statusFilter.value) : null
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
                    let scheduleId = data.insertCell();
                    let doctorName = data.insertCell();
                    let date = data.insertCell();
                    let time = data.insertCell();
                    let amount = data.insertCell();
                    let status = data.insertCell();
                    let dateRaw = row.Ngay.toString().substring(0, 10).split("-");
                    let dateInfo = dateRaw[2] + "/" + dateRaw[1] + "/" + dateRaw[0];
                    scheduleId.id = "id " + i.toString();
                    position.appendChild(document.createTextNode((i+1).toString()));
                    scheduleId.appendChild(document.createTextNode(row.MaLichKham.toString()));
                    doctorName.appendChild(document.createTextNode(row.HoTen.toString()));
                    date.appendChild(document.createTextNode(dateInfo));
                    time.appendChild(document.createTextNode(row.Gio.toString()));
                    amount.appendChild(document.createTextNode(row.SoLuongKham.toString()));
                    status.appendChild(document.createTextNode(row.TrangThai === true ? "Hết" : "Còn"));
                    $(data).append("<td>\n" +
                    "                   <a style='cursor:pointer'>\n" +
                    "                       <span class='badge badge-complete'>\n" +
                    "                           <button style='background-color:transparent; border:none; cursor:pointer' onclick='toBook(this)'>\n" +
                    "                               <i class='fa fa-eye' style='color:white'></i>\n" +
                    "                           </button>\n" +
                    "                       </span>\n" +
                    "                   </a>\n" +
                    "               </td>")
                    $(data).append("<td>\n" +
                    "                   <a style='cursor:pointer'>\n" +
                    "                       <span class='badge badge-warning'>\n" +
                    "                           <button style='background-color:transparent; border:none; cursor:pointer' onclick='checkModifyData(this, true)'>\n" +
                    "                              <i class='fa fa-edit' style='color:white'></i>\n" +
                    "                           </button>\n" +
                    "                       </span>\n" +
                    "                   </a>\n" +
                    "               </td>")
                    $(data).append("<td>\n" +
                    "                   <a style='cursor:pointer'>\n" +
                    "                       <span class='badge badge-danger'>\n" +
                    "                           <button style='background-color:transparent; border:none; cursor:pointer' onclick='checkModifyData(this, false)'>\n" +
                    "                              <i class='fa fa-trash-o' style='color:white'></i>\n" +
                    "                           </button>\n" +
                    "                       </span>\n" +
                    "                   </a>\n" +
                    "               </td>")
                    scheduleDataRows.push(data);
                }
            }else if(res.data.error !== null) {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy thông tin lịch khám thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy thông tin lịch khám thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function checkModifyData(navigator, isUpdate) {
    if(!isUpdate && !deleteRole) {
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
    for(let i=0; i<scheduleDataRows.length; i++) {
        if(scheduleDataRows[i].contains(navigator)) {
            let id = document.getElementById("id " + i).innerHTML;
            fetch("http://localhost:3000/schedule/checkModify/" + id,{
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
                    console.log(result);
                    if(result !== null) {
                        if(result.KQ === "Y") {
                            if(isUpdate) {
                                window.location.href = "schedule-profile.html#x-" + id;
                            }else {
                                window.scroll(0, 0);
                                $errorNotification.find("#error-message")
                                    .text("Lịch khám đã được đặt nên không thể xóa");
                                $errorNotification.fadeIn(500, "swing", function() {
                                    setTimeout(function() {
                                        $errorNotification.fadeOut(2000, "linear");
                                    }, 2500);
                                });
                            }
                        }else if(result.KQ === "N") {
                            if(isUpdate) {
                                window.location.href = "schedule-profile.html#" + id;
                            }else {
                                window.scroll(0, 0);
                                let cancelConfirmationBox = document.getElementById("confirmation");
                                cancelConfirmationBox.style.display = "block";
                                document.getElementById("cancel-yes").addEventListener("click", function () {
                                    deleteScheduleData(id);
                                    cancelConfirmationBox.style.display = "none";
                                })
                                document.getElementById("cancel-no").addEventListener("click", function () {
                                    cancelConfirmationBox.style.display = "none";
                                })
                            }
                        }
                    }else if(res.data.error !== null) {
                        window.scroll(0, 0);
                        $errorNotification.find("#error-message")
                            .text("Kiểm tra thông tin thất bại, vui lòng thử lại sau");
                        $errorNotification.fadeIn(500, "swing", function() {
                            setTimeout(function() {
                                $errorNotification.fadeOut(2000, "linear");
                            }, 2500);
                        });
                    }
            })).catch(error => {
                window.scroll(0, 0);
                $errorNotification.find("#error-message")
                    .text("Kiểm tra thông tin thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            });
            return;
        }
    }
    checkRole("DM12", "Q2", "schedule-profile.html#new");
}

function deleteScheduleData(id) {
    fetch("http://localhost:3000/schedule/" + id,{
        method:"DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            if(res.data.status === "200") {
                window.scrollTo(0, 0);
                $successNotification.find("#success-message")
                    .text("Thông tin lịch khám đã được xóa");
                $successNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $successNotification.fadeOut(500, "linear");
                        location.reload();
                    }, 1000);
                });
            }else if(res.data.status === "500") {
                window.scroll(0, 0);
                $errorNotification.find("#error-message")
                    .text("Xóa lịch khám thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scroll(0, 0);
        $errorNotification.find("#error-message")
            .text("Xóa lịch khám thất bại, vui lòng thử lại sau");
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
    for (let i=scheduleTable.rows.length-1; i>0; i--) {
        scheduleTable.deleteRow(i);
    }
    scheduleDataRows = [];
}

function logOut() {
    let user = null;
    localStorage.setItem("user", JSON.stringify(user));
    location.href = "../../html/index.html";
}