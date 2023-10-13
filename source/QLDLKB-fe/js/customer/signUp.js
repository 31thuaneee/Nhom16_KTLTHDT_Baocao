let id;
const account = document.getElementById("account");
const password = document.getElementById("password");
const surname = document.getElementById("surname");
const name = document.getElementById("name");
const email = document.getElementById("email");
const phoneNumber = document.getElementById("phone-number");
const gender = document.getElementById("gender");
const birthYear = document.getElementById("birth-year");
let $errorNotification = $("#error-notification");
let $successNotification = $("#success-notification");
let accountCheck = true;
let phoneNumberCheck = true;
let emailCheck = true;

function init() {
    loadNewId();
}

function changeGenderColor() {
    gender.style.color = "#000000";
}

function changeBirthYearColor() {
    birthYear.style.color = "#000000";
}

function fillBirthYear() {
    const date = new Date();
    const year = date.getFullYear();
    for (let i=1930; i<=year; i++) {
        const option = document.createElement("option");
        option.value = option.innerHTML = String(i);
        option.style.color = "#000000";
        birthYear.appendChild(option);
    }
}

function loadNewId() {
    fetch("http://localhost:3000/patient/create/newId",{
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
                id = result;
            }else if(res.data.error !== null) {
                window.scroll(0, 0);
                $errorNotification.find("#error-message")
                    .text("Tạo mã khách hàng mới thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scroll(0, 0);
        $errorNotification.find("#error-message")
            .text("Tạo mã khách hàng mới thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
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
    if(phoneNumber.value !== "") {
        checkDuplicatePhoneNumber();
    }
    if(email.value !== "") {
        checkDuplicateEmail();
    }
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
    }else if(gender.value === "-1") {
        let alert = document.getElementById("gender-alert");
        alert.innerHTML = "* Không được để trống"
        alert.style.display = "block";
        return false;
    }else if(birthYear.value === "-1") {
        let alert = document.getElementById("birth-year-alert");
        alert.innerHTML = "* Không được để trống"
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
    document.getElementById("email-alert").style.display = "none";
    document.getElementById("phone-number-alert").style.display = "none";
    document.getElementById("gender-alert").style.display = "none";
    document.getElementById("birth-year-alert").style.display = "none";
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
                window.scroll(0, 0);
                $errorNotification.find("#error-message")
                    .text("Đăng ký tài khoản thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scroll(0, 0);
        $errorNotification.find("#error-message")
            .text("Đăng ký tài khoản thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function createProfileData() {
    fetch("http://localhost:3000/patient", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id,
            surname: surname.value,
            name: name.value,
            gender: gender.value !== "0",
            birthYear: birthYear.value,
            identity: null,
            phoneNumber: phoneNumber.value,
            email: email.value,
            address: null,
            avatar: null,
            account: account.value
        })
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            if(res.data.status === "201") {
                window.scroll(0, 0);
                $successNotification.find("#success-message")
                    .text("Tài khoản đã được tạo và bạn hãy đăng nhập ngay nhé");
                $successNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $successNotification.fadeOut(1000, "linear");
                        window.location.href = "../../html/index.html";
                    }, 1500);
                });
            }else if(res.data.status === "500") {
                window.scroll(0, 0);
                $errorNotification.find("#error-message")
                    .text("Đăng ký tài khoản thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scroll(0, 0);
        $errorNotification.find("#error-message")
            .text("Đăng ký tài khoản thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}