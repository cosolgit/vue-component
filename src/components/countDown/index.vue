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
import { requestAnimationFraeme, cancleAnimationFrame } from "utils/requestAnimationFrame";
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
        leftDuration: this.totalTime || 0,
      },
      value: 0,
    };
  },
  methods: {
    start() {
      !this.timer && this.initTime();
    },
    pause() {
      cancelAnimationFrame(this.timer);
      this.timer = null;
      Object.assign(this.$data, this.$options.data());
    },
    isType(target) {
      return type => Object.prototype.toString.call(target) === `[object ${type}]`;
    },
    initTime() {
      let time,
        count = () => {
          if (this.isSMSMode) {
            if (this.date.leftDuration >= 0) {
              time = this.value - Date.now();
              this.date.leftDuration = parseInt(time / 1000);
            }
          } else {
            time = this.value.getTime() - Date.now();
            this.normalizeTime(time);
          }

          if (time > 0) {
            this.timer = requestAnimationFraeme(count);
          } else {
            this.$emit("end");
            this.pause();
          }
        };

      if (this.isSMSMode && this.date.leftDuration > 0) {
        this.value = Date.now() + this.date.leftDuration * 1000;
      } else {
        let isType = this.isType(this.time);
        if (isType("Date")) {
          this.value = this.time;
        } else if (isType("String")) {
          ["-", "."].forEach(item => {
            if (this.time.includes(item)) {
              //月份-1
              const temp = this.time.split(item);
              temp[1] = temp[1] - 1;
              this.value = new Date(...temp);
            }
          });
        } else if (isType("Number")) {
          this.time.toString().length === 13 && (this.value = new Date(this.time));
        }
      }

      this.timer = requestAnimationFraeme(count);
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
        if (typeof this.date[name] != "undefined") {
          const value = Math.floor(time / unit);
          time -= value * unit;

          this.date[name] = value.toString().padStart(2, 0);
          return this.date;
        }
      }, this.date);
    },
  },
};
</script>

<style></style>
