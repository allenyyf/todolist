class Item{
    public status:"todo" | "done" = "todo"
    public el:HTMLElement
    public iconGou:Element
    public iconCha:Element
    public tabIconGou:Element
    public inputBox:HTMLInputElement
    public todolist:TodoList
    public transformed:boolean = false
    public _id:string
    public template:string = `<div class="item"><span class="left"><i class="iconfont icon-duigou hide"></i></span>
        <input type="text" class="content" value="">
        <span class="right"><i class="iconfont icon-cha"></i></span></div>`
    public content:string
    constructor(){
        this.render()
    }
    public bindEvents(){
        this.tabIconGou.addEventListener("click",()=>{
            if(this.status == "todo"){
                this.status = "done"
            }else if(this.status == "done"){
                this.status = "todo"
            }
            this.render()
            this.todolist.render()

        })
        this.iconCha.addEventListener("click",()=>{
            this.todolist.removeItem(this)
            // this.todolist.removeDbItem(this)
        })
        
        this.inputBox.addEventListener("keydown",(e)=>{
            const keyUp = 38
            if(e.keyCode === keyUp){
                this.todolist.focusAt(this,-1)
            }else if(e.keyCode === 40){
                this.todolist.focusAt(this,1)
            }else if(e.keyCode === 13){
                this.toggle()          
            }
        })
    }

    public toggle(){
        if(this.status === "done"){
            this.undone()
        }else{
            this.done()
        }
    }

    public done(){
        this.status = "done"
        this.content = this.inputBox.value
        this.render()
        this.todolist.render()
    }

    public undone(){
        this.status = "todo"
        this.content = this.inputBox.value
        this.render()
        this.todolist.render()
    }
    public render(){
        if(!this.el){
            let wrap = document.createElement("div")
            wrap.innerHTML = this.template
            this.el = wrap.children[0] as HTMLElement
            this.iconGou = this.el.querySelector(".icon-duigou")
            this.iconCha = this.el.querySelector(".icon-cha")
            this.inputBox = this.el.querySelector(".content") as HTMLInputElement
            this.tabIconGou = this.el.querySelector(".left")
            this.bindEvents()
        }
        this.inputBox.value = this.content || ""
        if(this.status == "done"){
            this.iconGou.className = "iconfont icon-duigou"
            this.inputBox.className = "content delstyle"
        }else if(this.status == "todo"){
            this.iconGou.className = "iconfont icon-duigou hide"
            this.inputBox.className = "content"
        }
    }

    public setContent(value:string){
        this.content = value
        this.render()
    }
}

class TodoList{
    public tabAll = document.querySelector(".all") as HTMLElement
    public tabActive = document.querySelector(".active") as HTMLElement
    public tabCompleted:HTMLElement = document.querySelector(".completed") as HTMLElement
    public tabClearCompleted:Element = document.querySelector(".clearcompleted")
    public labelItemLeft:Element = document.querySelector(".number")
    public tabCompletedAll:HTMLElement = <HTMLElement>document.querySelector(".icon-jiantouxia")
    public todoInput:HTMLInputElement = <HTMLInputElement>document.querySelector("#inputItem")
    public listContainer:Element = document.querySelector(".container")
    public items:Item[]
    public filter:{(items:Item[]):Item[]}
    public currentTab:HTMLElement
    public tabs:HTMLElement[]
    public activeTab:string

    constructor(){
        this.bindEvents()
        this.items = []
        this.filter = ()=>{return this.items}
        this.currentTab =this.tabAll
        this.tabs = [this.tabAll,this.tabActive,this.tabCompleted]
    }
    public focusAt(item:Item,offset:number = 0){
        let currentItemNum = this.items.indexOf(item)
        if(this.items[currentItemNum + offset]){
            item.inputBox.blur()
            this.items[currentItemNum + offset].inputBox.focus()
        }
    }

    public bindEvents(){
        this.tabAll.addEventListener("click",this.onClickTabAll.bind(this))
        this.tabCompleted.addEventListener("click",this.onClickTabCompleted.bind(this))
        this.tabClearCompleted.addEventListener("click",this.onClickTabClearComplete.bind(this))
        this.tabActive.addEventListener("click",this.onClickTabActive.bind(this))
        this.tabCompletedAll.addEventListener("click",this.onClickTabCompletedAll.bind(this))
        this.todoInput.addEventListener("keydown",(e)=>{
            if(e.keyCode == 13 && this.todoInput.value !== ""){
                this.createItemByInput()
            }
        })
    }

    public render(){
        let items = this.filter(this.items)
        this.listContainer.innerHTML = ""
        for(let item of items){
            this.listContainer.appendChild(item.el)
        }
        this.setCurrentTab()
        this.setItemLeftNum()
    }

    public transformItemData(){
        let xmlhttp = new XMLHttpRequest()
        let items:any[]= []
        let itemData = {}
        let tabNumber = this.tabs.indexOf(this.currentTab)
        this.items.forEach((item)=>{
            itemData = {
                value:item.inputBox.value,
                status:item.status
            }
            items.push(itemData)
        })
        let itemsData = {
            _id : "123456",
            data: items,
            tabNum:tabNumber
        }

        let itemsDataJson = JSON.stringify(itemsData)
        xmlhttp.open("POST","data")
        xmlhttp.setRequestHeader("content-type","application/json")
        xmlhttp.send(itemsDataJson)
    }



    public fromDbDate(){
        console.log("get server data")
        let xmlhttp = new XMLHttpRequest()
        xmlhttp.open("GET","data")
        xmlhttp.send()
        xmlhttp.onreadystatechange = ()=>{
            if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
                let itemsData = JSON.parse(xmlhttp.responseText)[0]
                if(itemsData){
                    this.setTodoListData(itemsData)
                }    
            }   
        } 
    }

    public setTodoListData(itemsData:any){
        for(let i =0;i<itemsData.data.length;i++){
            let item = new Item()
            item.setContent(itemsData.data[i].value)
            item.status = itemsData.data[i].status
            item.render()
            item.todolist = this
            this.items.push(item)
        }
        this.currentTab = this.tabs[itemsData.tabNum]
        if(this.tabs[itemsData.tabNum] == this.tabActive){
            this.onClickTabActive()
        }else if(this.tabs[itemsData.tabNum] == this.tabCompleted){
            this.onClickTabCompleted()
        }
        this.render()
    }


    public createItemByInput(){
        let item = new Item()
        item.setContent(this.todoInput.value)
        item.todolist = this
        this.todoInput.value = ""
        this.items.push(item)
        this.render()
    }

    public onClickTabAll(){
        this.filter = ()=>{return this.items}
        this.currentTab = this.tabAll
        this.render()
    }
    public onClickTabActive(){
        this.filter = (items:Item[] = this.items)=>{
            let result:Item[] = []
            for(let item of items){
                if(item.status === "todo")result.push(item)
            }
            return result;
        }
        this.currentTab = this.tabActive
        this.render()
    }
    public onClickTabCompleted(){
        this.filter = (items:Item[])=>{
            return items.filter((item)=>{
                return item.status === "done"
            })
        }
        this.currentTab = this.tabCompleted
        this.render()

    }
    public onClickTabClearComplete(){
        this.items = this.items.filter((item)=>{
            return item.status !== "done"
        })
        this.render()
    }
    public removeItem(item:Item){
        let removeItemNum = this.items.indexOf(item)
        this.items.splice(removeItemNum,1)
        this.render()
    }
    public onClickTabCompletedAll(){
        let allDone:boolean = this.items.every((item)=>{
            return item.status === "done"
        })
        for(let item of this.items){
            if(allDone){
                item.status = "todo"
            }else{
                item.status = "done"
            }
            item.render()
            // item.status = allDone && "todo" || "done"
        }
        this.render()
    }


    public setCurrentTab(tab?:HTMLElement){
        if(tab)this.currentTab = tab
        this.tabs.forEach((tab)=>{
            tab.style.border = ""
            tab.style.background = ""
        })
        this.currentTab.style.border = "1px solid #ccc"
        this.currentTab.style.background = "#999"
    }

    public setItemLeftNum(){
        let itemleftNum = 0
        this.items.forEach((item)=>{
            if(item.status == "todo"){
                itemleftNum++
            }
        })
        this.labelItemLeft.innerHTML =`${itemleftNum} itemleft`
    }

    public sendDataToDB(){
        setInterval(()=>{
            this.transformItemData()
            console.log("update db")
        },60000)
    }
}


window.onload = ()=>{
    let todolist = new TodoList()
    todolist.fromDbDate()
    todolist.sendDataToDB()
}



    // public setLocalStorageDate(){
    //     let itemsValue:any[] = []
    //     let itemsStatus:any[] = []
    //     this.items.forEach((item)=>{
    //         itemsValue.push(item.inputBox.value)
    //         itemsStatus.push(item.status)
    //     })
    //     let itemsValueString = JSON.stringify(itemsValue)
    //     let itemsStatusString = JSON.stringify(itemsStatus)
    //     let tabNumber = this.tabs.indexOf(this.currentTab)
    //     localStorage.setItem("itemsValue",itemsValueString)
    //     localStorage.setItem("itemsStatus",itemsStatusString)
    //     localStorage.setItem("tabNumber",tabNumber.toString())
    // }

    // public fromStorage(){

    //     let itemsValue = JSON.parse(localStorage.getItem("itemsValue"))
    //     let itemsStatus = JSON.parse(localStorage.getItem("itemsStatus"))
    //     let tabNumber = parseInt(localStorage.getItem("tabNumber"))
    //     let selectedTab = this.tabs[tabNumber]
    //     if(localStorage.getItem("itemsValue")){
    //         this.setTodoList(itemsValue,itemsStatus,selectedTab)
    //     }
    // }

    //     public setTodoList(itemsValue:any[],itemsStatus:any[],selectedTab:HTMLElement){
    //     for(let i=0;i<itemsValue.length;i++){
    //         let item = new Item()
    //         item.setContent(itemsValue[i])
    //         item.status = itemsStatus[i]
    //         item.render()
    //         item.todolist = this
    //         this.items.push(item)
    //     }
    //     this.currentTab = selectedTab
    //     if(selectedTab == this.tabActive){
    //         this.onClickTabActive()
    //     }else if(selectedTab == this.tabCompleted){
    //         this.onClickTabCompleted()
    //     }
    //     this.render()
    // }


        // public transformItemData(){
    //     let xmlhttp = new XMLHttpRequest()
    //     let itemsData:any[]= []
    //     let itemData = {}
    //     this.items.forEach((item)=>{            
    //         if(item._id){
    //             itemData = {
    //                 "value":item.inputBox.value,
    //                 "status":item.status,
    //                 "_id":"itemDatas"
    //             }
    //         }else{
    //             if(!item.transformed){
    //                 itemData = {
    //                 "value":item.inputBox.value,
    //                 "status":item.status
    //                 }
    //             }
    //         }
    //         item.transformed = true
    //         itemsData.push(itemData)
    //     })
    //     let itemsDataString = JSON.stringify(itemsData)
    //     xmlhttp.open("POST","data")
    //     xmlhttp.setRequestHeader("content-type","application/json")
    //     xmlhttp.send(itemsDataString)
    //     console.log(itemsDataString)
    // }


    // public transformTabData(){
    //     let xmlhttp = new XMLHttpRequest()
    //     let tabNumber = this.tabs.indexOf(this.currentTab)
    //     xmlhttp.open("POST","tabData")
    //     xmlhttp.send(tabNumber)
    // }


        // public removeDbItem(item:Item){
    //     let itemId = {removeItemId:item._id}
    //     let removeItemId = JSON.stringify(itemId)
    //     let xmlhttp = new XMLHttpRequest()
    //     xmlhttp.open("POST","removeData")
    //     xmlhttp.setRequestHeader("content-type","application/json")
    //     xmlhttp.send(removeItemId)
    // }