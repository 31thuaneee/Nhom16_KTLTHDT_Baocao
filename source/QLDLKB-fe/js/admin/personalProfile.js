let user;
let updateRole = false;
const avatarMain = document.getElementById("avatar-main");
const accountMain = document.getElementById("account-main");
const avatar = document.getElementById("avatar");
const id = document.getElementById("id");
const surname = document.getElementById("surname");
const name = document.getElementById("name");
const gender = document.getElementById("gender");
const birthDate = document.getElementById("birth-date");
const identity = document.getElementById("identity");
const phoneNumber = document.getElementById("phone-number");
const email = document.getElementById("email");
const address = document.getElementById("address");
let identityCheck = true;
let phoneNumberCheck = true;
let emailCheck = true;
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
            interfaceId: "DM4"
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
                avatar.src = result.HinhAnh;
                id.value = result.MaNhanVien;
                surname.value = result.Ho;
                name.value = result.Ten;
                gender.selectedIndex = result.GioiTinh === false ? 0 : 1;
                birthDate.value = result.NgaySinh.substring(0, 10);
                identity.value = result.Cmnd;
                phoneNumber.value = result.Sdt;
                email.value = result.Email;
                address.value = result.DiaChi;
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

function openImageChooser()
{
    const input = document.createElement("input");
    input.type = "file";
    input.style.display = "none";
    input.click();
    input.addEventListener('change', (event) =>
    {
        const file = event.target.files[0];
        avatar.src = (window.URL || window.webkitURL).createObjectURL(file);
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
    setTimeout(function () {
        if(!checkProfileData()) {
            return;
        }
        updateProfileData();
    }, 1000);
    if(identity.value !== "") {
        checkDuplicateIdentity();
    }
    if(phoneNumber.value !== "") {
        checkDuplicatePhoneNumber();
    }
    if(email.value !== "") {
        checkDuplicateEmail();
    }
}

function checkDuplicateIdentity() {
    fetch("http://localhost:3000/staff/checkDuplicate/identity",{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            id: id.value,
            identity: identity.value
        })
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            if(res.data.status === "200") {
                let result = res.data.data;
                identityCheck = result.KQ === "N";
            }else if(res.data.status === "500") {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Kiểm tra thông tin thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Kiểm tra thông tin thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function checkDuplicatePhoneNumber() {
    fetch("http://localhost:3000/staff/checkDuplicate/phoneNumber",{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            id: id.value,
            phoneNumber: phoneNumber.value
        })
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            if(res.data.status === "200") {
                let result = res.data.data;
                phoneNumberCheck = result.KQ === "N";
            }else if(res.data.status === "500") {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Kiểm tra thông tin thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Kiểm tra thông tin thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function checkDuplicateEmail() {
    fetch("http://localhost:3000/staff/checkDuplicate/email",{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            id: id.value,
            email: email.value
        })
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            if(res.data.status === "200") {
                let result = res.data.data;
                emailCheck =  result.KQ === "N";
            }else if(res.data.status === "500") {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Kiểm tra thông tin thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Kiểm tra thông tin thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function checkProfileData() {
    if(surname.value === "") {
        let alert = document.getElementById("surname-alert");
        alert.innerHTML = "* Không được để trống"
        alert.style.display = "block";
        return false;
    }else if(name.value === "") {
        let alert = document.getElementById("name-alert");
        alert.innerHTML = "* Không được để trống"
        alert.style.display = "block";
        return false;
    }else if(!Date.parse(birthDate.value)) {
        let alert = document.getElementById("birth-date-alert");
        alert.innerHTML = "* Không được để trống"
        alert.style.display = "block";
        return false;
    }else if(Date.parse(birthDate.value) > Date.parse(new Date().toISOString().slice(0, 10))) {
        let alert = document.getElementById("birth-date-alert");
        alert.innerHTML = "* Ngày sinh không được lớn hơn ngày hiện tại"
        alert.style.display = "block";
        return false;
    }else if(identity.value === "") {
        let alert = document.getElementById("identity-alert");
        alert.innerHTML = "* Không được để trống"
        alert.style.display = "block";
        return false;
    }else if(identity.value.length !== 9 && identity.value.length !== 12) {
        let alert = document.getElementById("identity-alert");
        alert.innerHTML = "* Cmnd/Cccd phải có 9 hoặc 12 số"
        alert.style.display = "block";
        return false;
    }else if(!(/^\d+$/.test(identity.value.trim()))) {
        let alert = document.getElementById("identity-alert");
        alert.innerHTML = "* Cmnd/Cccd chỉ được chứa số"
        alert.style.display = "block";
        return false;
    }else if(!identityCheck) {
        let alert = document.getElementById("identity-alert");
        alert.innerHTML = "* Cmnd/Cccd này hiện đã được sử dụng"
        alert.style.display = "block";
        return false;
    }else if(phoneNumber.value === "") {
        let alert = document.getElementById("phone-number-alert");
        alert.innerHTML = "* Không được để trống"
        alert.style.display = "block";
        return false;
    }else if(phoneNumber.value.length !== 10) {
        let alert = document.getElementById("phone-number-alert");
        alert.innerHTML = "* Số điện thoại phải có 10 số"
        alert.style.display = "block";
        return false;
    }else if(!(/^\d+$/.test(phoneNumber.value.trim()))) {
        let alert = document.getElementById("phone-number-alert");
        alert.innerHTML = "* Số điện thoại chỉ được chứa số"
        alert.style.display = "block";
        return false;
    }else if(!phoneNumberCheck) {
        let alert = document.getElementById("phone-number-alert");
        alert.innerHTML = "* Số điện thoại hiện đã được sử dụng"
        alert.style.display = "block";
        return false;
    }else if(email.value === "") {
        let alert = document.getElementById("email-alert");
        alert.innerHTML = "* Không được để trống"
        alert.style.display = "block";
        return false;
    }else if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value))) {
        let alert = document.getElementById("email-alert");
        alert.innerHTML = "* Địa chỉ email không hợp lệ"
        alert.style.display = "block";
        return false;
    }else if(!emailCheck) {
        let alert = document.getElementById("email-alert");
        alert.innerHTML = "* Địa chỉ email này hiện đã được sử dụng"
        alert.style.display = "block";
        return false;
    }else if(address.value === "") {
        let alert = document.getElementById("address-alert");
        alert.style.display = "block";
        return false;
    }
    return true;
}

function clearAllNotifications() {
    document.getElementById("surname-alert").style.display = "none";
    document.getElementById("name-alert").style.display = "none";
    document.getElementById("birth-date-alert").style.display = "none";
    document.getElementById("identity-alert").style.display = "none";
    document.getElementById("phone-number-alert").style.display = "none";
    document.getElementById("email-alert").style.display = "none";
    document.getElementById("address-alert").style.display = "none";
}

function updateProfileData() {
    fetch("http://localhost:3000/staff",{
        method:"PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            avatar: avatar.src,
            id: id.value,
            surname: surname.value,
            name: name.value,
            gender: gender.selectedIndex !== 0,
            birthDate: birthDate.value,
            identity: identity.value,
            phoneNumber: phoneNumber.value,
            email: email.value,
            address: address.value
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
                    .text("Thông tin cá nhân đã được cập nhật");
                $successNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $successNotification.fadeOut(1000, "linear");;
                    }, 1500);
                });
            }else if(res.data.status === "500") {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Cập nhật thông tin cá nhân thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Cập nhật thông tin cá nhân thất bại, vui lòng thử lại sau");
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

