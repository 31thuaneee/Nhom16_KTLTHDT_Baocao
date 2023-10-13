let user;
const avatarMain = document.getElementById("avatar-main");
const accountMain = document.getElementById("account-main");
const reportTitle = document.getElementById("report-title");
const staffName = document.getElementById("staff-name");
const dateNow = document.getElementById("date-now");
const monthSection = document.getElementById("month-section");
const month = document.getElementById("month");
const yearSection = document.getElementById("year-section");
const year = document.getElementById("year");
const statisticsTable = document.getElementById("statistics-table");
const head = statisticsTable.getElementsByTagName("thead")[0];
const body = statisticsTable.getElementsByTagName("tbody")[0];
const xTitle = document.getElementById("x-title");
const yTitle = document.getElementById("y-title");
let choice = 1;
let $errorNotification = $("#error-notification");

function init() {
    user = JSON.parse(localStorage.getItem("user"));
    if(user === null) {
        location.href = "../../html/index.html";
    }else {
        if(user.account === null || user.password === null || user.role === 1) {
            location.href = "../../html/index.html";
        }else {
            fillMonth();
            fillYear();
            loadProfileData();
            loadCustomerData();
            createPrintReport();
        }
    }
}

function fillMonth() {
    for(let i=1; i<=12; i++) {
        const option = document.createElement("option");
        option.value = option.innerHTML = String(i);
        option.style.color = "#000000";
        month.appendChild(option);
    }
    month.value = new Date().getMonth();
}

function fillYear() {
    const date = new Date();
    const currentYear = date.getFullYear();
    for(let i=2023; i<=currentYear; i++) {
        const option = document.createElement("option");
        option.value = option.innerHTML = String(i);
        option.style.color = "#000000";
        year.appendChild(option);
    }
    year.value = currentYear;
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
                staffName.innerHTML = result.Ho + " " + result.Ten;
                dateNow.innerHTML = new Date().toLocaleDateString().slice(0, 10);
            }else if(res.data.error !== null) {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Không thể lấy thông tin cá nhân, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Không thể lấy thông tin cá nhân, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function loadCustomerData() {
    choice = 1;
    fetch("http://localhost:3000/statistics/customer",{
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
            reportTitle.innerHTML = "DANH SÁCH TỔNG LƯỢT ĐẶT KHÁM CỦA KHÁCH HÀNG";
            $(head).append(" <tr>\n" +
            "                   <th style='text-align:center; background-color:#78a2d6; border: 1px solid #333;'>STT</th>\n" +
            "                   <th style='text-align:center; background-color:#78a2d6; border: 1px solid #333;'>Mã khách hàng</th>\n" +
            "                   <th style='text-align:center; background-color:#78a2d6; border: 1px solid #333;'>Họ</th>\n" +
            "                   <th style='text-align:center; background-color:#78a2d6; border: 1px solid #333;'>Tên</th>\n" +
            "                   <th style='text-align:center; background-color:#78a2d6; border: 1px solid #333;'>Tổng lượt đặt khám</th>\n" +
            "                </tr>");
            monthSection.style.display = "none";
            yearSection.style.display = "none";
            if(result !== null) {
                for(let i=0; i<result.length; i++) {
                    let row = result[i];
                    let data = body.insertRow();
                    let position = data.insertCell();
                    let id = data.insertCell();
                    let surname = data.insertCell();
                    let name = data.insertCell();
                    let amount = data.insertCell();
                    position.style.textAlign = "center";
                    position.appendChild(document.createTextNode((i+1).toString()));
                    id.style.textAlign = "center";
                    id.appendChild(document.createTextNode(row.MaKhachHang.toString()));
                    surname.style.textAlign = "center";
                    surname.appendChild(document.createTextNode(row.Ho.toString()));
                    name.style.textAlign = "center";
                    name.appendChild(document.createTextNode(row.Ten.toString()));
                    amount.style.textAlign = "center";
                    amount.appendChild(document.createTextNode(row.SoLuongDat.toString()));

                }
                fillChart(result, 1);
                xTitle.innerHTML = "Tổng lượt đặt khám";
                yTitle.innerHTML = "Họ và tên khách hàng";
            }else if(res.data.error !== null) {
                window.scroll(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy thông tin thống kê thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scroll(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy thông tin thống kê thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function loadDoctorData() {
    choice = 2;
    fetch("http://localhost:3000/statistics/doctor",{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            month: month.value,
            year: year.value
        })
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            let result = res.data.data;
            clearAll();
            reportTitle.innerHTML = "DỮ LIỆU BÁC SĨ ĐƯỢC KHÁCH HÀNG ĐẶT KHÁM TRONG MỘT THÁNG";
            $(head).append(" <tr>\n" +
            "                   <th style='text-align:center; background-color:#78a2d6; border: 1px solid #333;'>STT</th>\n" +
            "                   <th style='text-align:center; background-color:#78a2d6; border: 1px solid #333;'>Mã bác sĩ</th>\n" +
            "                   <th style='text-align:center; background-color:#78a2d6; border: 1px solid #333;'>Họ</th>\n" +
            "                   <th style='text-align:center; background-color:#78a2d6; border: 1px solid #333;'>Tên</th>\n" +
            "                   <th style='text-align:center; background-color:#78a2d6; border: 1px solid #333;'>Số lượng đặt khám</th>\n" +
            "                   <th style='text-align:center; background-color:#78a2d6; border: 1px solid #333;'>Số lượng xác nhận</th>\n" +
            "                   <th style='text-align:center; background-color:#78a2d6; border: 1px solid #333;'>Số lượng hủy</th>\n" +
            "                </tr>");
            monthSection.style.display = "flex";
            yearSection.style.display = "flex";
            if(result !== null) {
                for(let i=0; i<result.length; i++) {
                    let row = result[i];
                    let data = body.insertRow();
                    let position = data.insertCell();
                    let id = data.insertCell();
                    let surname = data.insertCell();
                    let name = data.insertCell();
                    let totalAmount = data.insertCell();
                    let confirmedAmount = data.insertCell();
                    let cancelledAmount = data.insertCell();
                    position.style.textAlign = "center";
                    position.appendChild(document.createTextNode((i+1).toString()));
                    id.style.textAlign = "center";
                    id.appendChild(document.createTextNode(row.MaBacSi.toString()));
                    surname.style.textAlign = "center";
                    surname.appendChild(document.createTextNode(row.Ho.toString()));
                    name.style.textAlign = "center";
                    name.appendChild(document.createTextNode(row.Ten.toString()));
                    totalAmount.style.textAlign = "center";
                    totalAmount.appendChild(document.createTextNode(row.SoLuongDat.toString()));
                    confirmedAmount.style.textAlign = "center";
                    confirmedAmount.appendChild(document.createTextNode(row.SoLuongXacNhan.toString()));
                    cancelledAmount.style.textAlign = "center";
                    cancelledAmount.appendChild(document.createTextNode(row.SoLuongHuy.toString()));
                }
                fillChart(result, 2);
                xTitle.innerHTML = "Số lượng đặt khám";
                yTitle.innerHTML = "Họ và tên bác sĩ";
            }else if(res.data.error !== null) {
                window.scroll(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy thông tin thống kê thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scroll(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy thông tin thống kê thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function loadPackageData() {
     choice = 3;
    fetch("http://localhost:3000/statistics/package",{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            month: month.value,
            year: year.value
        })
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            let result = res.data.data;
            clearAll();
            reportTitle.innerHTML = "DỮ LIỆU GÓI KHÁM ĐƯỢC KHÁCH HÀNG SỬ DỤNG TRONG MỘT THÁNG";
            $(head).append(" <tr>\n" +
            "                   <th style='text-align:center; background-color:#78a2d6; border: 1px solid #333;'>STT</th>\n" +
            "                   <th style='text-align:center; background-color:#78a2d6; border: 1px solid #333;'>Mã gói khám</th>\n" +
            "                   <th style='text-align:center; background-color:#78a2d6; border: 1px solid #333;'>Tên gói khám</th>\n" +
            "                   <th style='text-align:center; background-color:#78a2d6; border: 1px solid #333;'>Giá gói khám</th>\n" +
            "                   <th style='text-align:center; background-color:#78a2d6; border: 1px solid #333;'>Số lượng sử dụng</th>\n" +
            "                   <th style='text-align:center; background-color:#78a2d6; border: 1px solid #333;'>Tổng thành tiền</th>\n" +
            "                </tr>");
            monthSection.style.display = "flex";
            yearSection.style.display = "flex";
            if(result !== null) {
                for(let i=0; i<result.length; i++) {
                    let row = result[i];
                    let data = body.insertRow();
                    let position = data.insertCell();
                    let id = data.insertCell();
                    let name = data.insertCell();
                    let price = data.insertCell();
                    let amount = data.insertCell();
                    let totalValue= data.insertCell();
                    let priceFormat = new Intl.NumberFormat('vi', {
                        style: "currency",
                        currency: "VND",
                    });
                    position.style.textAlign = "center";
                    position.appendChild(document.createTextNode((i+1).toString()));
                    id.style.textAlign = "center";
                    id.appendChild(document.createTextNode(row.MaGoi.toString()));
                    name.style.textAlign = "center";
                    name.appendChild(document.createTextNode(row.TenGoi.toString()));
                    price.style.textAlign = "center";
                    price.appendChild(document.createTextNode(priceFormat.format(row.GiaGoi)));
                    amount.style.textAlign = "center";
                    amount.appendChild(document.createTextNode(row.SoLuongChon.toString()));
                    totalValue.style.textAlign = "center";
                    totalValue.appendChild(document.createTextNode(priceFormat.format(row.TongTien)));
                }
                fillChart(result, 3);
                xTitle.innerHTML = "Số lượng sử dụng";
                yTitle.innerHTML = "Tên gói khám";
            }else if(res.data.error !== null) {
                window.scroll(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy thông tin thống kê thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scroll(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy thông tin thống kê thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function loadDiseaseData() {
    choice = 4;
    fetch("http://localhost:3000/statistics/disease",{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            month: month.value,
            year: year.value
        })
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            let result = res.data.data;
            clearAll();
            reportTitle.innerHTML = "DỮ LIỆU NHÓM BỆNH MÀ KHÁCH HÀNG KHÁM TRONG MỘT THÁNG";
            $(head).append(" <tr>\n" +
            "                   <th style='text-align:center; background-color:#78a2d6; border: 1px solid #333;'>STT</th>\n" +
            "                   <th style='text-align:center; background-color:#78a2d6; border: 1px solid #333;'>Mã bệnh</th>\n" +
            "                   <th style='text-align:center; background-color:#78a2d6; border: 1px solid #333;'>Tên bệnh</th>\n" +
            "                   <th style='text-align:center; background-color:#78a2d6; border: 1px solid #333;'>Số lượng khám</th>\n" +
            "                </tr>");
            monthSection.style.display = "flex";
            yearSection.style.display = "flex";
            if(result !== null) {
                for(let i=0; i<result.length; i++) {
                    let row = result[i];
                    let data = body.insertRow();
                    let position = data.insertCell();
                    let id = data.insertCell();
                    let name = data.insertCell();
                    let amount = data.insertCell();
                    position.style.textAlign = "center";
                    position.appendChild(document.createTextNode((i+1).toString()));
                    id.style.textAlign = "center";
                    id.appendChild(document.createTextNode(row.MaBenh.toString()));
                    name.style.textAlign = "center";
                    name.appendChild(document.createTextNode(row.TenBenh.toString()));
                    amount.style.textAlign = "center";
                    amount.appendChild(document.createTextNode(row.SoLuongChon.toString()));
                }
                fillChart(result, 4);
                xTitle.innerHTML = "Số lượng khám";
                yTitle.innerHTML = "Tên nhóm bệnh";
            }else if(res.data.error !== null) {
                window.scroll(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy thông tin thống kê thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scroll(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy thông tin thống kê thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function loadBookData() {
    choice = 5;
    fetch("http://localhost:3000/statistics/book",{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            year: year.value
        })
    }).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            let result = res.data.data;
            clearAll();
            reportTitle.innerHTML = "DỮ LIỆU SỐ LƯỢT ĐẶT KHÁM THEO TỪNG THÁNG TRONG MỘT NĂM";
            $(head).append(" <tr>\n" +
            "                   <th style='text-align:center; background-color:#78a2d6; border: 1px solid #333;'>Tháng</th>\n" +
            "                   <th style='text-align:center; background-color:#78a2d6; border: 1px solid #333;'>Tổng số lượt đặt</th>\n" +
            "                   <th style='text-align:center; background-color:#78a2d6; border: 1px solid #333;'>Đang chờ xác nhận</th>\n" +
            "                   <th style='text-align:center; background-color:#78a2d6; border: 1px solid #333;'>Đã xác nhận</th>\n" +
            "                   <th style='text-align:center; background-color:#78a2d6; border: 1px solid #333;'>Đã hủy</th>\n" +
            "                </tr>");
            monthSection.style.display = "none";
            yearSection.style.display = "flex";
            if(result !== null) {
                for(let i=0; i<result.length; i++) {
                    let row = result[i];
                    let data = body.insertRow();
                    let month = data.insertCell();
                    let totalAmount = data.insertCell();
                    let pendingAmount = data.insertCell();
                    let confirmedAmount = data.insertCell();
                    let cancelledAmount = data.insertCell();
                    month.style.textAlign = "center";
                    month.appendChild(document.createTextNode(row.Thang.toString()));
                    totalAmount.style.textAlign = "center";
                    totalAmount.appendChild(document.createTextNode(row.Dat.toString()));
                    pendingAmount.style.textAlign = "center";
                    pendingAmount.appendChild(document.createTextNode(row.Cho.toString()));
                    confirmedAmount.style.textAlign = "center";
                    confirmedAmount.appendChild(document.createTextNode(row.XacNhan.toString()));
                    cancelledAmount.style.textAlign = "center";
                    cancelledAmount.appendChild(document.createTextNode(row.Huy.toString()));
                }
                fillChart(result, 5);
                xTitle.innerHTML = "Số lượt đặt khám";
                yTitle.innerHTML = "Tháng";
            }else if(res.data.error !== null) {
                window.scroll(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy thông tin thống kê thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scroll(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy thông tin thống kê thất bại, vui lòng thử lại sau");
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
    if(head.rows.length > 0) {
        head.deleteRow(0);
    }
    for(let i=statisticsTable.rows.length-1; i>=0; i--) {
        statisticsTable.deleteRow(i);
    }
}

function getLabel(data, value, choice) {
    for(let i=0; i<data.length; i++)
    {
        if(choice === 1) {
            if(value === data[i].MaKhachHang) {
                return data[i].Ho + " " + data[i].Ten;
            }
        }else if(choice === 2) {
            if(value === data[i].MaBacSi) {
                return data[i].Ho + " " + data[i].Ten;
            }
        }
    }
    return value;
}

function fillChart(data, choice) {
    let xkey;
    let ykeys;
    let labels;
    let barColors;
    if(choice === 1) {
        xkey = "MaKhachHang";
        ykeys = ["SoLuongDat"];
        labels = ["Tổng lượt đặt khám"];
        barColors = ["#79ccb3"];
    }else if(choice === 2) {
        xkey = ["MaBacSi"];
        ykeys = ["SoLuongDat", "SoLuongXacNhan", "SoLuongHuy"];
        labels = ["Đã đặt", "Xác nhận", "Hủy", ""];
        barColors = ["#d6d727", "#79ccb3", "#e9724d"];
    }else if(choice === 3) {
        xkey = "TenGoi";
        ykeys = ["SoLuongChon"];
        labels = ["Số lượng sử dụng"];
        barColors = ["#d6d727"];
    }else if(choice === 4) {
        xkey = "TenBenh";
        ykeys = ["SoLuongChon"];
        labels = ["Số lượng khám"];
        barColors = ["#e9724d"];
    }else if(choice === 5) {
        xkey = "Thang";
        ykeys = ["Cho", "XacNhan", "Huy"];
        labels = ["Đang chờ xác nhận", "Đã xác nhận", " Đã hủy"];
        barColors = ["#d6d727", "#79ccb3", "#e9724d"];
    }
    $("#chart").empty();
    Morris.Bar({
        element: "chart",
        barGap: 1,
        barSizeRatio: 0.1,
        data: data,
        xkey: xkey,
        ykeys: ykeys,
        labels: labels,
        xLabelFormat: function(x) {
            return getLabel(data, x.label, choice);
        },
        yLabelFormat: function(y) {
            return y + ' ';
        },
        labelTop: true,
        barColors: barColors,
        hideHover: "auto",
        gridLineColor: '#000000',
        xLabelAngle: "70",
        parseTime: false,
        gridTextSize: 13,
        gridTextColor: '#787276',
        resize: true
    });
}

function changeReport() {
    if(choice === 2) {
        loadDoctorData();
    }else if(choice === 3) {
        loadPackageData();
    }else if(choice === 4) {
        loadDiseaseData();
    }else if(choice === 5) {
        loadBookData();
    }
}

function createPrintReport() {
    let printer = document.getElementById("printer");
    let report = document.getElementById("report");
    printer.addEventListener("click", function () {
        let printWindow = window.open("", "PRINT", "height=600,width=600");
        printWindow.document.write(report.innerHTML);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        return true;
    });
}

function exportToExcel() {
    let divContent = document.getElementById("report").innerHTML;
    let csv = divContent.replace(/<\/?[^>]+(>|$)/g, '');
    let encodedCsv = encodeURIComponent(csv);
    let downloadLink = document.createElement("a");
    let csvData = "data:text/csv;charset=utf-8," + encodedCsv;
    let filename = "data.csv";
    downloadLink.href = csvData;
    downloadLink.download = filename;
    downloadLink.click();
}

function logOut() {
    let user = null;
    localStorage.setItem("user", JSON.stringify(user));
    location.href = "../../html/index.html";
}