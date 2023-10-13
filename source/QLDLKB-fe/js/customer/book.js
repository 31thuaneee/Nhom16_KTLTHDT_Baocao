let user;
const scheduleTable = document.getElementById("schedule-table");
const body = scheduleTable.getElementsByTagName("tbody")[0];
const fromDateFilter = document.getElementById("from-date-filter");
const toDateFilter = document.getElementById("to-date-filter");
const departmentFilter = document.getElementById("department-filter");
const appointment = document.getElementById("appointment");
const overlay = document.getElementById("overlay");
const packages = document.getElementById("packages");
const disease = document.getElementById("disease");
const description = document.getElementById("description");
let scheduleIdList = [];
let scheduleRemainList= [];
let scheduleDataRows = [];
let scheduleId;
let patientId;
let scheduleRemain;
let $errorNotification = $("#error-notification");

function init() {
    user = JSON.parse(localStorage.getItem("user"));
    if(user === null) {
        location.href = "../../html/index.html";
    }else {
        if(user.account === null || user.password === null || user.role === 0) {
            location.href = "../../html/index.html";
        }else {
            fillDate();
            fillDepartment();
            filter();
            loadProfileData();
            loadPackageData();
            loadDiseaseData();
        }
    }
}

function fillDate() {
    let today = new Date();
    for(let i=0; i<7; i++) {
        const fromDate = document.createElement("option");
        const toDate = document.createElement("option");
        let date = new Date();
        let dateRaw;
        let dateValue;
        date.setDate(today.getDate() + i);
        dateRaw = date.toLocaleDateString().slice(0, 10).split("/");
        dateValue = dateRaw[2] + "-" + dateRaw[1] + "-" + dateRaw[0];
        fromDate.value = dateValue;
        toDate.value = dateValue;
        if(i === 0) {
            fromDate.innerHTML = "Hôm nay - " + date.toLocaleDateString().slice(0, 10)
                                                                            .slice(0, -5);
            toDate.innerHTML = "Hôm nay - " + date.toLocaleDateString().slice(0, 10)
                                                                            .slice(0, -5);
        } else {
            fromDate.innerHTML = date.toLocaleDateString().slice(0, 10).slice(0, -5);
            toDate.innerHTML = date.toLocaleDateString().slice(0, 10).slice(0, -5);
        }
        fromDateFilter.appendChild(fromDate);
        toDateFilter.appendChild(toDate);
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
                    departmentFilter.appendChild(option);
                }
            }else if(res.data.error !== null) {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy danh sách khoa thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy danh sách khoa thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function filter() {
    let toDateAlert = document.getElementById("to-date-alert");
    toDateAlert.style.display = "none";
    console.log(toDateFilter.value);
    if(Date.parse(toDateFilter.value) < Date.parse(fromDateFilter.value)){
        toDateAlert.innerHTML = "* Đến ngày không thể nhỏ hơn từ ngày"
        toDateAlert.style.display = "block";
        return;
    }
    fetch("http://localhost:3000/schedule/filter/patient",{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            fromDate: fromDateFilter.value !== null ? fromDateFilter.value : null,
            toDate: toDateFilter.value !== null ? toDateFilter.value : null,
            departmentId: departmentFilter.value !== "-1" ? departmentFilter.value : null
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
                    let doctorName = data.insertCell();
                    let departmentName = data.insertCell();
                    let date = data.insertCell();
                    let time = data.insertCell();
                    let address = data.insertCell();
                    let remainSlot = data.insertCell();
                    let dateRaw = row.Ngay.substring(0, 10).split("-");
                    let dateInformation = dateRaw[2] + "/" + dateRaw[1] + "/" + dateRaw[0];
                    position.appendChild(document.createTextNode((i+1).toString()));
                    doctorName.appendChild(document.createTextNode(row.HoTen.toString()));
                    departmentName.appendChild(document.createTextNode(row.TenKhoa.toString()));
                    date.appendChild(document.createTextNode(dateInformation));
                    time.appendChild(document.createTextNode(row.Gio.toString()));
                    address.appendChild(document.createTextNode(row.DiaChiKham.toString()));
                    remainSlot.appendChild(document.createTextNode(row.ConLai));
                    $(data).append("<td>\n" +
                    "                  <button style='cursor:pointer' onclick='checkBook(this)'>\n" +
                    "                       <i class='fa fa-plus-circle'></i>\n" +
                    "                   </button>\n" +
                    "               </td>");
                    scheduleIdList.push(row.MaLichKham);
                    scheduleRemainList.push(row.ConLai);
                    scheduleDataRows.push(data);
                }
            }else if(res.data.error !== null) {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy danh sách lịch khám thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
        })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy danh sách lịch khám thất bại, vui lòng thử lại sau");
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
    scheduleIdList = [];
    scheduleRemainList = [];
    scheduleDataRows = [];
}

function checkBook(button) {
    for(let i=0; i<scheduleDataRows.length; i++) {
        if(scheduleDataRows[i].contains(button)) {
            if(scheduleRemainList[i] === 0) {
                window.scroll(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lịch khám này hiện không còn suất đặt");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
                return;
            }
            scheduleId = scheduleIdList[i];
            scheduleRemain = scheduleRemainList[i];
        }
    }
    fetch("http://localhost:3000/book/checkDuplicateBook",{
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
                if(result.KQ === "Y") {
                    window.scroll(0, 0);
                    $errorNotification.find("#error-message")
                        .text("Bạn đã đặt lịch khám này nên không thể đặt lại");
                    $errorNotification.fadeIn(500, "swing", function() {
                        setTimeout(function() {
                            $errorNotification.fadeOut(2000, "linear");
                        }, 2500);
                    });
                }else if(result.KQ === "N") {
                    showAppointmentDialog();
                }
            }else if(res.data.error !== null) {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Kiểm tra mã lịch khám thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Kiểm tra mã lịch khám thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function showAppointmentDialog() {
    overlay.style.display = "block";
    appointment.style.display = "block";
    appointment.className="modal fade show";
}

function hideAppointmentDialog() {
    clearAllNotifications();
    overlay.style.display = "none";
    appointment.style.display = "none";
    appointment.className="modal fade";
    packages.value = "-1";
    packages.style.color = "#727373";
    disease.value = "-1";
    disease.style.color = "#727373";
    description.value = "";
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
                document.getElementById("patient-name").value = "Khách hàng - " + result.Ho + " " + result.Ten;
            }else if(res.data.error !== null) {
                let alert = document.getElementById("patient-name-alert");
                alert.innerHTML = "* Tên khách hàng hiện không khả dụng"
                alert.style.display = "block";
            }
    })).catch(error => {
        let alert = document.getElementById("patient-name-alert");
        alert.innerHTML = "* Tên khách hàng hiện không khả dụng"
        alert.style.display = "block";
    });
}

function loadPackageData() {
    fetch("http://localhost:3000/package/getActive",{
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
                    const option = document.createElement("option");
                    let price = new Intl.NumberFormat('vi', {
                        style: "currency",
                        currency: "VND",
                    });
                    option.value = result[i].MaGoi;
                    option.innerHTML = "Gói " + result[i].TenGoi + " - " + price.format(result[i].GiaGoi);
                    option.style.color = "#000000";
                    packages.appendChild(option);
                }
            }else if(res.data.error !== null) {
                let alert = document.getElementById("packages-alert");
                alert.innerHTML = "* Gói khám hiện không khả dụng"
                alert.style.display = "block";
            }
            packages.value = "-1";
    })).catch(error => {
        let alert = document.getElementById("packages-alert");
        alert.innerHTML = "* Gói khám hiện không khả dụng"
        alert.style.display = "block";
    });
}

function loadDiseaseData() {
    fetch("http://localhost:3000/disease/getActive",{
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
                    const option = document.createElement("option");
                    option.value = result[i].MaBenh;
                    option.innerHTML = result[i].TenBenh;
                    option.style.color = "#000000";
                    disease.appendChild(option);
                }
            }else if(res.data.error !== null) {
                let alert = document.getElementById("disease-alert");
                alert.innerHTML = "* Nhóm bệnh hiện không khả dụng"
                alert.style.display = "block";
            }
    })).catch(error => {
        let alert = document.getElementById("disease-alert");
        alert.innerHTML = "* Nhóm bệnh hiện không khả dụng"
        alert.style.display = "block";
    });
}

function changePackageColor() {
    packages.style.color = "#000000";
}

function changeDiseaseColor() {
    disease.style.color = "#000000";
}

function checkAndUpdate() {
    clearAllNotifications();
    checkBookData();
}

function checkBookData() {
    if(packages.value === "-1") {
        let alert = document.getElementById("packages-alert");
        alert.innerHTML = "* Vui lòng chọn gói khám"
        alert.style.display = "block";
        return;
    }else if(description.value === "") {
        let alert = document.getElementById("description-alert");
        alert.innerHTML = "* Vui lòng mô tả tình trạng của bạn"
        alert.style.display = "block";
        return;
    }
    createBookData()
}

function createBookData() {
    fetch("http://localhost:3000/book",{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            scheduleId: scheduleId,
            patientId: patientId,
            packageId: packages.value,
            diseaseId: disease.value === "-1" ? null : disease.value,
            description: description.value
        })
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            if(res.data.status === "201") {
                if(scheduleRemain === 1) {
                    setScheduleStatus();
                }
                window.location.href = "../../html/customer/appointment.html";
            }else if(res.data.status === "500") {
                window.scroll(0, 0);
                appointment.style.display = "none";
                $errorNotification.find("#error-message")
                    .text("Đặt lịch khám thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(500, "linear");
                    }, 1000);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Đặt lịch khám thất bại, vui lòng thử lại sau");
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
            status: true,
            scheduleId: scheduleId
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

function clearAllNotifications() {
    document.getElementById("patient-name-alert").style.display = "none";
    document.getElementById("packages-alert").style.display = "none";
    document.getElementById("disease-alert").style.display = "none";
    document.getElementById("description-alert").style.display = "none";
}

function logOut() {
    let user = null;
    localStorage.setItem("user", JSON.stringify(user));
    location.href = "../../html/index.html";
}