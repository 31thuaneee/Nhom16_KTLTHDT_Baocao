const packageList = document.getElementById("package-list");
let $errorNotification = $("#error-notification");

function init() {
    loadPackageData();
}

function loadPackageData() {
    fetch("http://localhost:3000/package/getActive",{
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
            $(packageList).empty();
            if(result !== null) {
                for(let i=0; i<result.length; i++) {
                    let li = document.createElement("li");
                    let div = document.createElement("div");
                    let h3 = document.createElement("h3");
                    let h4 = document.createElement("h4");
                    let fromDate = result[i].TuNgay.substring(0, 10).split("-");
                    let toDate = result[i].DenNgay.substring(0, 10).split("-");
                    let dateInformation = fromDate[2] + "/" + fromDate[1] + "/" + fromDate[0]
                        + " - " + toDate[2] + "/" + toDate[1] + "/" + toDate[0];
                    li.style.display = "flex";
                    div.style.margin = "10px";
                    h3.style.lineHeight = "1.3em";
                    h3.style.fontSize = "14px";
                    h3.style.color = "#333";
                    h4.style.lineHeight = "1.3em";
                    h4.style.fontSize = "12px";
                    h4.style.color = "#666"
                    h3.appendChild(document.createTextNode("Gói " + result[i].TenGoi));
                    h4.appendChild(document.createTextNode(dateInformation));
                    div.appendChild(h3);
                    div.appendChild(h4);
                    $(li).append("<img src='../../images/customer_package.png' alt='' style='width:50px; height:50px; border-radius:50%'>")
                    li.appendChild(div);
                    packageList.appendChild(li);
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

function searchPackage() {
    const packageSearch = document.getElementById("package-search");
    console.log(packageSearch.value);
    if(packageSearch.value !== "") {
        fetch("http://localhost:3000/package/searchActive/" + packageSearch.value,{
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
                $(packageList).empty();
                if(result !== null) {
                    for(let i=0; i<result.length; i++) {
                        let li = document.createElement("li");
                        let div = document.createElement("div");
                        let h3 = document.createElement("h3");
                        let h4 = document.createElement("h4");
                        let fromDate = result[i].TuNgay.substring(0, 10).split("-");
                        let toDate = result[i].DenNgay.substring(0, 10).split("-");
                        let dateInformation = fromDate[2] + "/" + fromDate[1] + "/" + fromDate[0]
                            + " - " + toDate[2] + "/" + toDate[1] + "/" + toDate[0];
                        li.style.display = "flex";
                        div.style.margin = "10px";
                        h3.style.lineHeight = "1.3em";
                        h3.style.fontSize = "14px";
                        h3.style.color = "#333";
                        h4.style.lineHeight = "1.3em";
                        h4.style.fontSize = "12px";
                        h4.style.color = "#666"
                        h3.appendChild(document.createTextNode("Gói " + result[i].TenGoi));
                        h4.appendChild(document.createTextNode(dateInformation));
                        div.appendChild(h3);
                        div.appendChild(h4);
                        $(li).append("<img src='../../images/customer_package.png' alt='' style='width:50px; height:50px; border-radius:50%'>")
                        li.appendChild(div);
                        packageList.appendChild(li);
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