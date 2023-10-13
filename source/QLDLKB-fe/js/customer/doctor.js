const doctorList = document.getElementById("doctor-list");
let $errorNotification = $("#error-notification");

function init() {
    loadDoctorData();
}

function loadDoctorData() {
    fetch("http://localhost:3000/doctor/patient",{
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
            $(doctorList).empty();
            if(result !== null) {
                for(let i=0; i<result.length; i++) {
                    let li = document.createElement("li");
                    let img = document.createElement("img");
                    let div = document.createElement("div");
                    let h3 = document.createElement("h3");
                    let h4 = document.createElement("h4");
                    li.style.display = "flex";
                    img.src = result[i].HinhAnh;
                    img.style.width = "50px";
                    img.style.height = "50px";
                    img.style.borderRadius = "50%";
                    div.style.margin = "10px";
                    h3.style.lineHeight = "1.3em";
                    h3.style.fontSize = "14px";
                    h3.style.color = "#333";
                    h4.style.lineHeight = "1.3em";
                    h4.style.fontSize = "12px";
                    h4.style.color = "#666"
                    h3.appendChild(document.createTextNode(result[i].HoTen));
                    h4.appendChild(document.createTextNode("Khoa " +result[i].TenKhoa));
                    div.appendChild(h3);
                    div.appendChild(h4);
                    li.appendChild(img);
                    li.appendChild(div);
                    doctorList.appendChild(li);
                }
            }else if(res.data.error !== null) {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy thông tin bác sĩ thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy thông tin bác sĩ thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function searchDoctor() {
    const doctorSearch = document.getElementById("doctor-search");
    console.log(doctorSearch.value);
    if(doctorSearch.value !== "") {
        fetch("http://localhost:3000/doctor/patient/search/" + doctorSearch.value,{
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
                $(doctorList).empty();
                if(result !== null) {
                    for(let i=0; i<result.length; i++) {
                        let li = document.createElement("li");
                        let img = document.createElement("img");
                        let div = document.createElement("div");
                        let h3 = document.createElement("h3");
                        let h4 = document.createElement("h4");
                        li.style.display = "flex";
                        img.src = result[i].HinhAnh;
                        img.style.width = "50px";
                        img.style.height = "50px";
                        img.style.borderRadius = "50%";
                        div.style.margin = "10px";
                        h3.style.lineHeight = "1.3em";
                        h3.style.fontSize = "14px";
                        h3.style.color = "#333";
                        h4.style.lineHeight = "1.3em";
                        h4.style.fontSize = "12px";
                        h4.style.color = "#666"
                        h3.appendChild(document.createTextNode(result[i].HoTen));
                        h4.appendChild(document.createTextNode("Khoa " +result[i].TenKhoa));
                        div.appendChild(h3);
                        div.appendChild(h4);
                        li.appendChild(img);
                        li.appendChild(div);
                        doctorList.appendChild(li);
                    }
                }else if(res.data.error !== null) {
                    window.scrollTo(0, 0);
                    $errorNotification.find("#error-message")
                        .text("Lấy thông tin bác sĩ thất bại, vui lòng thử lại sau");
                    $errorNotification.fadeIn(500, "swing", function() {
                        setTimeout(function() {
                            $errorNotification.fadeOut(2000, "linear");
                        }, 2500);
                    });
                }
        })).catch(error => {
            window.scrollTo(0, 0);
            $errorNotification.find("#error-message")
                .text("Lấy thông tin bác sĩ thất bại, vui lòng thử lại sau");
            $errorNotification.fadeIn(500, "swing", function() {
                setTimeout(function() {
                    $errorNotification.fadeOut(2000, "linear");
                }, 2500);
            });
        });
    }else {
        loadDoctorData();
    }
}