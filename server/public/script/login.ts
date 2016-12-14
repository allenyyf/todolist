

interface userInf{
    account:string
    password:string
}



class LoginPage{
    public status:"login" | "signup" = "signup"
    public signupTab:HTMLElement
    public signupPart:HTMLElement
    public signupAccountInput:HTMLInputElement
    public signupAccountInf:HTMLElement
    public signupPasswordInput:HTMLInputElement
    public signupPwInf:HTMLElement
    public confirmPwInput:HTMLInputElement
    public confirmPwInf:HTMLElement
    public signupBtn:HTMLElement
    public loginTab:HTMLElement
    public loginPart:HTMLElement
    public loginAccountInput:HTMLInputElement
    public loginAccountInf:HTMLElement
    public loginPasswordInput:HTMLInputElement
    public loginPwInf:HTMLElement
    public loginBtn:HTMLElement
    public el:HTMLElement
    public formContainer:HTMLElement
    public publicTemplate:string = 
        `<div class="container">
            <div class="signup-Tab clicked">注册</div>
            <div class="login-Tab">登录</div>
            <div class="form-container">
            <form class="signupPart" action="http://127.0.0.1:8080/signup" method = "post">
                <input class = "signupAccount" type = "text" name = "sigupAccount" placeholder = "注册账户名称"/>
                <span class = "singnupAccountInf"></span>
                <input class = "signupPassword" type = "password" name = "sigupPw" placeholder = "密码(不少于6位)"/>
                <span class = "singnupPwInf"></span>
                <input class = "confirmPassword" type = "password" name = "confirmPw" placeholder = "再次输入密码"/>
                <span class = "ConfirmPwInf">两次输入密码不一致</span>
                <div class ="signupBtn">注册</div>
            </form>
            <form class = "loginPart" action="http://127.0.0.1:8080/login" method = "post">
                <input class = "loginAccount" type = "text" name = "loginAccount" placeholder = "账户名称"/>
                <span class = "loginAccountInf">账户未注册</span>
                <input class = "loginPassword" type = "password" name = "loginPw" placeholder = "密码"/>
                <span class = "loginPwInf"></span>
                <div class = "loginBtn">登录</div>
            </form>
            </div>
        </div>`
        public signupAccount:string
        public signupPassword:string
        public confirmPw:string
        public signupAcStauts:boolean = false
        public signupPwStatus:boolean = false
        public confirmPwStatus:boolean = false
        public signupdata:userInf
        public loginAccount:string
        public loginPassword:string
        public logindata:userInf

    constructor(){
        this.render()
    }

    public render(){
        if(!this.el){
            let wrap = document.createElement("div")
            wrap.innerHTML = this.publicTemplate
            this.el = wrap.children[0] as HTMLElement
            document.body.appendChild(this.el)
            this.formContainer = document.querySelector(".form-container") as HTMLElement
            this.signupTab = document.querySelector(".signup-Tab") as HTMLElement
            this.signupPart = document.querySelector(".signupPart") as HTMLElement
            this.signupBtn = document.querySelector(".signupBtn") as HTMLElement
            this.signupAccountInput = document.querySelector(".signupAccount") as HTMLInputElement
            this.signupAccountInf = document.querySelector(".signupAccountInf") as HTMLElement
            this.signupPasswordInput = document.querySelector(".signupPassword") as HTMLInputElement
            this.signupPwInf = document.querySelector(".signupPwInf") as HTMLElement
            this.confirmPwInput = document.querySelector(".confirmPassword") as HTMLInputElement
            this.confirmPwInf = document.querySelector(".confirmPwInf") as HTMLElement
            this.loginTab = document.querySelector(".login-Tab") as HTMLElement
            this.loginBtn = document.querySelector(".loginBtn") as HTMLElement
            this.loginPart = document.querySelector(".loginPart") as HTMLElement
            this.loginAccountInput = document.querySelector(".loginAccount") as HTMLInputElement
            this.loginAccountInf = document.querySelector(".loginAccountInf") as HTMLElement
            this.loginPasswordInput = document.querySelector(".loginPassword") as HTMLInputElement
            this.loginPwInf = document.querySelector(".loginPwInf") as HTMLElement
            this.bindEvent()
        }
        if(this.status == "signup"){
            console.log(1)
            this.renderSignup()
        }else{
            this.renderLogin()
        }
    }

    public bindEvent(){
        this.loginTab.addEventListener("click",()=>{
            this.status = "login"
            this.loginTab.className = "login-Tab clicked"
            this.signupTab.className = "signup-Tab"
            this.render()
        })
        this.signupTab.addEventListener("click",()=>{
            this.status = "signup"
            this.signupTab.className = "signup-Tab clicked"
            this.loginTab.className = "login-Tab"
            this.render()
        })
        this.signupBtn.addEventListener("click",()=>{
            this.signupBtn.style.opacity = "0.6"
            setTimeout(()=>{
                this.signupBtn.style.opacity = "1"
            },50)
            this.sendSignupData()
        })
        this.loginBtn.addEventListener("click",()=>{
            this.loginBtn.style.opacity = "0.6"
            setTimeout(()=>{
                this.loginBtn.style.opacity = "1"
            },50)
            this.sendloginData()
        })

        this.signupAccountInput.addEventListener("keydown",(e)=>{
            if(e.keyCode === 13 && this.signupAccountInput.value != ""){
                this.signupAccount = this.signupAccountInput.value
            }
        })

        this.signupPasswordInput.addEventListener("keydown",(e)=>{
            if(e.keyCode === 13 && this.signupPasswordInput.value != ""){
                this.signupPassword = this.signupPasswordInput.value
            }
        })
        this.confirmPwInput.addEventListener("keydown",(e)=>{
            if(e.keyCode === 13 && this.confirmPw == this.signupPassword){
                this.confirmPwStatus = true
            }
        })
        this.loginAccountInput.addEventListener("keydown",(e)=>{
            if(e.keyCode === 13 && this.loginAccountInput.value != ""){
                this.loginAccount = this.loginAccountInput.value
                console.log("loginA")
            }
        })

        this.loginPasswordInput.addEventListener("keydown",(e)=>{
            if(e.keyCode === 13 && this.loginPasswordInput.value != ""){
                this.loginPassword = this.loginPasswordInput.value
                console.log("loginP")
            }
        })               
    }

    public renderSignup(){
        this.loginPart.style.display = "none"
        this.signupPart.style.display = "block"
    }

    public renderLogin(){
        this.signupPart.style.display = "none"
        this.loginPart.style.display = "block"
    }

    public sendSignupData(){
        let xml = new XMLHttpRequest()
        this.signupdata = {
            account:this.signupAccount,
            password:this.signupPassword
        }
        let signupData = JSON.stringify(this.signupdata)
        console.log(signupData)
        xml.open("post","/signup")
        xml.setRequestHeader("content-type","application/json")
        xml.send(signupData)
        xml.onreadystatechange=()=>{
            console.log(xml.readyState)
            console.log(xml.status)
        }
    }

    public sendloginData(){
        let xml = new XMLHttpRequest()
        this.logindata = {
            account:this.loginAccount,
            password:this.loginPassword
        }
        let loginData = JSON.stringify(this.logindata)
        xml.open("post","/login")
        console.log(loginData)
        xml.send(loginData)
        xml.onreadystatechange=()=>{
            if(xml.readyState == 4 &&xml.status ==200){
                window.location.href = xml.responseText
            }
            console.log(xml.readyState)
            console.log(xml.status)
        }
    }

    // public submitSignupData(){
    //     let xml = new XMLHttpRequest()
    //     xml.

    // }

    // public submitLoginData(){

    // }

}

window.onload=()=>{
    let loginpage = new LoginPage()
}