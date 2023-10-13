let user;
let updateRole = false;
const avatarMain = document.getElementById("avatar-main");
const accountMain = document.getElementById("account-main");
const account = document.getElementById("account");
const authorization = document.getElementById("authorization");
const overlay = document.getElementById("overlay");
const interfaceList = document.querySelector('#interface-list');
const roles = interfaceList.querySelectorAll("input[type='checkbox']");
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
            getRole();
            loadProfileData();
            loadAccountData();
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
            interfaceId: "DM1"
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

function loadAccountData() {
    fetch("http://localhost:3000/account/staff/" + user.account,{
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
                    let staff = result[i];
                    const option = document.createElement("option");
                    option.value = staff.TaiKhoan;
                    option.innerHTML = staff.TaiKhoan;
                    option.style.color = "#000000";
                    account.appendChild(option);
                }
            }else if(res.data.error !== null) {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy thông tin tài khoản thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy thông tin tài khoản thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function getRole(interfaceId) {
    fetch("http://localhost:3000/assign/getByInterface",{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            account: account.value,
            interfaceId: interfaceId
        })
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            let result = res.data.data;
            if(result !== null) {
                let view;
                let create;
                let update;
                let remove;
                switch(interfaceId) {
                    case "DM1":
                        view = document.getElementById("DM1-Q1");
                        update = document.getElementById("DM1-Q3");
                        for(let i=0; i<result.length; i++) {
                            if(view.value === result[i].MaQuyen) {
                                view.checked = true;
                            }else if(update.value === result[i].MaQuyen) {
                                update.checked = true;
                            }
                        }
                        break;
                    case "DM2":
                        view = document.getElementById("DM2-Q1");
                        for(let i=0; i<result.length; i++) {
                            if(view.value === result[i].MaQuyen) {
                                view.checked = true;
                            }
                        }
                        break;
                    case "DM3":
                        view = document.getElementById("DM3-Q1");
                        for(let i=0; i<result.length; i++) {
                            if(view.value === result[i].MaQuyen) {
                                view.checked = true;
                            }
                        }
                        break;
                    case "DM4":
                        view = document.getElementById("DM4-Q1");
                        update = document.getElementById("DM4-Q3");
                        for(let i=0; i<result.length; i++) {
                            if(view.value === result[i].MaQuyen) {
                                view.checked = true;
                            }else if(update.value === result[i].MaQuyen) {
                                update.checked = true;
                            }
                        }
                        break;
                    case "DM5":
                        view = document.getElementById("DM5-Q1");
                        update = document.getElementById("DM5-Q3");
                        for(let i=0; i<result.length; i++) {
                            if(view.value === result[i].MaQuyen) {
                                view.checked = true;
                            }else if(update.value === result[i].MaQuyen) {
                                update.checked = true;
                            }
                        }
                        break;
                    case "DM6":
                        view = document.getElementById("DM6-Q1");
                        create = document.getElementById("DM6-Q2");
                        update = document.getElementById("DM6-Q3");
                        for(let i=0; i<result.length; i++) {
                            if(view.value === result[i].MaQuyen) {
                                view.checked = true;
                            }else if(create.value === result[i].MaQuyen) {
                                create.checked = true;
                            }else if(update.value === result[i].MaQuyen) {
                                update.checked = true;
                            }
                        }
                        break;
                    case "DM7":
                        view = document.getElementById("DM7-Q1");
                        update = document.getElementById("DM7-Q3");
                        for(let i=0; i<result.length; i++) {
                            if(view.value === result[i].MaQuyen) {
                                view.checked = true;
                            }else if(update.value === result[i].MaQuyen) {
                                update.checked = true;
                            }
                        }
                        break;
                    case "DM8":
                        view = document.getElementById("DM8-Q1");
                        create = document.getElementById("DM8-Q2");
                        update = document.getElementById("DM8-Q3");
                        for(let i=0; i<result.length; i++) {
                            if(view.value === result[i].MaQuyen) {
                                view.checked = true;
                            }else if(create.value === result[i].MaQuyen) {
                                create.checked = true;
                            }else if(update.value === result[i].MaQuyen) {
                                update.checked = true;
                            }
                        }
                        break;
                    case "DM9":
                        view = document.getElementById("DM9-Q1");
                        create = document.getElementById("DM9-Q2");
                        update = document.getElementById("DM9-Q3");
                        remove = document.getElementById("DM9-Q4");
                        for(let i=0; i<result.length; i++) {
                            if(view.value === result[i].MaQuyen) {
                                view.checked = true;
                            }else if(create.value === result[i].MaQuyen) {
                                create.checked = true;
                            }else if(update.value === result[i].MaQuyen) {
                                update.checked = true;
                            }else if(remove.value === result[i].MaQuyen) {
                                remove.checked = true;
                            }
                        }
                        break;
                    case "DM10":
                        view = document.getElementById("DM10-Q1");
                        create = document.getElementById("DM10-Q2");
                        update = document.getElementById("DM10-Q3");
                        remove = document.getElementById("DM10-Q4");
                        for(let i=0; i<result.length; i++) {
                            if(view.value === result[i].MaQuyen) {
                                view.checked = true;
                            }else if(create.value === result[i].MaQuyen) {
                                create.checked = true;
                            }else if(update.value === result[i].MaQuyen) {
                                update.checked = true;
                            }else if(remove.value === result[i].MaQuyen) {
                                remove.checked = true;
                            }
                        }
                        break;
                    case "DM11":
                        view = document.getElementById("DM11-Q1");
                        create = document.getElementById("DM11-Q2");
                        update = document.getElementById("DM11-Q3");
                        for(let i=0; i<result.length; i++) {
                            if(view.value === result[i].MaQuyen) {
                                view.checked = true;
                            }else if(create.value === result[i].MaQuyen) {
                                create.checked = true;
                            }else if(update.value === result[i].MaQuyen) {
                                update.checked = true;
                            }
                        }
                        break;
                    case "DM12":
                        view = document.getElementById("DM12-Q1");
                        create = document.getElementById("DM12-Q2");
                        update = document.getElementById("DM12-Q3");
                        remove = document.getElementById("DM12-Q4");
                        for(let i=0; i<result.length; i++) {
                            if(view.value === result[i].MaQuyen) {
                                view.checked = true;
                            }else if(create.value === result[i].MaQuyen) {
                                create.checked = true;
                            }else if(update.value === result[i].MaQuyen) {
                                update.checked = true;
                            }else if(remove.value === result[i].MaQuyen) {
                                remove.checked = true;
                            }
                        }
                        break;
                    case "DM13":
                        view = document.getElementById("DM13-Q1");
                        update = document.getElementById("DM13-Q3");
                        for(let i=0; i<result.length; i++) {
                            if(view.value === result[i].MaQuyen) {
                                view.checked = true;
                            }else if(update.value === result[i].MaQuyen) {
                                update.checked = true;
                            }
                        }
                        break;
                    case "DM14":
                        view = document.getElementById("DM14-Q1");
                        for(let i=0; i<result.length; i++) {
                            if(view.value === result[i].MaQuyen) {
                                view.checked = true;
                            }
                        }
                        break;
                    default:
                        break;
                }
            }else if(res.data.error !== null) {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy thông tin quyền thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
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

function showAuthorizationDialog() {
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
    overlay.style.display = "block";
    authorization.style.display = "block";
    authorization.className="modal fade show";
    getRole('DM1');
}

function hideAuthorizationDialog() {
    overlay.style.display = "none";
    authorization.style.display = "none";
    authorization.className="modal fade";
    for(let i=0; i<roles.length; i++) {
        roles[i].checked = false;
    }
}

function checkBoxClick(checkBox) {
    checkBox.value = !checkBox.checked;
}

function saveAuthorization() {
    deleteAccountRoles();
}

function deleteAccountRoles() {
    fetch("http://localhost:3000/assign/" + account.value,{
        method:"DELETE",
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
                for(let i=0; i<roles.length; i++) {
                    if(roles[i].checked) {
                        let id = roles[i].id.split("-");
                        createAccountRoles(id[0], id[1]);
                    }
                }
            }else if(res.data.status === "500") {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy thông tin quyền thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
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

function createAccountRoles(interfaceId, roleId) {
    fetch("http://localhost:3000/assign",{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            account: account.value,
            interfaceId: interfaceId,
            roleId: roleId
        })
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            if(res.data.status === "201") {
                window.scroll(0, 0);
                overlay.style.display = "none";
                authorization.style.display = "none";
                $successNotification.find("#success-message")
                    .text("Đã phân quyền cho nhân viên này");
                $successNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $successNotification.fadeOut(500, "linear");
                        location.reload();
                    }, 1000);
                });
            }else if(res.data.status === "500") {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Phân quyền thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Phân quyền thất bại, vui lòng thử lại sau");
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

(function ($) {
    $('.theme-accordion:nth-child(1) .theme-accordion-bdy').slideDown();
    $('.theme-accordion:nth-child(1) .theme-accordion-control .fa').addClass('fa-minus');
    $('body').on('click', '.theme-accordion-hdr', function () {
        var ele = $(this);
        $('.theme-accordion-bdy').slideUp();
        $('.theme-accordion-control .fa').removeClass('fa-minus');
        if (ele.parents('.theme-accordion').find('.theme-accordion-bdy').css('display') === "none") {
            ele.find('.theme-accordion-control .fa').addClass('fa-minus');
            ele.parents('.theme-accordion').find('.theme-accordion-bdy').slideDown();
        } else {
            ele.find('.theme-accordion-control .fa').removeClass('fa-minus');
            ele.parents('.theme-accordion').find('.theme-accordion-bdy').slideUp();
        }
    });
}(jQuery));
