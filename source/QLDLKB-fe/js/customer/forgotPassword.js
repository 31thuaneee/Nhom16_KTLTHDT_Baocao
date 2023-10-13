let $errorNotification = $("#error-notification");
let $successNotification = $("#success-notification");

function checkAndUpdate() {
    document.getElementById("account-alert").style.display = "none";
    checkAccountData();
}

function checkAccountData() {
    let alert = document.getElementById("account-alert");
    if(account.value === "") {
        alert.innerHTML = "* Không được để trống";
        alert.style.display = "block";
        return;
    }
    fetch("http://localhost:3000/account/checkAccount/" + account.value,{
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
                if(res.data.data.KQ === "N") {
                    alert.innerHTML = "* Tên tài khoản không tồn tại";
                    alert.style.display = "block";
                }else {
                    resetPassword();
                }
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

function resetPassword() {
    fetch("http://localhost:3000/account/sendForgotPassword/" + account.value,{
        method:"PUT",
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
                    .text("Hãy kiểm tra mail của bạn để lấy mật khẩu mới");
                $successNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $successNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }else if(res.data.status === "500") {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Hồi phục mật khẩu thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Hồi phục mật khẩu thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}