const diseaseList = document.getElementById("disease-list");
let $errorNotification = $("#error-notification");

function init() {
    loadDiseaseData();
}

function loadDiseaseData() {
    fetch("http://localhost:3000/disease/getActive",{
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
            $(diseaseList).empty();
            if(result !== null) {
                for(let i=0; i<result.length; i++) {
                    let li = document.createElement("li");
                    let div = document.createElement("div");
                    let h3 = document.createElement("h3");
                    li.style.display = "flex";
                    div.style.margin = "10px";
                    h3.style.lineHeight = "2.5em";
                    h3.style.fontSize = "14px";
                    h3.style.color = "#333";
                    h3.appendChild(document.createTextNode(result[i].TenBenh));
                    div.appendChild(h3);
                    $(li).append("<img src='../../images/customer_disease.png' alt='' style='width:50px; height:50px; border-radius:50%'>")
                    li.appendChild(div);
                    diseaseList.appendChild(li);
                }
            }else if(res.data.error !== null) {
                window.scrollTo(0, 0);
                $errorNotification.find("#error-message")
                    .text("Lấy thông tin bệnh thất bại, vui lòng thử lại sau");
                $errorNotification.fadeIn(500, "swing", function() {
                    setTimeout(function() {
                        $errorNotification.fadeOut(2000, "linear");
                    }, 2500);
                });
            }
    })).catch(error => {
        window.scrollTo(0, 0);
        $errorNotification.find("#error-message")
            .text("Lấy thông tin bệnh thất bại, vui lòng thử lại sau");
        $errorNotification.fadeIn(500, "swing", function() {
            setTimeout(function() {
                $errorNotification.fadeOut(2000, "linear");
            }, 2500);
        });
    });
}

function searchDisease() {
    const diseaseSearch = document.getElementById("disease-search");
    console.log(diseaseSearch.value);
    if(diseaseSearch.value !== "") {
        fetch("http://localhost:3000/disease/searchActive/" + diseaseSearch.value,{
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
                $(diseaseList).empty();
                if(result !== null) {
                    for(let i=0; i<result.length; i++) {
                        let li = document.createElement("li");
                        let div = document.createElement("div");
                        let h3 = document.createElement("h3");
                        li.style.display = "flex";
                        div.style.margin = "10px";
                        h3.style.lineHeight = "2.5em";
                        h3.style.fontSize = "14px";
                        h3.style.color = "#333";
                        h3.appendChild(document.createTextNode(result[i].TenBenh));
                        div.appendChild(h3);
                        $(li).append("<img src='../../images/customer_disease.png' alt='' style='width:50px; height:50px; border-radius:50%'>")
                        li.appendChild(div);
                        diseaseList.appendChild(li);
                    }
                }else if(res.data.error !== null) {
                    window.scrollTo(0, 0);
                    $errorNotification.find("#error-message")
                        .text("Lấy thông tin bệnh thất bại, vui lòng thử lại sau");
                    $errorNotification.fadeIn(500, "swing", function() {
                        setTimeout(function() {
                            $errorNotification.fadeOut(2000, "linear");
                        }, 2500);
                    });
                }
        })).catch(error => {
            window.scrollTo(0, 0);
            $errorNotification.find("#error-message")
                .text("Lấy thông tin bệnh thất bại, vui lòng thử lại sau");
            $errorNotification.fadeIn(500, "swing", function() {
                setTimeout(function() {
                    $errorNotification.fadeOut(2000, "linear");
                }, 2500);
            });
        });
    }else {
        loadDiseaseData();
    }
}