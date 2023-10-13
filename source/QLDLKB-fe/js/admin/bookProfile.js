let user;
const avatarMain = document.getElementById("avatar-main");
const accountMain = document.getElementById("account-main");
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
    const scheduleId = window.location.hash.substring(1).split("-")[1];
    const patientId = window.location.hash.substring(1).split("-")[0];
    fetch("http://localhost:3000/book/getOne",{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            scheduleId: scheduleId,
            patientId: patientId
        })
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            let result= res.data.data;
            if(result !== null) {
                if(result.MaBenh !== null) {
                   loadDiseaseData(result.MaBenh);
                }else {
                    document.getElementById("disease").value = "Không có";
                }
                document.getElementById("description").value = result.MoTa;
            }else if(res.data.error !== null) {
                window.scroll(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy chi tiết đặt khám thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scroll(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy chi tiết đặt khám thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function loadDiseaseData(diseaseId) {
    fetch("http://localhost:3000/disease/" + diseaseId,{
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
                document.getElementById("disease").innerHTML = result.TenBenh;
            }else if(res.data.error !== null) {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy chi tiết đặt khám thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy chi tiết đặt khám thất bại, vui lòng thử lại sau");
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

function logOut() {
    let user = null;
    localStorage.setItem("user", JSON.stringify(user));
    location.href = "../../html/index.html";
}