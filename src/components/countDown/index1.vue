<template>
  <div>
    <slot :date="date"></slot>
  </div>
</template>

<script>
/*
  问题
    去到其他页面之后再回来，倒计时的分秒数不正确
      切换页面后,浏览器为了降低性能 ,会自动延长定时器的时间间隔,导致误差越来越大
        
*/
import { requestAnimationFraeme, cancleAnimationFrame } from "utils/requestAnimationFrame"
const COUNTDOWN = "__SMS_total_time__";
export default {
  name: "CountDown",
  props: {
    time: {
      type: [Date, String, Number],
      default: () => new Date(),
    },
    isSMSMode: {
      type: Boolean,
      default: false,
    },
    totalTime: {
      type: [Number, String],
      default: 0,
    },
  },
  created() {
    if (!this.isSMSMode || localStorage.getItem(COUNTDOWN) > 0) {
      this.start();
    }
  },
  beforeDestroy() {
    localStorage.removeItem(COUNTDOWN);
    this.pause();
  },
  data() {
    return {
      date: {
        year: 0,
        month: 0,
        date: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        leftDuration: localStorage.getItem(COUNTDOWN) || this.totalTime,
      },
    };
  },
  methods: {
    start() {
      !this.timer && this.initTime();
    },
    pause() {
      clearTimeout(this.timer);
      this.timer = null
    },
    isType(target) {
      return (type) =>
        Object.prototype.toString.call(target) === `[object ${type}]`;
    },
    initTime() {
      if (this.isSMSMode && this.date.leftDuration > 0) {
        this.subSetInterval((timer) => {
          localStorage.setItem(COUNTDOWN, (this.date.leftDuration -= 1));
          this.timer = timer;
          if (Number(localStorage.getItem(COUNTDOWN)) === 0) {
            this.$emit("end");
            this.pause();
            localStorage.removeItem(COUNTDOWN);
          }
        }, 1000);
      } else {
        let time,diff;
        let isType = this.isType(this.time);
        if (isType("Date")) {
          time = this.time;
        } else if (isType("String")) {
          ["-", "."].forEach((item) => {
            if (this.time.includes(item)) {
              //月份-1
              const temp = this.time.split(item);
              temp[1] = temp[1] - 1;
              time = new Date(...temp);
            }
          });
        } else if (isType("Number")) {
          this.time.toString().length === 13 && (time = new Date(this.time));
        }

        this.subSetInterval((timer) => {
          time -= 1000;
          this.timer = timer;
          if (time <= 0) {
            this.$emit("end");
            this.pause();
          }
          this.normalizeTime(time);
        }, 1000);
      }
    },
    normalizeTime(time) {
      const timeUnits = [
        ["year", 1000 * 60 * 60 * 24 * 365], // years
        ["month", 1000 * 60 * 60 * 24 * 30], // months
        ["date", 1000 * 60 * 60 * 24], // days
        ["hours", 1000 * 60 * 60], // hours
        ["minutes", 1000 * 60], // minutes
        ["seconds", 1000], // seconds
      ];

      timeUnits.reduce((current, [name, unit]) => {
        if(typeof this.date[name] != "undefined"){
          const value = Math.floor(time / unit);
          time -= value * unit;

          this.date[name] = value.toString().padStart(2, 0);
          return this.date;
        }
      }, this.date);
    },
    subSetInterval(fn, delay) {
      let timer;
      const loop = (fn, delay) => {
        timer = setTimeout(() => {
          loop(fn, delay);
          fn.call(this, timer);
        }, delay);
      };
      loop(fn, delay);
    },
  },
};
</script>

<style>
</style>