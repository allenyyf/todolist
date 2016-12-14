var Item = (function () {
    function Item() {
        this.status = "todo";
        this.template = "<div class=\"item\"><span class=\"left\"><i class=\"iconfont icon-duigou hide\"></i></span>\n        <input type=\"text\" class=\"content\" value=\"\">\n        <span class=\"right\"><i class=\"iconfont icon-cha\"></i></span></div>";
        this.render();
    }
    Item.prototype.bindEvents = function () {
        var _this = this;
        this.tabIconGou.addEventListener("click", function () {
            if (_this.status == "todo") {
                _this.status = "done";
            }
            else if (_this.status == "done") {
                _this.status = "todo";
            }
            _this.render();
            _this.todolist.render();
        });
        this.iconCha.addEventListener("click", function () {
            _this.todolist.removeItem(_this);
        });
        this.inputBox.addEventListener("keydown", function (e) {
            var keyUp = 38;
            if (e.keyCode === keyUp) {
                _this.todolist.focusAt(_this, -1);
            }
            else if (e.keyCode === 40) {
                _this.todolist.focusAt(_this, 1);
            }
            else if (e.keyCode === 13) {
                _this.toggle();
            }
        });
    };
    Item.prototype.toggle = function () {
        if (this.status === "done") {
            this.undone();
        }
        else {
            this.done();
        }
    };
    Item.prototype.done = function () {
        this.status = "done";
        this.content = this.inputBox.value;
        this.render();
        this.todolist.render();
    };
    Item.prototype.undone = function () {
        this.status = "todo";
        this.content = this.inputBox.value;
        this.render();
        this.todolist.render();
    };
    Item.prototype.render = function () {
        if (!this.el) {
            var wrap = document.createElement("div");
            wrap.innerHTML = this.template;
            this.el = wrap.children[0];
            this.iconGou = this.el.querySelector(".icon-duigou");
            this.iconCha = this.el.querySelector(".icon-cha");
            this.inputBox = this.el.querySelector(".content");
            this.tabIconGou = this.el.querySelector(".left");
            this.bindEvents();
        }
        this.inputBox.value = this.content || "";
        if (this.status == "done") {
            this.iconGou.className = "iconfont icon-duigou";
            this.inputBox.className = "content delstyle";
        }
        else if (this.status == "todo") {
            this.iconGou.className = "iconfont icon-duigou hide";
            this.inputBox.className = "content";
        }
    };
    Item.prototype.setContent = function (value) {
        this.content = value;
        this.render();
    };
    return Item;
}());
var TodoList = (function () {
    function TodoList() {
        var _this = this;
        this.tabAll = document.querySelector(".all");
        this.tabActive = document.querySelector(".active");
        this.tabCompleted = document.querySelector(".completed");
        this.tabClearCompleted = document.querySelector(".clearcompleted");
        this.labelItemLeft = document.querySelector(".number");
        this.tabCompletedAll = document.querySelector(".icon-jiantouxia");
        this.todoInput = document.querySelector("#inputItem");
        this.listContainer = document.querySelector(".container");
        this.bindEvents();
        this.items = [];
        this.filter = function () { return _this.items; };
        this.currentTab = this.tabAll;
        this.tabs = [this.tabAll, this.tabActive, this.tabCompleted];
    }
    TodoList.prototype.focusAt = function (item, offset) {
        if (offset === void 0) { offset = 0; }
        var currentItemNum = this.items.indexOf(item);
        if (this.items[currentItemNum + offset]) {
            item.inputBox.blur();
            this.items[currentItemNum + offset].inputBox.focus();
        }
    };
    TodoList.prototype.bindEvents = function () {
        var _this = this;
        this.tabAll.addEventListener("click", this.onClickTabAll.bind(this));
        this.tabCompleted.addEventListener("click", this.onClickTabCompleted.bind(this));
        this.tabClearCompleted.addEventListener("click", this.onClickTabClearComplete.bind(this));
        this.tabActive.addEventListener("click", this.onClickTabActive.bind(this));
        this.tabCompletedAll.addEventListener("click", this.onClickTabCompletedAll.bind(this));
        this.todoInput.addEventListener("keydown", function (e) {
            if (e.keyCode == 13 && _this.todoInput.value !== "") {
                _this.createItemByInput();
            }
        });
    };
    TodoList.prototype.render = function () {
        var items = this.filter(this.items);
        this.listContainer.innerHTML = "";
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            this.listContainer.appendChild(item.el);
        }
        this.setCurrentTab();
        this.setItemLeftNum();
        this.setLocalStorageDate();
        this.setDbData();
    };
    TodoList.prototype.setDbData = function () {
        var xmlhttp = new XMLHttpRequest();
        var data = new FormData();
        var itemsValue = [];
        var itemsStatus = [];
        this.items.forEach(function (item) {
            itemsValue.push(item.inputBox.value);
            itemsStatus.push(item.status);
        });
        var itemsValueString = JSON.stringify(itemsValue);
        var itemsStatusString = JSON.stringify(itemsStatus);
        data.append("itemsValue", itemsValueString);
        data.append("itemsStatus", itemsValueString);
        xmlhttp.open("post", "http://127.0.0.1:8080");
        xmlhttp.send(data);
        console.log(data);
    };
    TodoList.prototype.fromDbDate = function () {
    };
    TodoList.prototype.createItemByInput = function () {
        var item = new Item();
        item.setContent(this.todoInput.value);
        item.todolist = this;
        this.todoInput.value = "";
        this.items.push(item);
        this.render();
    };
    TodoList.prototype.onClickTabAll = function () {
        var _this = this;
        this.filter = function () { return _this.items; };
        this.currentTab = this.tabAll;
        this.render();
    };
    TodoList.prototype.onClickTabActive = function () {
        var _this = this;
        this.filter = function (items) {
            if (items === void 0) { items = _this.items; }
            var result = [];
            for (var _i = 0, items_2 = items; _i < items_2.length; _i++) {
                var item = items_2[_i];
                if (item.status === "todo")
                    result.push(item);
            }
            return result;
        };
        this.currentTab = this.tabActive;
        this.render();
    };
    TodoList.prototype.onClickTabCompleted = function () {
        this.filter = function (items) {
            return items.filter(function (item) {
                return item.status === "done";
            });
        };
        this.currentTab = this.tabCompleted;
        this.render();
    };
    TodoList.prototype.onClickTabClearComplete = function () {
        this.items = this.items.filter(function (item) {
            return item.status !== "done";
        });
        this.render();
    };
    TodoList.prototype.removeItem = function (item) {
        var removeItemNum = this.items.indexOf(item);
        this.items.splice(removeItemNum, 1);
        this.render();
    };
    TodoList.prototype.onClickTabCompletedAll = function () {
        var allDone = this.items.every(function (item) {
            return item.status === "done";
        });
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var item = _a[_i];
            if (allDone) {
                item.status = "todo";
            }
            else {
                item.status = "done";
            }
            item.render();
        }
        this.render();
    };
    TodoList.prototype.setCurrentTab = function (tab) {
        if (tab)
            this.currentTab = tab;
        this.tabs.forEach(function (tab) {
            tab.style.border = "";
            tab.style.background = "";
        });
        this.currentTab.style.border = "1px solid #ccc";
        this.currentTab.style.background = "#999";
    };
    TodoList.prototype.setItemLeftNum = function () {
        var itemleftNum = 0;
        this.items.forEach(function (item) {
            if (item.status == "todo") {
                itemleftNum++;
            }
        });
        this.labelItemLeft.innerHTML = itemleftNum + " itemleft";
    };
    TodoList.prototype.setLocalStorageDate = function () {
        var itemsValue = [];
        var itemsStatus = [];
        this.items.forEach(function (item) {
            itemsValue.push(item.inputBox.value);
            itemsStatus.push(item.status);
        });
        var itemsValueString = JSON.stringify(itemsValue);
        var itemsStatusString = JSON.stringify(itemsStatus);
        localStorage.setItem("itemsValue", itemsValueString);
        localStorage.setItem("itemsStatus", itemsStatusString);
        localStorage.setItem("selectedTab", this.currentTab.className);
    };
    TodoList.prototype.fromStorage = function () {
        var itemsValue = JSON.parse(localStorage.getItem("itemsValue"));
        var itemsStatus = JSON.parse(localStorage.getItem("itemsStatus"));
        var selectedTabClassName = "." + localStorage.getItem("selectedTab");
        var selectedTab = document.querySelector(selectedTabClassName);
        if (localStorage.getItem("itemsValue")) {
            this.setTodoList(itemsValue, itemsStatus, selectedTab);
        }
    };
    TodoList.prototype.setTodoList = function (itemsValue, itemsStatus, selectedTab) {
        for (var i = 0; i < itemsValue.length; i++) {
            var item = new Item();
            item.setContent(itemsValue[i]);
            item.status = itemsStatus[i];
            item.render();
            item.todolist = this;
            this.items.push(item);
        }
        this.currentTab = selectedTab;
        if (selectedTab == this.tabActive) {
            this.onClickTabActive();
        }
        else if (selectedTab == this.tabCompleted) {
            this.onClickTabCompleted();
        }
        this.render();
    };
    return TodoList;
}());
window.onload = function () {
    var todolist = new TodoList();
    todolist.fromStorage();
};
//# sourceMappingURL=main.js.map