let user;
let patientId;
const appointmentSection = document.getElementById("appointment-section");
const readMore = document.getElementById("read-more");
const appointmentList = document.getElementById("appointment-list");
let appointmentListData = []
let $errorNotification = $("#error-notification");
let $successNotification = $("#success-notification");

function init() {
    user = JSON.parse(localStorage.getItem("user"));
    if(user === null) {
        location.href = "../../html/index.html";
    }else {
        if(user.account === null || user.password === null || user.role === 0) {
            location.href = "../../html/index.html";
        }else {
            loadProfileData();
        }
    }
}

function loadProfileData() {
    fetch("http://localhost:3000/patient/account/" + user.account,{
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
                patientId = result.MaKhachHang;
                loadBookData(result.MaKhachHang);
            }
            else if(res.data.error !== null) {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy thông tin đặt khám thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy thông tin đặt khám thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function loadBookData(id) {
    fetch("http://localhost:3000/book/patient/" + id,{
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
            $(appointmentList).empty();
            if(result !== null) {
                for(let i=0; i<result.length; i++) {
                    let scheduleId = "Mã lịch khám - " + result[i].MaLichKham;
                    let doctorName = "Bác sĩ " + result[i].HoTen;
                    let address = result[i].DiaChiKham.toString();
                    let dateRaw = result[i].Ngay.toString().substring(0, 10).split("-");
                    let date = dateRaw[2] + "/" + dateRaw[1] + "/" + dateRaw[0];
                    let time = result[i].Gio.toString();
                    let li = document.createElement("li");
                    li.style.marginRight = "20px";
                    $(li).append(
                    "<div class='theme-material-card' style='width:340px;'>\n" +
                    "   <div class='myappointment-text' style='display:flex'>\n" +
                    "     <i class='fa fa-id-card' style='text-align:start'></i>\n" +
                    "     <label id='schedule-id' class='paragraph-medium paragraph-black'></label>\n" +
                    "   </div>\n" +
                    "   <div class='myappointment-text' style='display:flex'>\n" +
                    "    <i class='fa fa-user-md' style='text-align:start'></i>\n" +
                    "    <span id='doctor-name' class='paragraph-medium paragraph-black'></span>\n" +
                    "  </div>\n" +
                    "  <div class='myappointment-text' style='display:flex'>\n" +
                    "    <i class='fa fa-hospital-o' style='text-align:start'></i>\n" +
                    "    &nbsp;&nbsp;&nbsp;\n" +
                    "    <label id='address' class='paragraph-medium paragraph-black'></label>\n" +
                    "  </div>\n" +
                    "  <div class='myappointment-text' style='display:flex'>\n" +
                    "    <i class='fa fa-calendar-plus-o' style='text-align:start'></i>\n" +
                    "    <label id='date' class='paragraph-medium paragraph-black'></label>\n" +
                    "  </div>\n" +
                    "  <div class='myappointment-text' style='display:flex'>\n" +
                    "    <i class='fa fa-clock-o' style='text-align:start'></i>\n" +
                    "    <label id='time' class='paragraph-medium paragraph-black'></label>\n" +
                    "  </div>\n" +
                    "  <div class='myappointment-view'>\n" +
                    "    <a class='mdl-button mdl-js-button mdl-button--colored mdl-js-ripple-effect mdl-button--raised button button-primary button-sm pull-right' onclick=openReadMore(this)>\n" +
                    "      Chi tiết\n" +
                    "    </a>\n" +
                    "  </div>\n" +
                    "</div>\n");
                    $(li).find("#schedule-id").html(scheduleId);
                    $(li).find("#doctor-name").html(doctorName);
                    $(li).find("#address").html(address);
                    $(li).find("#date").html(date);
                    $(li).find("#time").html(time);
                    appointmentList.appendChild(li);
                    appointmentListData.push(li);
                }
            }else if(res.data.error !== null) {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy thông tin đặt khám thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy thông tin đặt khám thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function openReadMore(button) {
    loadBookDetailData(getDetailId(button));
    appointmentSection.style.display = "none";
    readMore.style.display = "flex";
}

function loadBookDetailData(scheduleId) {
    fetch("http://localhost:3000/book/patient/detail",{
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
            let result = res.data.data;
            if(result !== null) {
                patientId = result.MaKhachHang;
                let dateRaw = result.Ngay.toString().substring(0, 10).split("-");
                let date = dateRaw[2] + "/" + dateRaw[1] + "/" + dateRaw[0];
                let price = new Intl.NumberFormat('vi', {
                    style: "currency",
                    currency: "VND",
                });
                document.getElementById("detail-schedule-id").innerHTML = "Mã lịch khám - " + scheduleId;
                document.getElementById("detail-doctor-name").innerHTML = result.HoTenBS;
                document.getElementById("detail-patient-name").innerHTML = result.HoTenKH;
                document.getElementById("detail-date").innerHTML = date;
                document.getElementById("detail-time").innerHTML = result.Gio;
                document.getElementById("detail-address").innerHTML = result.DiaChiKham;
                document.getElementById("detail-package").innerHTML = result.TenGoi + " - " + price.format(result.GiaGoi);
                document.getElementById("detail-disease").innerHTML = "";
                document.getElementById("detail-description").innerHTML = result.MoTa;
                if(result.TrangThai === 0) {
                    document.getElementById("detail-status").innerHTML = "Chờ xác nhận";
                }else if(result.TrangThai === 1) {
                    document.getElementById("detail-status").innerHTML = "Đã xác nhận";
                }else if(result.TrangThai === 2) {
                    document.getElementById("detail-status").innerHTML = "Đã hủy";
                    document.getElementById("detail-cancel").style.display = "none";
                }
                if(result.MaBenh !== null) {
                    loadDiseaseData(result.MaBenh);
                }else {
                    document.getElementById("detail-disease").innerHTML = "Không có";
                }
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
                document.getElementById("detail-disease").innerHTML = result.TenBenh;
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

function getDetailId(button) {
    for(let i=0; i<appointmentListData.length; i++) {
        if(appointmentListData[i].contains(button)) {
            return $(appointmentListData[i]).find("#schedule-id").text().substring(15);
        }
    }
    return null;
}

function cancelConfirmation() {
    window.scroll(0, 0);
    let cancelConfirmationBox = document.getElementById("confirmation");
    cancelConfirmationBox.style.display = "block";
    document.getElementById("cancel-yes").addEventListener("click", function () {
        setBookStatus();
        cancelConfirmationBox.style.display = "none";
    })
    document.getElementById("cancel-no").addEventListener("click", function () {
        cancelConfirmationBox.style.display = "none";
    })
}

function setBookStatus() {
    fetch("http://localhost:3000/book/setStatus",{
        method:"PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            status: 2,
            scheduleId: document.getElementById("detail-schedule-id").innerHTML.substring(15),
            patientId: patientId
        })
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            if(res.data.status === "200") {
                window.scroll(0, 0);
                readMore.style.display = "none";
                appointmentSection.style.display = "flex";
                $successNotification.find("#success-message")
                    .text("Đang cập nhật trạng thái cho lịch đặt");
                $successNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $successNotification.fadeOut(500, "linear");
                        location.reload();
                    }, 1000);
                    setScheduleStatus();
                });
            }else if(res.data.status === "500") {
                window.scroll(0, 0);
                readMore.style.display = "none";
                appointmentSection.style.display = "flex";
                $errorNotification.find("#error-message")
                    .text("Cập nhật trạng thái thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(500, "linear");
                    }, 1000);
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
}

function setScheduleStatus() {
    fetch("http://localhost:3000/schedule/setStatus",{
        method:"PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            status: false,
            scheduleId: document.getElementById("detail-schedule-id").innerHTML.substring(15)
        })
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            if(res.data.status === "500") {
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
}

function logOut() {
    let user = null;
    localStorage.setItem("user", JSON.stringify(user));
    location.href = "../../html/index.html";
}