<template>
    <div class="wrap" ref="wrap">
        <img
            ref="img"
            :src="src"
            class="img"
            :width="imgWidth"
            :draggable="false"
            @click="handleVoidClick"
            @contextmenu.prevent="handleContextmenu"
        />
        <div class="label-list" v-show="isHideLabels">
            <div
                :key="item.id"
                class="label-item"
                ref="label-item"
                :draggable="true"
                @dblclick="handleDoubleClick"
                v-for="(item, index) in labels"
                @click="handleRemoveLabel(index)"
                @dragend="onDragend($event, index)"
                @dragstart="onDragstart($event, index)"
                :style="{ left: item.left + 'px', top: item.top + 'px' }"
            >
                <span class="label-text" @blur="handleBlur($event, index)">{{ item.text }}</span>
            </div>
        </div>
        <ul class="menu-list" v-show="isShowMenu" ref="menu" @click="hideMenu">
            <li
                :key="index"
                class="menu-item"
                @contextmenu.prevent
                @mouseenter="onMouseEnter"
                @mouseleave="onMouseLeave"
                @click="onMenuClick(item)"
                v-for="(item, index) in menus"
            >
                {{ item }}
            </li>
        </ul>
    </div>
</template>

<script>
import DomToImg from "dom-to-image";
const LABEL_HEIGHT = 30,
    TRIANGLE_HEIGHT = 5,
    CLOSE_BTN_BORDER = 6;
export default {
    name: "ImgLabel",
    props: {
        isShowSaveBtn: {
            type: Boolean,
            default: true,
        },
        src: {
            type: String,
            default: "",
        },
        imgWidth: {
            type: Number,
            default: 500,
        },
        theme: {
            type: String,
            default: "#3b8bcc",
        },
    },
    data: () => ({
        isHideLabels: true,
        menus: ["新建标签", "保存标签", "清除标签", "隐藏标签", "导出为图片"],
        isShowMenu: false,
        labels: JSON.parse(localStorage.getItem(`__labels__`)) || [],
    }),
    created() {
        this.pos = {};
        this.dragStart = {};
        !this.isShowSaveBtn && this.menu.splice(1, 1);
    },
    inject:["app"],
    mounted() {
        this.img = this.$refs["img"];
        this.menu = this.$refs["menu"];
        this.app.changeUserInfo("ccc")
    },
    methods: {
        onDragstart(e, index) {
            let bounding = this.img.getBoundingClientRect();
            this.dragStart.top = e.clientY - this.labels[index].top - bounding.top;
            this.dragStart.left = e.clientX - this.labels[index].left - bounding.left;
        },
        onDragend(e, index) {
            const bounding = this.img.getBoundingClientRect();
            const labelWidth = this.$refs["label-item"][index].clientWidth;
            const labelHeight = this.$refs["label-item"][index].clientHeight;

            let left = Math.max(
                0,
                Math.min(
                    e.clientX - bounding.left - this.dragStart.left,
                    bounding.width - labelWidth - CLOSE_BTN_BORDER
                )
            );
            let top = Math.max(
                0 + CLOSE_BTN_BORDER,
                Math.min(
                    e.clientY - bounding.top - this.dragStart.top,
                    bounding.height - labelHeight - CLOSE_BTN_BORDER
                )
            );

            Object.assign(this.labels[index], { top, left });
        },
        handleRemoveLabel(index) {
            this.timer && clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.labels.splice(index, 1);
                this.timer = null;
            }, 200);
        },
        handleDoubleClick(e) {
            this.timer && clearTimeout(this.timer);
            e.target.setAttribute("contenteditable", true);
            e.target.focus();

            if (document.selection) {
                let range = document.body.createTextRange();
                range.moveToElementText(e.target);
                range.select();
            } else if (window.getSelection) {
                const range = document.createRange();
                range.selectNodeContents(e.target);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
            }
        },
        handleBlur(e, index) {
            e.target.innerHTML === "" && this.labels.splice(index, 1);
            e.target.setAttribute("contenteditable", false);
            this.labels[index].text = e.target.innerText;
        },
        handleContextmenu(e) {
            let bounding = this.img.getBoundingClientRect();
            this.showMenu();
            this.$nextTick(() => {
                const left = Math.min(
                    e.clientX - bounding.left,
                    this.img.offsetWidth - this.menu.offsetWidth
                );
                const top = Math.min(
                    e.clientY - bounding.top,
                    this.img.offsetHeight - this.menu.offsetHeight
                );

                this.pos.left = left;
                this.pos.top =
                    e.clientY - bounding.top + LABEL_HEIGHT + TRIANGLE_HEIGHT >
                    this.img.offsetHeight
                        ? e.clientY - bounding.top - LABEL_HEIGHT - TRIANGLE_HEIGHT
                        : e.clientY - bounding.top + CLOSE_BTN_BORDER;
                this.menu.style.top = top + "px";
                this.menu.style.left = left + "px";
            });
        },
        handleVoidClick(e) {
            this.hideMenu();
        },
        onMenuClick(item) {
            switch (item) {
                case "新建标签":
                    this.createdLabel();
                    break;
                case "保存标签":
                    this.saveLabel();
                    break;
                case "清除标签":
                    this.clearLabel();
                    break;
                case "隐藏标签":
                case "显示标签":
                    this.hideLabel();
                    break;
                case "导出为图片":
                    this.exportImg();
                    break;
                default:
                    "";
            }
        },
        createdLabel() {
            this.labels.push({
                top: this.pos.top,
                left: this.pos.left,
                text: "新建标签",
                _id: new Date().getTime(),
            });
        },
        saveLabel() {
            localStorage.setItem("__labels__", JSON.stringify(this.labels));
        },
        clearLabel() {
            localStorage.removeItem("__labels__");
            this.labels = [];
        },
        hideLabel() {
            this.isHideLabels = !this.isHideLabels;
            if (this.labels.length === 0) return;
            this.menus[3] = this.menus[3] === "隐藏标签" ? "显示标签" : "隐藏标签";
            //this.menus.__ob__.dep.notify();
        },
        exportImg() {
            setTimeout(() => {
                DomToImg.toJpeg(this.$refs["wrap"]).then(dataUrl => {
                    let link = document.createElement("a");
                    link.download = this.getDate();
                    link.href = dataUrl;
                    link.click();
                });
            });
        },
        showMenu() {
            this.isShowMenu = true;
        },
        hideMenu() {
            this.isShowMenu = false;
        },
        onMouseEnter(e) {
            e.target.style.backgroundColor = this.theme;
            e.target.style.color = "#fff";
        },
        onMouseLeave(e) {
            e.target.style.backgroundColor = "#fff";
            e.target.style.color = "#000";
        },
        getDate() {
            let newDate = new Date();
            let [day, month, year] = [
                newDate.getDate(),
                newDate.getMonth() + 1,
                newDate.getFullYear(),
            ];
            month < 10 && (montn = `0${month}`);
            day < 10 && (day = `0${day}`);
            return `图片-${year}-${month}-${day}`;
        },
    },
};
</script>
<style scoped>
.wrap {
    position: relative;
    display: inline-block;
    border: 1px solid #ccc;
    background: #fff;
}
.img {
    display: block;
}

.label-item {
    color: #fff;
    background: RGBA(0, 0, 0, 0.35);
    position: absolute;
    cursor: pointer;
    user-select: none;
    transition: 0.3s all;
    border-radius: 5px;
}

.label-text {
    display: inline-block;
    padding: 7px 10px;
    outline: none;
}
.label-text:hover {
    background: RGBA(0, 0, 0, 0.5);
}
.label-text:hover:before {
    display: block;
    background: rgba(0, 0, 0, 1);
}
.label-text:hover:after {
    border-color: RGBA(0, 0, 0, 0.5) RGBA(0, 0, 0, 0) RGBA(0, 0, 0, 0);
}
.label-text::after {
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translate(-50%, 0);
    content: " ";
    display: block;
    width: 0;
    height: 0;
    transition: 0.3s all;
    border-width: 5px;
    border-style: solid;
    border-color: RGBA(0, 0, 0, 0.35) RGBA(0, 0, 0, 0) RGBA(0, 0, 0, 0);
}
.label-text::before {
    display: none;
    position: absolute;
    right: -6px;
    top: -6px;
    content: "x";
    width: 16px;
    height: 16px;
    line-height: 12px;
    font-size: 12px;
    text-align: center;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    transition: 0.3s all;
}
.menu-list {
    position: absolute;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
    background: #fff;
    overflow: hidden;
}
.menu-item {
    padding: 10px;
    font-size: 14px;
    transition: 0.2s all;
}
.menu-item + .menu-item {
    border-top: 1px solid #ccc;
}
</style>
