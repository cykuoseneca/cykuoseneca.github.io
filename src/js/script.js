window.onload = function () {
    HandleContactMe();
    HandleContactCity();
    HandleOption();
    HandleDownloadCV();
};

// Handle Event - Click "Contact Me" Button
function HandleContactMe() {
    const btnContact = document.querySelector("#contact-me-btn");
    btnContact.addEventListener("click", function () {
        document.querySelector("#contact-me").scrollIntoView();
    });
}

function HandleDownloadCV() {
    const download = document.querySelector("#download-btn");

    download.addEventListener("click", function () {
        console.log("here");
        window.open('../data/CV-ChunYiKuo.pdf')
    });
}

// Handle Event - Click "Submit" Button
// Called in html input element id="sumbit"
function HandleSubmit() {
    const form = document.querySelector("#formdata");
    form.addEventListener("submit", function (event) {
        event.preventDefault();
    });

    let ok = ValidateInputFormat();
    if (ok) {
        let request = new XMLHttpRequest();
        url = "https://httpbin.org/post";
        request.onload = function () {
            console.log(this.response);
        };
        request.open("POST", url);
        request.send(GetFormData());
        console.log(GetFormData());
    }
}

// Handle AJAX - Autocomplete City of Canada
function HandleContactCity() {
    let city = document.querySelector("#contact-city");
    city.addEventListener("input", function () {
        if (city.value.length !== 0) {
            url = `https://geogratis.gc.ca/services/geoname/en/geonames.json?q=${city.value}*&concise=CITY&sort-field=name`;
            let request = new XMLHttpRequest();
            request.onload = function () {
                let response = JSON.parse(this.responseText);
                let cityopt = document.querySelector("#cityopt");
                cityopt.innerText = "";
                response.items.forEach((element) => {
                    let option = document.createElement("option");
                    option.innerText = element.name;
                    option.value = element.name;
                    cityopt.appendChild(option);
                });
            };
            request.open("GET", url);
            request.send();
        }
    });
}

// Handle rate hidden attribute wrt option selected
function HandleOption() {
    let question = document.querySelector("#opt-question");
    let comment = document.querySelector("#opt-comment");
    let hiring = document.querySelector("#opt-hiring");
    let rate = document.querySelector("#div-contact-rate");

    if (hiring.checked) {
        rate.classList.remove("hidden");
    } else {
        rate.classList.add("hidden");
    }

    question.addEventListener("click", function (event) {
        rate.classList.add("hidden");
    });
    comment.addEventListener("click", function (event) {
        rate.classList.add("hidden");
    });
    hiring.addEventListener("click", function (event) {
        rate.classList.remove("hidden");
    });
}

function GetFormData() {
    let name = document.querySelector("#contact-name");
    let salute = document.querySelector("#contact-salutation");
    let email = document.querySelector("#contact-email");
    let province = document.querySelector("#contact-province");
    let city = document.querySelector("#contact-city");
    let address = document.querySelector("#contact-address");
    let postal = document.querySelector("#contact-postal");
    let rate = document.querySelector("#contact-rate");
    let comment = document.querySelector("#contact-comment");

    let data = {};
    data["name"] = name.value;
    data["salute"] = salute.value;
    data["email"] = email.value;
    data["province"] = province.value;
    data["city"] = city.value;
    data["address"] = address.value;
    data["postal"] = postal.value;
    data["rate"] = rate.value;
    data["comment"] = comment.value;

    return data;
}

function ValidateInputFormat() {
    let nameok = ValidateName();
    let saluteok = ValidateSalutation();
    let emailok = ValidateEmail();
    let provinceok = ValidateProvince();
    let cityok = ValidateCity();
    let addressok = ValidateAddress();
    let postalok = ValidatePostal();
    let rateok = ValidateRate();
    let commentok = ValidateComment();

    return (
        nameok &&
        saluteok &&
        emailok &&
        provinceok &&
        cityok &&
        addressok &&
        postalok &&
        rateok &&
        commentok
    );
}

function ValidateName() {
    const name = document.querySelector("#contact-name");

    if (name.value.length === 0) {
        ToggleRequiredNotice("name", true);
        return false;
    }
    ToggleRequiredNotice("name", false);
    return true;
}

function ValidateSalutation() {
    const salutation = document.querySelector("#contact-salutation");

    if (parseInt(salutation.value) === 0) {
        ToggleRequiredNotice("salutation", true);
        return false;
    }
    ToggleRequiredNotice("salutation", false);
    return true;
}

function ValidateEmail() {
    let email = document.querySelector("#contact-email");

    if (email.value.length === 0) {
        ModifyRequiredNoticeDesc("email", "* this is required");
        ToggleRequiredNotice("email", true);
        return false;
    }

    let p = "[a-z0-9]*@[a-z0-9]*.[a-z]*";
    let pattern = new RegExp(p, "gi");
    let match = email.value.search(pattern);
    if (match < 0) {
        ModifyRequiredNoticeDesc("email", "* format error");
        ToggleRequiredNotice("email", true);
        email.value = "";
        return false;
    }
    ToggleRequiredNotice("email", false);
    return true;
}

function ValidateProvince() {
    let prov = document.querySelector("#contact-province");

    if (parseInt(prov.value) === 0) {
        ToggleRequiredNotice("province", true);
        return false;
    }
    ToggleRequiredNotice("province", false);
    return true;
}

function ValidateCity() {
    let city = document.querySelector("#contact-city");

    if (city.value.length === 0) {
        ToggleRequiredNotice("city", true);
        return false;
    }
    ToggleRequiredNotice("city", false);
    return true;
}

function ValidateAddress() {
    let address = document.querySelector("#contact-address");

    if (address.value.length === 0) {
        ToggleRequiredNotice("address", true);
        return false;
    }
    ToggleRequiredNotice("address", false);
    return true;
}

function ValidatePostal() {
    let postal = document.querySelector("#contact-postal");

    if (postal.value.length === 0) {
        ModifyRequiredNoticeDesc("postal", "* this is required");
        ToggleRequiredNotice("postal", true);
        return false;
    }

    try {
        FixPostalCode(postal.value);
    } catch (error) {
        console.log(error);
        ModifyRequiredNoticeDesc("postal", "* format error");
        ToggleRequiredNotice("postal", true);
        return false;
    }
    ToggleRequiredNotice("postal", false);
    return true;
}

function FixPostalCode(postalCode) {
    postalCode = postalCode.toUpperCase().trim();

    if (postalCode.search(/[^A-Z0-9 ]/g) !== -1)
        throw "Invalid postal code. Only digits and letters are allowed.";

    if (postalCode.length === 6)
        postalCode = postalCode.substring(0, 3) + " " + postalCode.substring(3);
    if (postalCode.length !== 7)
        throw "Invalid postal code. Too many characters.";

    if (postalCode.charAt(0).search(/[DFIOQWUZ]/g) !== -1)
        throw "Invalid postal code. Invalid letter(D, F, I, O, Q, W, U, Z) at 1st character.";
    if (postalCode.substring(1).search(/[DFIOQU]/g) !== -1)
        throw "Invalid postal code. Invalid Letter(D, F, I, O, Q, U).";
    if (postalCode.charAt(0).search(/[A-Z]/g) === -1)
        throw "Invalid postal code. Should be a character at 1st character.";
    if (postalCode.charAt(2).search(/[A-Z]/g) === -1)
        throw "Invalid postal code. Should be a character at 3rd character.";
    if (postalCode.charAt(5).search(/[A-Z]/g) === -1)
        throw "Invalid postal code. Should be a character at 6th character.";

    if (postalCode.charAt(1).search(/\d/g) !== 0)
        throw "Invalid postal code. Should be a digit at 2nd character.";
    if (postalCode.charAt(4).search(/\d/g) !== 0)
        throw "Invalid postal code. Should be a digit at 5th character.";
    if (postalCode.charAt(6).search(/\d/g) !== 0)
        throw "Invalid postal code. Should be a digit at 7th character.";

    return postalCode;
}

function ValidateRate() {
    let rate = document.querySelector("#contact-rate");
    let ratediv = document.querySelector("#div-contact-rate");

    if (ratediv.classList.contains("hidden")) {
        return true;
    }

    if (rate.value.length === 0) {
        ModifyRequiredNoticeDesc("rate", "* this is required");
        ToggleRequiredNotice("rate", true);
        return false;
    }

    if (isNaN(parseFloat(rate.value))) {
        ModifyRequiredNoticeDesc("rate", "* format error");
        ToggleRequiredNotice("rate", true);
        return false;
    }

    ModifyRequiredNoticeDesc("rate", "* this is required");
    ToggleRequiredNotice("rate", false);
    return true;
}

function ValidateComment() {
    let comment = document.querySelector("#contact-comment");

    if (comment.value.length === 0) {
        ToggleRequiredNotice("comment", true);
        return false;
    }
    ToggleRequiredNotice("comment", false);
    return true;
}

function ToggleRequiredNotice(id, show) {
    const notice = document.querySelector(`#required-${id}`);

    if (show) {
        if (notice.classList.contains("hidden"))
            notice.classList.remove("hidden");
    } else notice.classList.add("hidden");
}

function ModifyRequiredNoticeDesc(id, desc) {
    const notice = document.querySelector(`#required-${id}`);
    notice.innerHTML = desc;
}
