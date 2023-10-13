let user;
let updateRole = false;
const avatarMain = document.getElementById("avatar-main");
const accountMain = document.getElementById("account-main");
const name = document.getElementById("name");
const price = document.getElementById("price");
const fromDate = document.getElementById("from-date");
const toDate = document.getElementById("to-date");
let packageId;
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
            loadPackageData();
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
            interfaceId: "DM10"
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

function loadPackageData() {
    if(window.location.hash.substring(1).includes("-")) {
        packageId = window.location.hash.substring(1).split("-")[1];
        price.disabled = true;
        fromDate.disabled = true;
    }else {
        packageId = window.location.hash.substring(1);
    }
    if(packageId === "new") {
        loadNewId();
        return;
    }
    fetch("http://localhost:3000/package/" + packageId,{
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
                id.value = result.MaGoi;
                name.value = result.TenGoi;
                price.value = result.GiaGoi;
                fromDate.value = result.TuNgay.substring(0, 10);
                toDate.value = result.DenNgay.substring(0, 10);
            }else if(res.data.error !== null) {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy chi tiết gói khám thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy chi tiết gói khám thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function loadNewId() {
    fetch("http://localhost:3000/package/create/newId",{
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
                id.value = result;
            }else if(res.data.error !== null) {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Tạo mã gói khám mới thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Tạo mã gói khám mới thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}


function checkAndUpdate() {
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
    clearAllNotifications();
    checkPackageData();
}

function checkPackageData() {
    if(name.value === "") {
        let alert = document.getElementById("name-alert");
        alert.innerHTML = "* Không được để trống"
        alert.style.display = "block";
        return;
    }else if(price.value === "") {
        let alert = document.getElementById("price-alert");
        alert.innerHTML = "* Không được để trống"
        alert.style.display = "block";
        return;
    }else if(!(/^\d+$/.test(price.value.trim()))) {
        let alert = document.getElementById("price-alert");
        alert.innerHTML = "* Gía gói chỉ được chứa số"
        alert.style.display = "block";
        return;
    }else if(Number(price.value) <= 0) {
        let alert = document.getElementById("price-alert");
        alert.innerHTML = "* Giá gói phải lớn hơn 0"
        alert.style.display = "block";
        return;
    }else if(!Date.parse(fromDate.value)) {
        let alert = document.getElementById("from-date-alert");
        alert.innerHTML = "* Không được để trống"
        alert.style.display = "block";
        return;
    }else if(!Date.parse(toDate.value)) {
        let alert = document.getElementById("to-date-alert");
        alert.innerHTML = "* Không được để trống"
        alert.style.display = "block";
        return;
    }else if(Date.parse(fromDate.value) < Date.parse(new Date().toISOString().slice(0, 10))) {
        let alert = document.getElementById("from-date-alert");
        alert.innerHTML = "* Ngày áp dụng không được nhỏ hơn ngày hiện tại"
        alert.style.display = "block";
        return;
    }else if(Date.parse(toDate.value) < Date.parse(new Date().toISOString().slice(0, 10))) {
        let alert = document.getElementById("to-date-alert");
        alert.innerHTML = "* Ngày hết hạn không được nhỏ hơn ngày hiện tại"
        alert.style.display = "block";
        return;
    }else if(Date.parse(toDate.value) < Date.parse(fromDate.value)) {
        let alert = document.getElementById("to-date-alert");
        alert.innerHTML = "* Ngày hết hạn không được nhỏ hơn ngày áp dụng"
        alert.style.display = "block";
        return;
    }
    if(packageId === "new") {
        createPackageData();
    }else {
        updatePackageData();
    }
}

function clearAllNotifications() {
    document.getElementById("name-alert").style.display = "none";
    document.getElementById("price-alert").style.display = "none";
    document.getElementById("from-date-alert").style.display = "none";
    document.getElementById("to-date-alert").style.display = "none";
}

function createPackageData() {
    fetch("http://localhost:3000/package",{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            id: id.value,
            name: name.value,
            price: price.value.replaceAll(".", "").replaceAll(",", ""),
            dateFrom: fromDate.value,
            dateTo: toDate.value
        })
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            if(res.data.status === "201") {
                window.location.href = "../../html/admin/package.html#success";
            }else if(res.data.status === "500") {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Thêm gói khám thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Thêm gói khám thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function updatePackageData() {
    console.log(fromDate.value);
    console.log(toDate.value);
    fetch("http://localhost:3000/package",{
        method:"PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            id: id.value,
            name: name.value,
            price: price.value.replaceAll(".", "").replaceAll(",", ""),
            dateTo: toDate.value,
            dateFrom: fromDate.value
        })
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            if(res.data.status === "200") {
                window.scrollTo(0, 0);
                $successNotification.find("#success-message")
                    .text("Thông tin gói khám đã được cập nhật");
                $successNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $successNotification.fadeOut(1000, "linear");;
                    }, 1500);
                });
            }else if(res.data.status === "500") {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Cập nhật gói khám thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Cập nhật gói khám thất bại, vui lòng thử lại sau");
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