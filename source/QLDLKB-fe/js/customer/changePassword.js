let user;
let account;
const oldPassword = document.getElementById("old-password");
const newPassword = document.getElementById("new-password");
const confirmNewPassword = document.getElementById("confirm-new-password");
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
            account = user.account;
        }
    }
}

function logOut() {
    let user = null;
    localStorage.setItem("user", JSON.stringify(user));
    location.href = "../../html/index.html";
}

function checkAndUpdate() {
    clearAllNotifications();
    checkPasswordData()
}

function checkPasswordData() {

    if(oldPassword.value === "") {
        let alert = document.getElementById("old-password-alert");
        alert.innerHTML = "* Không được để trống"
        alert.style.display = "block";
        return;
    }else if(newPassword.value === "") {
        let alert = document.getElementById("new-password-alert");
        alert.innerHTML = "* Không được để trống"
        alert.style.display = "block";
        return;
    }else if(confirmNewPassword.value === "") {
        let alert = document.getElementById("confirm-new-password-alert");
        alert.innerHTML = "* Không được để trống"
        alert.style.display = "block";
        return;
    }
    fetch("http://localhost:3000/account/checkChangePassword",{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            account: account,
            password: oldPassword.value,
        })
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            if(res.data.status === "200") {
                if(res.data.data) {
                    if(confirmNewPassword.value !== newPassword.value) {
                        window.scrollTo(0, 0);
                        $errorNotification.find("#error-message")
                            .text("Xác nhận mật khẩu mới không khớp");
                        $errorNotification.fadeIn(500, "swing", function() {
                            setTimeout(function() {
                                $errorNotification.fadeOut(2000, "linear");
                            }, 2500);
                        });
                    }else {
                        changePassword();
                    }
                }else {
                    window.scrollTo(0, 0);
                    $errorNotification.find("#error-message")
                        .text("Mật khẩu hiện tại đã nhập sai");
                    $errorNotification.fadeIn(500, "swing", function() {
                        setTimeout(function() {
                            $errorNotification.fadeOut(2000, "linear");
                        }, 2500);
                    });
                }
            }else if(res.data.status === "500") {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Kiểm tra mật khẩu thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Kiểm tra mật khẩu thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function clearAllNotifications() {
    document.getElementById("old-password-alert").style.display = "none";
    document.getElementById("new-password-alert").style.display = "none";
    document.getElementById("confirm-new-password-alert").style.display = "none";
}

function changePassword() {
    fetch("http://localhost:3000/account/changePassword",{
        method:"PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            account: account,
            password: newPassword.value
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
                    .text("Vui lòng đăng nhập lại với mật khẩu mới");
                $successNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $successNotification.fadeOut(1000, "linear");
                        logOut();
                    }, 1500);
                });
            }else if(res.data.status === "500") {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Đổi mật khẩu thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Đổi mật khẩu thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}