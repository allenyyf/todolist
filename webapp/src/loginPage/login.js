var LoginPage = (function () {
    function LoginPage() {
        this.status = "signup";
        this.publicTemplate = "<div class=\"container\">\n            <div class=\"signup-Tab clicked\">\u6CE8\u518C</div>\n            <div class=\"login-Tab\">\u767B\u5F55</div>\n            <div class=\"form-container\">\n            <form class=\"signupPart\" action=\"http://127.0.0.1:8080/signup\" method = \"post\">\n                <input class = \"signupAccount\" type = \"text\" name = \"sigupAccount\" placeholder = \"\u6CE8\u518C\u8D26\u6237\u540D\u79F0\"/>\n                <span class = \"singnupAccountInf\"></span>\n                <input class = \"signupPassword\" type = \"password\" name = \"sigupPw\" placeholder = \"\u5BC6\u7801(\u4E0D\u5C11\u4E8E6\u4F4D)\"/>\n                <span class = \"singnupPwInf\"></span>\n                <input class = \"confirmPassword\" type = \"password\" name = \"confirmPw\" placeholder = \"\u518D\u6B21\u8F93\u5165\u5BC6\u7801\"/>\n                <span class = \"ConfirmPwInf\">\u4E24\u6B21\u8F93\u5165\u5BC6\u7801\u4E0D\u4E00\u81F4</span>\n                <div class =\"signupBtn\">\u6CE8\u518C</div>\n            </form>\n            <form class = \"loginPart\" action=\"http://127.0.0.1:8080/login\" method = \"post\">\n                <input class = \"loginAccount\" type = \"text\" name = \"loginAccount\" placeholder = \"\u8D26\u6237\u540D\u79F0\"/>\n                <span class = \"loginAccountInf\">\u8D26\u6237\u672A\u6CE8\u518C</span>\n                <input class = \"loginPassword\" type = \"password\" name = \"loginPw\" placeholder = \"\u5BC6\u7801\"/>\n                <span class = \"loginPwInf\"></span>\n                <div class = \"loginBtn\">\u767B\u5F55</div>\n            </form>\n            </div>\n        </div>";
        this.signupAcStauts = false;
        this.signupPwStatus = false;
        this.confirmPwStatus = false;
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
            _this.sendSignupData();
        });
        this.loginBtn.addEventListener("click", function () {
            _this.loginBtn.style.opacity = "0.6";
            setTimeout(function () {
                _this.loginBtn.style.opacity = "1";
            }, 50);
        });
        this.signupAccountInput.addEventListener("keydown", function (e) {
            if (e.keyCode === 13 && _this.signupAccountInput.value != "") {
                _this.signupAccount = _this.signupAccountInput.value;
            }
        });
        this.signupPasswordInput.addEventListener("keydown", function (e) {
            if (e.keyCode === 13 && _this.signupPasswordInput.value != "") {
                _this.signupPassword = _this.signupPasswordInput.value;
            }
        });
        this.confirmPwInput.addEventListener("keydown", function (e) {
            if (e.keyCode === 13 && _this.confirmPw == _this.signupPassword) {
                _this.confirmPwStatus = true;
            }
        });
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
        xml.onreadystatechange = function () {
            console.log(xml.status);
            console.log(xml.readyState);
            if (xml.readyState == 4 && xml.status == 200) {
                console.log("success");
            }
        };
        xml.open("post", "signup");
        xml.setRequestHeader("content-type", "application/json");
        xml.send(signupData);
    };
    return LoginPage;
}());
window.onload = function () {
    var loginpage = new LoginPage();
};
//# sourceMappingURL=login.js.map