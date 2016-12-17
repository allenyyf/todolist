
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
                <input class = "signupAccount" type = "text" name = "sigupAccount" placeholder = "注册账户名称" autocomplete="off"/>
                <span class = "signupAccountInf"></span>
                <input class = "signupPassword" type = "password" name = "sigupPw" placeholder = "密码(不少于6位)" autocomplete="off"/>
                <span class = "signupPwInf"></span>
                <input class = "confirmPassword" type = "password" name = "confirmPw" placeholder = "再次输入密码" autocomplete="off"/>
                <span class = "ConfirmPwInf"></span>
                <div class ="signupBtn">注册</div>
            </form>
            <div class = "error-btn"><p>请将注册信息按照</p><p>正确的提示填写完整</p></div>
            <form class = "loginPart" action="http://127.0.0.1:8080/login" method = "post">
                <input class = "loginAccount" type = "text" name = "loginAccount" placeholder = "账户名称" autocomplete="off"/>
                <span class = "loginAccountInf"></span>
                <input class = "loginPassword" type = "password" name = "loginPw" placeholder = "密码" autocomplete="off"/>
                <span class = "loginPwInf"></span>
                <div class = "loginBtn">登录</div>
            </form>
            </div>
        </div>`
        public signupAccount:string
        public signupPassword:string
        public confirmPw:string
        public signupAcStatus:boolean = false
        public signupPwStatus:boolean = false
        public confirmPwStatus:boolean = false
        public signupdata:userInf
        public loginAccount:string
        public loginPassword:string
        public loginAcStatus:boolean = false
        public loginPwStatus:boolean = false
        public logindata:userInf
        public errorText:HTMLElement

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
            this.signupAccountInf =   document.querySelector(".signupAccountInf") as HTMLElement
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
            this.errorText = document.querySelector(".error-btn") as HTMLElement
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
            if(this.signupAcStatus && this.confirmPwStatus && this.signupPwStatus){
                this.sendSignupData()
                this.clearInput()
            }else{
                this.errorText.className = "error-btn show"     
            }

        })

        this.errorText.addEventListener("click",()=>{
            this.errorText.className = "error-btn"
        })

        this.loginBtn.addEventListener("click",()=>{
            this.loginBtn.style.opacity = "0.6"
            setTimeout(()=>{
                this.loginBtn.style.opacity = "1"
            },50)
            if(this.loginAcStatus == true && this.loginPwStatus == true){
                this.sendloginData()
            }
            console.log(this.loginAcStatus,this.loginPwStatus)
        })

        this.signupAccountInput.addEventListener("keydown",this.debounce(
            ()=>{
                if(this.signupAccountInput.value !== ""){
                    this.signupAccount = this.signupAccountInput.value
                    this.checkAccountIsexist(this.signupAccount)
                    console.log(this.signupAccount)
                }else{
                    this.signupAccountInf.innerHTML = ""
                }
            },500),true
        )

        this.signupPasswordInput.addEventListener("keydown",this.debounce(
            ()=>{
                this.signupPwStatus = false
                if(this.signupPasswordInput.value.length >= 6){
                    this.signupPassword = this.signupPasswordInput.value
                    this.signupPwInf.innerHTML = "您设置的密码很安全"
                    this.signupPwInf.style.color = "green"
                    this.signupPwStatus = true
                }else if(this.signupPasswordInput.value == "" ){
                    this.signupPwInf.innerHTML = ""
                }else{
                    this.signupPwInf.innerHTML = "密码长度小于6位不安全哦"
                    this.signupPwInf.style.color = "red"
                }
                this.render()
            },100),true
        )

        this.confirmPwInput.addEventListener("keydown",this.debounce(
            ()=>{
                this.confirmPw = this.confirmPwInput.value
                this.confirmPwStatus = false
                if(this.confirmPw == this.signupPassword){
                    this.confirmPwInf.innerHTML = "输入正确，请牢记"
                    this.confirmPwInf.style.color = "green"
                    this.confirmPwStatus = true
                }else if (this.confirmPwInput.value == ""){
                    this.confirmPwInf.innerHTML = ""
                }else{
                    this.confirmPwInf.innerHTML = "两次密码输入不一致"
                    this.confirmPwInf.style.color = "red"
                }
                this.render()
            },500),true
        )

        this.loginAccountInput.addEventListener("keydown",this.debounce(
            ()=>{
                if(this.loginAccountInput.value == ""){
                    this.loginAccountInf.innerHTML = ""
                }else{
                    this.loginAccount = this.loginAccountInput.value
                    this.checkAccountIsexist(this.loginAccount)
                }
            },200),true
        )

        this.loginPasswordInput.addEventListener("keydown",this.debounce(
            ()=>{
                this.loginPwStatus = false
                this.loginPwInf.innerHTML = ""
                if(this.loginPasswordInput.value !== "" && this.loginPasswordInput.value.length >=6){
                    this.loginPassword = this.loginPasswordInput.value
                    this.loginPwStatus = true
                    console.log(this.loginPwStatus)
                }else if(this.loginPasswordInput.value == ""){
                    this.loginPwInf.innerHTML = "请输入密码"
                }else{
                    this.loginPwInf.innerHTML = "请输入正确的密码格式"
                    this.loginPwInf.style.color = "red"
                }
                this.render()
            },500),true
        )
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
            if(xml.readyState == 4 && xml.status == 200){
                console.log(xml.response)
            }
        }
    }

    public checkAccountIsexist(userAccount:string){
        let xml = new XMLHttpRequest()
        let account = {account:userAccount}
        let Account = JSON.stringify(account)
        xml.open("post","/signupAccount")
        xml.setRequestHeader("content-type","application/json")
        xml.send(Account)
        xml.onreadystatechange=()=>{
            if(xml.readyState == 4 && xml.status == 200){
                if(userAccount == this.signupAccount){
                    this.signupAcStatus = false
                    this.signupAccountInf.innerHTML = ""
                    if(xml.responseText == "账户已存在"){
                        this.signupAccountInf.innerHTML = "账户已存在"
                        this.signupAccountInf.style.color = "red"
                    }else if(xml.responseText == "账户名未注册"){
                        this.signupAccountInf.innerHTML = "账户可用"
                        this.signupAccountInf.style.color = "green"
                        this.signupAcStatus = true
                    }
                }else if(userAccount == this.loginAccount){
                    this.loginAcStatus = false
                    this.loginAccountInf.innerHTML = ""
                    if(xml.responseText == "账户已存在"){
                        this.loginAccountInf.innerHTML = "success"
                        this.loginAccountInf.style.color = "green"
                        this.loginAcStatus = true
                    }else if(xml.responseText == "账户名未注册"){
                        this.loginAccountInf.innerHTML = "账户未注册，请先注册"
                        this.loginAccountInf.style.color = "red"
                    }
                }
                this.render()
            }
        }      
    }

    public sendloginData(){
        let xml = new XMLHttpRequest()
        this.logindata = {
            account:this.loginAccount,
            password:this.loginPassword
        }
        let loginData = JSON.stringify(this.logindata)
        xml.open("post","/login",true)
        xml.setRequestHeader("content-type","application/json")
        xml.send(loginData)
        xml.onreadystatechange=()=>{
            if(xml.readyState == 4 &&xml.status ==200){
                if(xml.responseText == "password is wrong"){
                    this.pwErrorMessage()
                }else if(xml.responseText == "password is wrong"){

                }
            }else{
                console.log(xml.status)
            }
        }
    }

    public debounce(fn:()=>any, delay:number){
        let timer:any
        return ()=>{
            clearTimeout(timer)
            timer = setTimeout(()=>{fn()}, delay)
        }
    }

    public clearInput(){
        this.signupAccountInput.value = ""
        this.signupAccount = ""
        this.signupAccountInf.innerHTML = ""
        this.signupAcStatus = false

        this.signupPasswordInput.value = ""
        this.signupPassword = ""
        this.signupPwInf.innerHTML = ""
        this.signupPwStatus = false

        this.confirmPwInput.value = ""
        this.confirmPw = ""
        this.confirmPwInf.innerHTML = ""
        this.confirmPwStatus = false
        this.render()
    }

    public pwErrorMessage(){
        this.loginPwInf.innerHTML = "密码错误,请重新输入"
        this.loginPwStatus = false
        this.loginPwInf.style.color = "red"
        this.render()
    }
}

window.onload=()=>{
    let loginpage = new LoginPage()
}


