const address = document.getElementById("address");
const phoneNumber = document.getElementById("phone-number");
const email = document.getElementById("email");
let $errorNotification = $("#error-notification");
let $successNotification = $("#success-notification");


function init() {
    loadContact();
}

function loadContact() {
    fetch("http://localhost:3000/staff/contact",{
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
            let data = res.data.data;
            if(data != null) {
                address.innerHTML = data.DiaChi;
                phoneNumber.innerHTML = data.Sdt;
                email.innerHTML = data.Email;
            }else if(res.data.error != null) {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy thông tin liên hệ thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy thông tin liên hệ thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}