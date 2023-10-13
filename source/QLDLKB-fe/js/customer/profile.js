let user;
const id = document.getElementById("id");
const surname = document.getElementById("surname");
const name = document.getElementById("name");
const gender = document.getElementById("gender");
const birthYear = document.getElementById("birth-year");
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
        if(user.account === null || user.password === null || user.role === 0) {
            location.href = "../../html/index.html";
        }else {
            loadProfileData();
            fillBirthYear();
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
                avatar.src = result.HinhAnh;
                id.value = result.MaKhachHang;
                surname.value = result.Ho;
                name.value = result.Ten;
                gender.style.color = "#000000";
                gender.value = result.GioiTinh === false ? "0" : "1";
                birthYear.style.color = "#000000";
                birthYear.value = result.NamSinh;
                identity.value = result.Cmnd;
                phoneNumber.value = result.Sdt;
                email.value = result.Email;
                address.value = result.DiaChi;
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

function fillBirthYear() {
    const date = new Date();
    const year = date.getFullYear();
    for(let i=1930; i<=year; i++) {
        const option = document.createElement("option");
        option.value = option.innerHTML = String(i);
        option.style.color = "#000000";
        birthYear.appendChild(option);
    }
}

function openImageChooser() {
    const input = document.createElement("input");
    input.type = "file";
    input.style.display = "none";
    input.click();
    input.addEventListener('change', (event) => {
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
    fetch("http://localhost:3000/patient/checkDuplicate/identity",{
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
    fetch("http://localhost:3000/patient/checkDuplicate/phoneNumber",{
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
    fetch("http://localhost:3000/patient/checkDuplicate/email",{
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
    }else if(identity.value !== "" && identity.value.length !== 9 && identity.value.length !== 12) {
        let alert = document.getElementById("identity-alert");
        alert.innerHTML = "* Cmnd/Cccd phải có 9 hoặc 12 số"
        alert.style.display = "block";
        return false;
    }else if(identity.value !== "" && !(/^\d+$/.test(identity.value.trim()))) {
        let alert = document.getElementById("identity-alert");
        alert.innerHTML = "* Cmnd/Cccd chỉ được chứa số"
        alert.style.display = "block";
        return false;
    }else if(identity.value !== "" && !identityCheck) {
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
    }
    return true;
}

function clearAllNotifications() {
    document.getElementById("surname-alert").style.display = "none";
    document.getElementById("name-alert").style.display = "none";
    document.getElementById("phone-number-alert").style.display = "none";
    document.getElementById("email-alert").style.display = "none";
    document.getElementById("identity-alert").style.display = "none";
}

function updateProfileData() {
    fetch("http://localhost:3000/patient",{
        method:"PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            avatar: avatar.src,
            id: id.value,
            surname: surname.value,
            name: name.value,
            gender: gender.value !== "0",
            birthYear: birthYear.value,
            identity: identity.value === "" ? null : identity.value,
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

function logOut() {
    let user = null;
    localStorage.setItem("user", JSON.stringify(user));
    location.href = "../../html/index.html";
}

