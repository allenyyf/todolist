var LoginPage = (function () {
    function LoginPage() {
        this.status = "signup";
        this.publicTemplate = "<div class=\"container\">\n            <div class=\"signup-Tab clicked\">\u6CE8\u518C</div>\n            <div class=\"login-Tab\">\u767B\u5F55</div>\n            <div class=\"form-container\">\n            <form class=\"signupPart\" action=\"http://127.0.0.1:8080/signup\" method = \"post\">\n                <input class = \"signupAccount\" type = \"text\" name = \"sigupAccount\" placeholder = \"\u6CE8\u518C\u8D26\u6237\u540D\u79F0\" autocomplete=\"off\"/>\n                <span class = \"signupAccountInf\"></span>\n                <input class = \"signupPassword\" type = \"password\" name = \"sigupPw\" placeholder = \"\u5BC6\u7801(\u4E0D\u5C11\u4E8E6\u4F4D)\" autocomplete=\"off\"/>\n                <span class = \"signupPwInf\"></span>\n                <input class = \"confirmPassword\" type = \"password\" name = \"confirmPw\" placeholder = \"\u518D\u6B21\u8F93\u5165\u5BC6\u7801\" autocomplete=\"off\"/>\n                <span class = \"ConfirmPwInf\"></span>\n                <div class =\"signupBtn\">\u6CE8\u518C</div>\n            </form>\n            <div class = \"error-btn\"><p>\u8BF7\u5C06\u6CE8\u518C\u4FE1\u606F\u6309\u7167</p><p>\u6B63\u786E\u7684\u63D0\u793A\u586B\u5199\u5B8C\u6574</p></div>\n            <form class = \"loginPart\" action=\"http://127.0.0.1:8080/login\" method = \"post\">\n                <input class = \"loginAccount\" type = \"text\" name = \"loginAccount\" placeholder = \"\u8D26\u6237\u540D\u79F0\" autocomplete=\"off\"/>\n                <span class = \"loginAccountInf\"></span>\n                <input class = \"loginPassword\" type = \"password\" name = \"loginPw\" placeholder = \"\u5BC6\u7801\" autocomplete=\"off\"/>\n                <span class = \"loginPwInf\"></span>\n                <div class = \"loginBtn\">\u767B\u5F55</div>\n            </form>\n            </div>\n        </div>";
        this.signupAcStatus = false;
        this.signupPwStatus = false;
        this.confirmPwStatus = false;
        this.loginAcStatus = false;
        this.loginPwStatus = false;
        this.render();
    }
    LoginPage.prototype.render = function () {
        if (!this.el) {
            var wrap = document.createElement("div");
            wrap.innerHTML = this.publicTemplate;
            this.el = wrap.children[0];
            document.body.appendChild(this.el);
            this.formContainer = document.querySelector(".form-container");
            this.signupTab = document.querySelector(".signup-Tab");
            this.signupPart = document.querySelector(".signupPart");
            this.signupBtn = document.querySelector(".signupBtn");
            this.signupAccountInput = document.querySelector(".signupAccount");
            this.signupAccountInf = document.querySelector(".signupAccountInf");
            this.signupPasswordInput = document.querySelector(".signupPassword");
            this.signupPwInf = document.querySelector(".signupPwInf");
            this.confirmPwInput = document.querySelector(".confirmPassword");
            this.confirmPwInf = document.querySelector(".confirmPwInf");
            this.loginTab = document.querySelector(".login-Tab");
            this.loginBtn = document.querySelector(".loginBtn");
            this.loginPart = document.querySelector(".loginPart");
            this.loginAccountInput = document.querySelector(".loginAccount");
            this.loginAccountInf = document.querySelector(".loginAccountInf");
            this.loginPasswordInput = document.querySelector(".loginPassword");
            this.loginPwInf = document.querySelector(".loginPwInf");
            this.errorText = document.querySelector(".error-btn");
            this.bindEvent();
        }
        if (this.status == "signup") {
            console.log(1);
            this.renderSignup();
        }
        else {
            this.renderLogin();
        }
    };
    LoginPage.prototype.bindEvent = function () {
        var _this = this;
        this.loginTab.addEventListener("click", function () {
            _this.status = "login";
            _this.loginTab.className = "login-Tab clicked";
            _this.signupTab.className = "signup-Tab";
            _this.render();
        });
        this.signupTab.addEventListener("click", function () {
            _this.status = "signup";
            _this.signupTab.className = "signup-Tab clicked";
            _this.loginTab.className = "login-Tab";
            _this.render();
        });
        this.signupBtn.addEventListener("click", function () {
            _this.signupBtn.style.opacity = "0.6";
            setTimeout(function () {
                _this.signupBtn.style.opacity = "1";
            }, 50);
            if (_this.signupAcStatus && _this.confirmPwStatus && _this.signupPwStatus) {
                _this.sendSignupData();
                _this.clearInput();
            }
            else {
                _this.errorText.className = "error-btn show";
            }
        });
        this.errorText.addEventListener("click", function () {
            _this.errorText.className = "error-btn";
        });
        this.loginBtn.addEventListener("click", function () {
            _this.loginBtn.style.opacity = "0.6";
            setTimeout(function () {
                _this.loginBtn.style.opacity = "1";
            }, 50);
            if (_this.loginAcStatus == true && _this.loginPwStatus == true) {
                _this.sendloginData();
            }
            console.log(_this.loginAcStatus, _this.loginPwStatus);
        });
        this.signupAccountInput.addEventListener("keydown", this.debounce(function () {
            if (_this.signupAccountInput.value !== "") {
                _this.signupAccount = _this.signupAccountInput.value;
                _this.checkAccountIsexist(_this.signupAccount);
                console.log(_this.signupAccount);
            }
            else {
                _this.signupAccountInf.innerHTML = "";
            }
        }, 500), true);
        this.signupPasswordInput.addEventListener("keydown", this.debounce(function () {
            _this.signupPwStatus = false;
            if (_this.signupPasswordInput.value.length >= 6) {
                _this.signupPassword = _this.signupPasswordInput.value;
                _this.signupPwInf.innerHTML = "您设置的密码很安全";
                _this.signupPwInf.style.color = "green";
                _this.signupPwStatus = true;
            }
            else if (_this.signupPasswordInput.value == "") {
                _this.signupPwInf.innerHTML = "";
            }
            else {
                _this.signupPwInf.innerHTML = "密码长度小于6位不安全哦";
                _this.signupPwInf.style.color = "red";
            }
            _this.render();
        }, 100), true);
        this.confirmPwInput.addEventListener("keydown", this.debounce(function () {
            _this.confirmPw = _this.confirmPwInput.value;
            _this.confirmPwStatus = false;
            if (_this.confirmPw == _this.signupPassword) {
                _this.confirmPwInf.innerHTML = "输入正确，请牢记";
                _this.confirmPwInf.style.color = "green";
                _this.confirmPwStatus = true;
            }
            else if (_this.confirmPwInput.value == "") {
                _this.confirmPwInf.innerHTML = "";
            }
            else {
                _this.confirmPwInf.innerHTML = "两次密码输入不一致";
                _this.confirmPwInf.style.color = "red";
            }
            _this.render();
        }, 500), true);
        this.loginAccountInput.addEventListener("keydown", this.debounce(function () {
            if (_this.loginAccountInput.value == "") {
                _this.loginAccountInf.innerHTML = "";
            }
            else {
                _this.loginAccount = _this.loginAccountInput.value;
                _this.checkAccountIsexist(_this.loginAccount);
            }
        }, 200), true);
        this.loginPasswordInput.addEventListener("keydown", this.debounce(function () {
            _this.loginPwStatus = false;
            _this.loginPwInf.innerHTML = "";
            if (_this.loginPasswordInput.value !== "" && _this.loginPasswordInput.value.length >= 6) {
                _this.loginPassword = _this.loginPasswordInput.value;
                _this.loginPwStatus = true;
                console.log(_this.loginPwStatus);
            }
            else if (_this.loginPasswordInput.value == "") {
                _this.loginPwInf.innerHTML = "请输入密码";
            }
            else {
                _this.loginPwInf.innerHTML = "请输入正确的密码格式";
                _this.loginPwInf.style.color = "red";
            }
            _this.render();
        }, 500), true);
    };
    LoginPage.prototype.renderSignup = function () {
        this.loginPart.style.display = "none";
        this.signupPart.style.display = "block";
    };
    LoginPage.prototype.renderLogin = function () {
        this.signupPart.style.display = "none";
        this.loginPart.style.display = "block";
    };
    LoginPage.prototype.sendSignupData = function () {
        var xml = new XMLHttpRequest();
        this.signupdata = {
            account: this.signupAccount,
            password: this.signupPassword
        };
        var signupData = JSON.stringify(this.signupdata);
        console.log(signupData);
        xml.open("post", "/signup");
        xml.setRequestHeader("content-type", "application/json");
        xml.send(signupData);
        xml.onreadystatechange = function () {
            if (xml.readyState == 4 && xml.status == 200) {
                console.log(xml.response);
            }
        };
    };
    LoginPage.prototype.checkAccountIsexist = function (userAccount) {
        var _this = this;
        var xml = new XMLHttpRequest();
        var account = { account: userAccount };
        var Account = JSON.stringify(account);
        xml.open("post", "/signupAccount");
        xml.setRequestHeader("content-type", "application/json");
        xml.send(Account);
        xml.onreadystatechange = function () {
            if (xml.readyState == 4 && xml.status == 200) {
                if (userAccount == _this.signupAccount) {
                    _this.signupAcStatus = false;
                    _this.signupAccountInf.innerHTML = "";
                    if (xml.responseText == "账户已存在") {
                        _this.signupAccountInf.innerHTML = "账户已存在";
                        _this.signupAccountInf.style.color = "red";
                    }
                    else if (xml.responseText == "账户名未注册") {
                        _this.signupAccountInf.innerHTML = "账户可用";
                        _this.signupAccountInf.style.color = "green";
                        _this.signupAcStatus = true;
                    }
                }
                else if (userAccount == _this.loginAccount) {
                    _this.loginAcStatus = false;
                    _this.loginAccountInf.innerHTML = "";
                    if (xml.responseText == "账户已存在") {
                        _this.loginAccountInf.innerHTML = "success";
                        _this.loginAccountInf.style.color = "green";
                        _this.loginAcStatus = true;
                    }
                    else if (xml.responseText == "账户名未注册") {
                        _this.loginAccountInf.innerHTML = "账户未注册，请先注册";
                        _this.loginAccountInf.style.color = "red";
                    }
                }
                _this.render();
            }
        };
    };
    LoginPage.prototype.sendloginData = function () {
        var _this = this;
        var xml = new XMLHttpRequest();
        this.logindata = {
            account: this.loginAccount,
            password: this.loginPassword
        };
        var loginData = JSON.stringify(this.logindata);
        xml.open("post", "/login", true);
        xml.setRequestHeader("content-type", "application/json");
        xml.send(loginData);
        xml.onreadystatechange = function () {
            if (xml.readyState == 4 && xml.status == 200) {
                if (xml.responseText == "password is wrong") {
                    _this.pwErrorMessage();
                }
                else if (xml.responseText == "password is wrong") {
                }
            }
            else {
                console.log(xml.status);
            }
        };
    };
    LoginPage.prototype.debounce = function (fn, delay) {
        var timer;
        return function () {
            clearTimeout(timer);
            timer = setTimeout(function () { fn(); }, delay);
        };
    };
    LoginPage.prototype.clearInput = function () {
        this.signupAccountInput.value = "";
        this.signupAccount = "";
        this.signupAccountInf.innerHTML = "";
        this.signupAcStatus = false;
        this.signupPasswordInput.value = "";
        this.signupPassword = "";
        this.signupPwInf.innerHTML = "";
        this.signupPwStatus = false;
        this.confirmPwInput.value = "";
        this.confirmPw = "";
        this.confirmPwInf.innerHTML = "";
        this.confirmPwStatus = false;
        this.render();
    };
    LoginPage.prototype.pwErrorMessage = function () {
        this.loginPwInf.innerHTML = "密码错误,请重新输入";
        this.loginPwStatus = false;
        this.loginPwInf.style.color = "red";
        this.render();
    };
    return LoginPage;
}());
window.onload = function () {
    var loginpage = new LoginPage();
};
//# sourceMappingURL=login.js.map