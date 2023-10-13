let user;
let deleteRole = false;
const avatarMain = document.getElementById("avatar-main");
const accountMain = document.getElementById("account-main");
const doctorTable = document.getElementById("doctor-table");
const body = doctorTable.getElementsByTagName("tbody")[0];
const departmentFilter = document.getElementById("department-filter");
const doctorSearch = document.getElementById("doctor-search");
let doctorDataRows = [];
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
            fillDepartment();
            loadDoctorData();
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
            interfaceId: "DM9"
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

function loadDoctorData() {
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
            clearAll();
            if(result !== null) {
                for(let i=0; i<result.length; i++) {
                    let row = result[i];
                    let data = body.insertRow();
                    let position = data.insertCell();
                    let doctorId = data.insertCell();
                    let doctorSurname = data.insertCell();
                    let doctorName = data.insertCell();
                    let doctorGender = data.insertCell();
                    let doctorPhoneNumber = data.insertCell();
                    let doctorEmail = data.insertCell();
                    doctorId.id = "id " + i.toString();
                    position.appendChild(document.createTextNode((i+1).toString()));
                    doctorId.appendChild(document.createTextNode(row.MaBacSi.toString()));
                    doctorSurname.appendChild(document.createTextNode(row.Ho.toString()));
                    doctorName.appendChild(document.createTextNode(row.Ten.toString()));
                    doctorGender.appendChild(document.createTextNode(row.GioiTinh === false ? "Nam" : "Nữ"));
                    doctorPhoneNumber.appendChild(document.createTextNode(row.Sdt.toString()));
                    doctorEmail.appendChild(document.createTextNode(row.Email.toString()));
                    $(data).append("<td>\n" +
                    "                   <a style='cursor:pointer'>\n" +
                    "                       <span class='badge badge-warning'>\n" +
                    "                           <button style='background-color:transparent; border:none; cursor:pointer' onclick='toDoctorProfile(this)'>\n" +
                    "                              <i class='fa fa-edit' style='color:white'></i>\n" +
                    "                           </button>\n" +
                    "                       </span>\n" +
                    "                   </a>\n" +
                    "               </td>")
                    $(data).append("<td>\n" +
                    "                   <a style='cursor:pointer'>\n" +
                    "                       <span class='badge badge-danger'>\n" +
                    "                           <button style='background-color:transparent; border:none; cursor:pointer' onclick='checkDelete(this)'>\n" +
                    "                              <i class='fa fa-trash-o' style='color:white'></i>\n" +
                    "                           </button>\n" +
                    "                       </span>\n" +
                    "                   </a>\n" +
                    "               </td>")
                    doctorDataRows.push(data);
                }
            }else if(res.data.error !== null) {
                window.scroll(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy thông tin bác sĩ thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scroll(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy thông tin bác sĩ thất bại, vui lòng thử lại sau");
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
            .text("Thông tin bác sĩ mới đã được thêm");
        $successNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $successNotification.fadeOut(1000, "linear");;
            }, 1500);
        });
    }
}

function fillDepartment() {
    fetch("http://localhost:3000/department",{
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
                    let department = result[i];
                    const option = document.createElement("option");
                    option.value = department.MaKhoa;
                    option.innerHTML = department.TenKhoa;
                    option.style.color = "#000000";
                    departmentFilter.appendChild(option);
                }
            }else if(res.data.error !== null) {
                window.scroll(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy danh sách khoa thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scroll(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy danh sách khoa thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function toDoctorProfile(navigator) {
    for(let i=0; i<doctorDataRows.length; i++) {
        if(doctorDataRows[i].contains(navigator)) {
            let id = document.getElementById("id " + i).innerHTML;
            window.location.href = "doctor-profile.html#" + id;
            return;
        }
    }
    checkRole("DM9", "Q2", "doctor-profile.html#new");
}

function filterDoctor() {
    if(departmentFilter.value !== "0") {
        fetch("http://localhost:3000/doctor/departmentId/" + departmentFilter.value,{
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
                        let doctorId = data.insertCell();
                        let doctorSurname = data.insertCell();
                        let doctorName = data.insertCell();
                        let doctorGender = data.insertCell();
                        let doctorPhoneNumber = data.insertCell();
                        let doctorEmail = data.insertCell();
                        doctorId.id = "id " + i.toString();
                        position.appendChild(document.createTextNode((i+1).toString()));
                        doctorId.appendChild(document.createTextNode(row.MaBacSi.toString()));
                        doctorSurname.appendChild(document.createTextNode(row.Ho.toString()));
                        doctorName.appendChild(document.createTextNode(row.Ten.toString()));
                        doctorGender.appendChild(document.createTextNode(row.Ten !== false ? "Nam" : "Nữ"));
                        doctorPhoneNumber.appendChild(document.createTextNode(row.Sdt.toString()));
                        doctorEmail.appendChild(document.createTextNode(row.Email.toString()));
                        $(data).append("<td>\n" +
                        "                   <a style='cursor:pointer'>\n" +
                        "                       <span class='badge badge-warning'>\n" +
                        "                           <button style='background-color:transparent; border:none; cursor:pointer' onclick='toDoctorProfile(this)'>\n" +
                        "                              <i class='fa fa-edit' style='color:white'></i>\n" +
                        "                           </button>\n" +
                        "                       </span>\n" +
                        "                   </a>\n" +
                        "               </td>")
                        $(data).append("<td>\n" +
                        "                   <a style='cursor:pointer'>\n" +
                        "                       <span class='badge badge-danger'>\n" +
                        "                           <button style='background-color:transparent; border:none; cursor:pointer' onclick='checkDelete(this)'>\n" +
                        "                              <i class='fa fa-trash-o' style='color:white'></i>\n" +
                        "                           </button>\n" +
                        "                       </span>\n" +
                        "                   </a>\n" +
                        "               </td>")
                        doctorDataRows.push(data);
                    }
                }else if(res.data.error !== null) {
                    window.scroll(0, 0);
                    $errorNotification.find("#error-message")
                        .text("Lấy thông tin bác sĩ thất bại, vui lòng thử lại sau");
                    $errorNotification.fadeIn(500, "swing", function() {
                        setTimeout(function() {
                            $errorNotification.fadeOut(2000, "linear");
                        }, 2500);
                    });
                }
        })).catch(error => {
            window.scroll(0, 0);
            $errorNotification.find("#error-message")
                .text("Lấy thông tin bác sĩ thất bại, vui lòng thử lại sau");
            $errorNotification.fadeIn(500, "swing", function() {
                setTimeout(function() {
                    $errorNotification.fadeOut(2000, "linear");
                }, 2500);
            });
        });
    }else {
        loadDoctorData();
    }
    doctorSearch.value = "";
}

function searchDoctor() {
    if(doctorSearch.value !== "") {
        fetch("http://localhost:3000/doctor/search/" + doctorSearch.value,{
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
                        let doctorId = data.insertCell();
                        let doctorSurname = data.insertCell();
                        let doctorName = data.insertCell();
                        let doctorGender = data.insertCell();
                        let doctorPhoneNumber = data.insertCell();
                        let doctorEmail = data.insertCell();
                        doctorId.id = "id " + i.toString();
                        position.appendChild(document.createTextNode((i+1).toString()));
                        doctorId.appendChild(document.createTextNode(row.MaBacSi.toString()));
                        doctorSurname.appendChild(document.createTextNode(row.Ho.toString()));
                        doctorName.appendChild(document.createTextNode(row.Ten.toString()));
                        doctorGender.appendChild(document.createTextNode(row.Ten !== false ? "Nam" : "Nữ"));
                        doctorPhoneNumber.appendChild(document.createTextNode(row.Sdt.toString()));
                        doctorEmail.appendChild(document.createTextNode(row.Email.toString()));
                        $(data).append("<td>\n" +
                        "                   <a style='cursor:pointer'>\n" +
                        "                       <span class='badge badge-warning'>\n" +
                        "                           <button style='background-color:transparent; border:none; cursor:pointer' onclick='toDoctorProfile(this)'>\n" +
                        "                              <i class='fa fa-edit' style='color:white'></i>\n" +
                        "                           </button>\n" +
                        "                       </span>\n" +
                        "                   </a>\n" +
                        "               </td>")
                        $(data).append("<td>\n" +
                        "                   <a style='cursor:pointer'>\n" +
                        "                       <span class='badge badge-danger'>\n" +
                        "                           <button style='background-color:transparent; border:none; cursor:pointer' onclick='checkDelete(this)'>\n" +
                        "                              <i class='fa fa-trash-o' style='color:white'></i>\n" +
                        "                           </button>\n" +
                        "                       </span>\n" +
                        "                   </a>\n" +
                        "               </td>")
                        doctorDataRows.push(data);
                    }
                }else if(res.data.error !== null) {
                    window.scroll(0, 0);
                    $errorNotification.find("#error-message")
                        .text("Lấy thông tin bác sĩ thất bại, vui lòng thử lại sau");
                    $errorNotification.fadeIn(500, "swing", function() {
                        setTimeout(function() {
                            $errorNotification.fadeOut(2000, "linear");
                        }, 2500);
                    });
                }
        })).catch(error => {
            window.scroll(0, 0);
            $errorNotification.find("#error-message")
                .text("Lấy thông tin bác sĩ thất bại, vui lòng thử lại sau");
            $errorNotification.fadeIn(500, "swing", function() {
                setTimeout(function() {
                    $errorNotification.fadeOut(2000, "linear");
                }, 2500);
            });
        });
    }else {
        loadDoctorData();
    }
    departmentFilter.value = "-1";
}

function checkDelete(navigator) {
    if(!deleteRole) {
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
    for(let i=0; i<doctorDataRows.length; i++) {
        if(doctorDataRows[i].contains(navigator)) {
            let id = document.getElementById("id " + i).innerHTML;
            fetch("http://localhost:3000/doctor/checkDelete/" + id,{
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
                        if(result.KQ === "Y") {
                            window.scroll(0, 0);
                            $errorNotification.find("#error-message")
                                .text("Bác sĩ đã có lịch hẹn nên không thể xóa");
                            $errorNotification.fadeIn(500, "swing", function() {
                                setTimeout(function() {
                                    $errorNotification.fadeOut(2000, "linear");
                                }, 2500);
                            });
                        }else if(result.KQ === "N") {
                            window.scroll(0, 0);
                            let cancelConfirmationBox = document.getElementById("confirmation");
                            cancelConfirmationBox.style.display = "block";
                            document.getElementById("cancel-yes").addEventListener("click", function () {
                                deleteDoctorData(id);
                                cancelConfirmationBox.style.display = "none";
                            })
                            document.getElementById("cancel-no").addEventListener("click", function () {
                                cancelConfirmationBox.style.display = "none";
                            })
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
}

function deleteDoctorData(id) {
    fetch("http://localhost:3000/doctor/" + id,{
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
                    .text("Thông tin bác sĩ đã được xóa");
                $successNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $successNotification.fadeOut(500, "linear");
                        location.reload();
                    }, 1000);
                });
            }else if(res.data.status === "500") {
                window.scroll(0, 0);
                $errorNotification.find("#error-message")
                    .text("Xóa bác sĩ thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scroll(0, 0);
        $errorNotification.find("#error-message")
            .text("Xóa bác sĩ thất bại, vui lòng thử lại sau");
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
    for (let i=doctorTable.rows.length-1; i>0; i--) {
        doctorTable.deleteRow(i);
    }
    doctorDataRows = [];
}

function logOut() {
    let user = null;
    localStorage.setItem("user", JSON.stringify(user));
    location.href = "../../html/index.html";
}