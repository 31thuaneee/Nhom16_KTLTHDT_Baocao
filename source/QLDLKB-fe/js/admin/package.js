let user;
let deleteRole = false;
const avatarMain = document.getElementById("avatar-main");
const accountMain = document.getElementById("account-main");
const packageTable = document.getElementById("package-table");
const body = packageTable.getElementsByTagName("tbody")[0];
const fromDateFilter = document.getElementById("from-date-filter");
const toDateFilter = document.getElementById("to-date-filter");
const packageSearch = document.getElementById("package-search");
let packageDataRows = [];
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
            checkCreateSuccess();
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
                    if(result[i].MaQuyen === "Q4") {
                        deleteRole = true;
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
    fetch("http://localhost:3000/package",{
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
            clearAll();
            if(result !== null) {
                for(let i=0; i<result.length; i++) {
                    let row = result[i];
                    let data = body.insertRow();
                    let position = data.insertCell();
                    let packageId = data.insertCell();
                    let packageName = data.insertCell();
                    let packagePrice = data.insertCell();
                    let packageFromDate = data.insertCell();
                    let packageToDate = data.insertCell();
                    let price = new Intl.NumberFormat('vi', {
                        style: "currency",
                        currency: "VND",
                    });
                    let fromDate = result[i].TuNgay.substring(0, 10).split("-");
                    let toDate = result[i].DenNgay.substring(0, 10).split("-");
                    let fromDateInformation = fromDate[2] + "/" + fromDate[1] + "/" + fromDate[0];
                    let toDateInformation = toDate[2] + "/" + toDate[1] + "/" + toDate[0];
                    packageId.id = "id " + i.toString();
                    position.appendChild(document.createTextNode((i+1).toString()));
                    packageId.appendChild(document.createTextNode(row.MaGoi.toString()));
                    packageName.appendChild(document.createTextNode(row.TenGoi.toString()));
                    packagePrice.appendChild(document.createTextNode(price.format(row.GiaGoi)));
                    packageFromDate.appendChild(document.createTextNode(fromDateInformation));
                    packageToDate.appendChild(document.createTextNode(toDateInformation));
                    $(data).append("<td>\n" +
                    "                   <a style='cursor:pointer'>\n" +
                    "                       <span class='badge badge-warning'>\n" +
                    "                           <button style='background-color:transparent; border:none; cursor:pointer' onclick='checkModifyData(this, true)'>\n" +
                    "                              <i class='fa fa-edit' style='color:white'></i>\n" +
                    "                           </button>\n" +
                    "                       </span>\n" +
                    "                   </a>\n" +
                    "               </td>")
                    $(data).append("<td>\n" +
                    "                   <a style='cursor:pointer'>\n" +
                    "                       <span class='badge badge-danger'>\n" +
                    "                           <button style='background-color:transparent; border:none; cursor:pointer' onclick='checkModifyData(this, false)'>\n" +
                    "                              <i class='fa fa-trash-o' style='color:white'></i>\n" +
                    "                           </button>\n" +
                    "                       </span>\n" +
                    "                   </a>\n" +
                    "               </td>")
                    packageDataRows.push(data);
                }
            }else if(res.data.error !== null) {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy thông tin gói khám thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy thông tin gói khám thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function checkCreateSuccess() {
    if(window.location.hash.substring(1) === "success") {
        window.scrollTo(0, 0);
        $successNotification.find("#success-message")
            .text("Thông tin gói khám mới đã được thêm");
        $successNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $successNotification.fadeOut(1000, "linear");;
            }, 1500);
        });
    }
}

function checkDateData() {
    let fromDateAlert = document.getElementById("from-date-alert");
    let toDateAlert = document.getElementById("to-date-alert");
    if(fromDateFilter.value === "" && toDateFilter.value !== "") {
        fromDateAlert.innerHTML = "* Không được để trống"
        fromDateAlert.style.display = "block";
    }else if(toDateFilter.value === "" && fromDateFilter.value !== "") {
        toDateAlert.innerHTML = "* Không được để trống"
        toDateAlert.style.display = "block";
    }else {
        fromDateAlert.style.display = "none";
        toDateAlert.style.display = "none";
        if(toDateFilter.value === "" && fromDateFilter.value === "") {
            loadPackageData();
        }else {
            if(toDateFilter.value < fromDateFilter.value){
                toDateAlert.innerHTML = "* Đến ngày không thể nhỏ hơn từ ngày"
                toDateAlert.style.display = "block";
            }else {
                filterPackage();
            }
        }
    }
}

function filterPackage() {
    if(fromDateFilter.value !== "" && toDateFilter.value !== "") {
        fetch("http://localhost:3000/package/getFromTo",{
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },body:JSON.stringify({
                dateFrom: fromDateFilter.value,
                dateTo: toDateFilter.value
            })
        }).then(response =>
            response.json().then(data => ({
                    data: data,
                    status: response.status
                })
            ).then(res => {
                let result = res.data.data;
                clearAll();
                if(result !== null) {
                    for(let i=0; i<result.length; i++) {
                        let row = result[i];
                        let data = body.insertRow();
                        let position = data.insertCell();
                        let packageId = data.insertCell();
                        let packageName = data.insertCell();
                        let packagePrice = data.insertCell();
                        let packageFromDate = data.insertCell();
                        let packageToDate = data.insertCell();
                        let price = new Intl.NumberFormat('vi', {
                            style: "currency",
                            currency: "VND",
                        });
                        let fromDate = result[i].TuNgay.substring(0, 10).split("-");
                        let toDate = result[i].DenNgay.substring(0, 10).split("-");
                        let fromDateInformation = fromDate[2] + "/" + fromDate[1] + "/" + fromDate[0]
                        let toDateInformation = toDate[2] + "/" + toDate[1] + "/" + toDate[0];
                        packageId.id = "id " + i.toString();
                        position.appendChild(document.createTextNode((i+1).toString()));
                        packageId.appendChild(document.createTextNode(row.MaGoi.toString()));
                        packageName.appendChild(document.createTextNode(row.TenGoi.toString()));
                        packagePrice.appendChild(document.createTextNode(price.format(row.GiaGoi)));
                        packageFromDate.appendChild(document.createTextNode(fromDateInformation));
                        packageToDate.appendChild(document.createTextNode(toDateInformation));
                        $(data).append("<td>\n" +
                        "                   <a style='cursor:pointer'>\n" +
                        "                       <span class='badge badge-warning'>\n" +
                        "                           <button style='background-color:transparent; border:none; cursor:pointer' onclick='checkModifyData(this, true)'>\n" +
                        "                              <i class='fa fa-edit' style='color:white'></i>\n" +
                        "                           </button>\n" +
                        "                       </span>\n" +
                        "                   </a>\n" +
                        "               </td>")
                        $(data).append("<td>\n" +
                        "                   <a style='cursor:pointer'>\n" +
                        "                       <span class='badge badge-danger'>\n" +
                        "                           <button style='background-color:transparent; border:none; cursor:pointer' onclick='checkModifyData(this, false)'>\n" +
                        "                              <i class='fa fa-trash-o' style='color:white'></i>\n" +
                        "                           </button>\n" +
                        "                       </span>\n" +
                        "                   </a>\n" +
                        "               </td>")
                        packageDataRows.push(data);
                        packageSearch.value = "";
                    }
                }else if(res.data.error !== null) {
                    window.scrollTo(0, 0);
                    $errorNotification.find("#error-message")
                        .text("Lấy thông tin gói khám thất bại, vui lòng thử lại sau");
                    $errorNotification.fadeIn(500, "swing", function() {
                        setTimeout(function() {
                            $errorNotification.fadeOut(2000, "linear");
                        }, 2500);
                    });
                }
        })).catch(error => {
            window.scrollTo(0, 0);
            $errorNotification.find("#error-message")
                .text("Lấy thông tin gói khám thất bại, vui lòng thử lại sau");
            $errorNotification.fadeIn(500, "swing", function() {
                setTimeout(function() {
                    $errorNotification.fadeOut(2000, "linear");
                }, 2500);
            });
        });
    }else {
        loadPackageData();
    }
}

function searchPackage() {
    if(packageSearch.value !== "") {
        fetch("http://localhost:3000/package/search/" + packageSearch.value,{
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
                clearAll();
                if(result !== null) {
                    for (let i = 0; i < result.length; i++) {
                        let row = result[i];
                        let data = body.insertRow();
                        let position = data.insertCell();
                        let packageId = data.insertCell();
                        let packageName = data.insertCell();
                        let packagePrice = data.insertCell();
                        let packageFromDate = data.insertCell();
                        let packageToDate = data.insertCell();
                        let price = new Intl.NumberFormat('vi', {
                            style: "currency",
                            currency: "VND",
                        });
                        let fromDate = result[i].TuNgay.substring(0, 10).split("-");
                        let toDate = result[i].DenNgay.substring(0, 10).split("-");
                        let fromDateInformation = fromDate[2] + "/" + fromDate[1] + "/" + fromDate[0]
                        let toDateInformation = toDate[2] + "/" + toDate[1] + "/" + toDate[0];
                        packageId.id = "id " + i.toString();
                        position.appendChild(document.createTextNode((i + 1).toString()));
                        packageId.appendChild(document.createTextNode(row.MaGoi.toString()));
                        packageName.appendChild(document.createTextNode(row.TenGoi.toString()));
                        packagePrice.appendChild(document.createTextNode(price.format(row.GiaGoi)));
                        packageFromDate.appendChild(document.createTextNode(fromDateInformation));
                        packageToDate.appendChild(document.createTextNode(toDateInformation));
                        $(data).append("<td>\n" +
                        "                   <a style='cursor:pointer'>\n" +
                        "                       <span class='badge badge-warning'>\n" +
                        "                           <button style='background-color:transparent; border:none; cursor:pointer' onclick='checkModifyData(this, true)'>\n" +
                        "                              <i class='fa fa-edit' style='color:white'></i>\n" +
                        "                           </button>\n" +
                        "                       </span>\n" +
                        "                   </a>\n" +
                        "               </td>")
                        $(data).append("<td>\n" +
                        "                   <a style='cursor:pointer'>\n" +
                        "                       <span class='badge badge-danger'>\n" +
                        "                           <button style='background-color:transparent; border:none; cursor:pointer' onclick='checkModifyData(this, false)'>\n" +
                        "                              <i class='fa fa-trash-o' style='color:white'></i>\n" +
                        "                           </button>\n" +
                        "                       </span>\n" +
                        "                   </a>\n" +
                        "               </td>")
                        packageDataRows.push(data);
                    }
                }else if(res.data.error !== null) {
                    window.scrollTo(0, 0);
                    $errorNotification.find("#error-message")
                        .text("Lấy thông tin gói khám thất bại, vui lòng thử lại sau");
                    $errorNotification.fadeIn(500, "swing", function() {
                        setTimeout(function() {
                            $errorNotification.fadeOut(2000, "linear");
                        }, 2500);
                    });
                }
        })).catch(error => {
            window.scrollTo(0, 0);
            $errorNotification.find("#error-message")
                .text("Lấy thông tin gói khám thất bại, vui lòng thử lại sau");
            $errorNotification.fadeIn(500, "swing", function() {
                setTimeout(function() {
                    $errorNotification.fadeOut(2000, "linear");
                }, 2500);
            });
        });
    }else {
        loadPackageData();
    }
}

function checkModifyData(navigator, isUpdate) {
    if(!isUpdate && !deleteRole) {
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
    for(let i=0; i<packageDataRows.length; i++) {
        if(packageDataRows[i].contains(navigator)) {
            let id = document.getElementById("id " + i).innerHTML;
            fetch("http://localhost:3000/package/checkModify/" + id,{
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
                    console.log(result);
                    if(result !== null) {
                        if(result.KQ === "Y") {
                            if(isUpdate) {
                                window.location.href = "package-profile.html#x-" + id;
                            }else {
                                window.scroll(0, 0);
                                $errorNotification.find("#error-message")
                                    .text("Gói khám này đã được đặt nên không thể xóa");
                                $errorNotification.fadeIn(500, "swing", function() {
                                    setTimeout(function() {
                                        $errorNotification.fadeOut(2000, "linear");
                                    }, 2500);
                                });
                            }
                        }else if(result.KQ === "N") {
                            if(isUpdate) {
                                window.location.href = "package-profile.html#" + id;
                            }else {
                                window.scroll(0, 0);
                                let cancelConfirmationBox = document.getElementById("confirmation");
                                cancelConfirmationBox.style.display = "block";
                                document.getElementById("cancel-yes").addEventListener("click", function () {
                                    deletePackageData(id);
                                    cancelConfirmationBox.style.display = "none";
                                })
                                document.getElementById("cancel-no").addEventListener("click", function () {
                                    cancelConfirmationBox.style.display = "none";
                                })
                            }
                        }
                    }else if(res.data.error !== null) {
                        window.scroll(0, 0);
                        $errorNotification.find("#error-message")
                            .text("Kiểm tra thông tin thất bại, vui lòng thử lại sau");
                        $errorNotification.fadeIn(500, "swing", function() {
                            setTimeout(function() {
                                $errorNotification.fadeOut(2000, "linear");
                            }, 2500);
                        });
                    }
            })).catch(error => {
                window.scroll(0, 0);
                $errorNotification.find("#error-message")
                    .text("Kiểm tra thông tin thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            });
            return;
        }
    }
    checkRole("DM10", "Q2", "package-profile.html#new");
}

function deletePackageData(id) {
    fetch("http://localhost:3000/package/" + id,{
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
                window.scrollTo(0, 0);
                $successNotification.find("#success-message")
                    .text("Thông tin gói khám đã được xóa");
                $successNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $successNotification.fadeOut(500, "linear");
                        location.reload();
                    }, 1000);
                });
            }else if(res.data.status === "500") {
                window.scroll(0, 0);
                $errorNotification.find("#error-message")
                    .text("Xóa gói khám thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scroll(0, 0);
        $errorNotification.find("#error-message")
            .text("Xóa gói khám thất bại, vui lòng thử lại sau");
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

function clearAll() {
    for (let i=packageTable.rows.length-1; i>0; i--) {
        packageTable.deleteRow(i);
    }
    packageDataRows = [];
}

function logOut() {
    let user = null;
    localStorage.setItem("user", JSON.stringify(user));
    location.href = "../../html/index.html";
}