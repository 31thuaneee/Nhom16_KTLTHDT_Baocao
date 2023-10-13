const account = document.getElementById("account");
const password = document.getElementById("password");
let $notification = $("#error-notification");

function init() {
    let user = JSON.parse(localStorage.getItem("user"));
    if(user === null) {
        createLoginData(null, null, null);
    }
}

function createLoginData(account, password, role) {
    let user = {
        account: account,
        password: password,
        role: role
    }
    localStorage.setItem("user", JSON.stringify(user));
}

function checkAndUpdate() {
    clearAllNotifications();
    if(!checkLoginData()) {
        return;
    }
    login();
}


function checkLoginData() {
    if(account.value === "") {
        let alert = document.getElementById("account-alert");
        alert.innerHTML = "* Không được để trống"
        alert.style.display = "block";
        return false;
    }else if(password.value === "") {
        let alert = document.getElementById("password-alert");
        alert.innerHTML = "* Không được để trống"
        alert.style.display = "block";
        return false;
    }
    return true;
}

function clearAllNotifications() {
    document.getElementById("account-alert").style.display = "none";
    document.getElementById("password-alert").style.display = "none";
}

function login() {
    fetch("http://localhost:3000/account/checkLogin",{
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
            if(res.data.status === "200") {
                let result = res.data.message;
                if(result === "Disabled") {
                    window.scrollTo(0, 0);
                    $notification.find("#message")
                        .text("Tài khoản này hiện đang bị khóa");
                    $notification.fadeIn(500, "swing", function() {
                        setTimeout(function() {
                            $notification.fadeOut(1000, "linear");
                        }, 2500);
                    });
                }else {
                    let role = res.data.data.KQ;
                    createLoginData(account.value, password.value, role);
                    location.href = role === 0 ? "admin/main.html" :"customer/book.html";
                }
            }else if(res.data.status === "401") {
                let result = res.data.data.category;
                if(result === "account") {
                    window.scrollTo(0, 0);
                    $notification.find("#message")
                        .text("Tài khoản không tồn tại");
                    $notification.fadeIn(500, "swing", function() {
                        setTimeout(function() {
                            $notification.fadeOut(1000, "linear");
                        }, 2500);
                    });
                }else if(result === "password") {
                    window.scrollTo(0, 0);
                    $notification.find("#message")
                        .text("Mật khẩu không chính xác");
                    $notification.fadeIn(500, "swing", function() {
                        setTimeout(function() {
                            $notification.fadeOut(1000, "linear");
                        }, 2500);
                    });
                }
            }else if(res.data.status === "500") {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Đăng nhập thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Đăng nhập thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}