let user;
const avatarMain = document.getElementById("avatar-main");
const accountMain = document.getElementById("account-main");
const avatar = document.getElementById("avatar");
const id = document.getElementById("id");
const account = document.getElementById("account");
const password = document.getElementById("password");
const surname = document.getElementById("surname");
const name = document.getElementById("name");
const gender = document.getElementById("gender");
const birthDate = document.getElementById("birth-date");
const identity = document.getElementById("identity");
const phoneNumber = document.getElementById("phone-number");
const email = document.getElementById("email");
const address = document.getElementById("address");
let accountCheck = true;
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
            loadProfileData();
            loadNewId();
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

function loadNewId() {
    fetch("http://localhost:3000/staff/create/newId",{
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
                window.scroll(0, 0);
                $errorNotification.find("#error-message")
                    .text("Tạo mã nhân viên mới thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scroll(0, 0);
        $errorNotification.find("#error-message")
            .text("Tạo mã nhân viên mới thất bại, vui lòng thử lại sau");
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
    clearAllNotifications();
    setTimeout(function () {
        if(!checkProfileData()) {
            return;
        }
        createAccount();
    }, 1000);
    if(account.value !== "") {
        checkDuplicateAccount();
    }
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

function checkDuplicateAccount() {
    fetch("http://localhost:3000/account/checkDuplicateAccount/" + account.value,{
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
            if(res.data.status === "200") {
                let result = res.data.data;
                accountCheck = result.KQ === "N";
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
                emailCheck = result.KQ === "N";
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
    if(account.value === "") {
        let alert = document.getElementById("account-alert");
        alert.innerHTML = "* Không được để trống"
        alert.style.display = "block";
        return false;
    }else if(!accountCheck) {
        let alert = document.getElementById("account-alert");
        alert.innerHTML = "* Tên tài khoản này hiện đã được sử dụng"
        alert.style.display = "block";
        return false;
    }else if(password.value === "") {
        let alert = document.getElementById("password-alert");
        alert.innerHTML = "* Không được để trống"
        alert.style.display = "block";
        return false;
    }else if(surname.value === "") {
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
    document.getElementById("account-alert").style.display = "none";
    document.getElementById("password-alert").style.display = "none";
    document.getElementById("surname-alert").style.display = "none";
    document.getElementById("name-alert").style.display = "none";
    document.getElementById("birth-date-alert").style.display = "none";
    document.getElementById("identity-alert").style.display = "none";
    document.getElementById("phone-number-alert").style.display = "none";
    document.getElementById("email-alert").style.display = "none";
    document.getElementById("address-alert").style.display = "none";
}

function createAccount() {
    fetch("http://localhost:3000/account",{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            account: account.value,
            password: password.value,
        })
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            if(res.data.status === "201") {
                createProfileData();
            }else if(res.data.status === "500") {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Thêm nhân viên thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Thêm nhân viên thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function createProfileData() {
    fetch("http://localhost:3000/staff",{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            avatar: avatar.src,
            id: id.value,
            surname: surname.value,
            name: name.value,
            gender: gender.value !== "0",
            birthDate: birthDate.value,
            identity: identity.value,
            phoneNumber: phoneNumber.value,
            email: email.value,
            address: address.value,
            account: account.value
        })
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            if(res.data.status === "201") {
                window.location.href = "../../html/admin/staff.html#success";
            }else if(res.data.status === "500") {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Thêm nhân viên thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Thêm nhân viên thất bại, vui lòng thử lại sau");
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