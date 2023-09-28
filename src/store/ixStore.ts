import { defineStore } from "pinia";
import { Chapter, IObjectKeys } from "../interfaces";

export const useIxStore = defineStore("ix", {
  state() {
    return {
      id: 66236,
      chapters: [] as Chapter[],
      chapter: [] as string[],
      title: "",
      chapterIndex: -1,
      chapterModel: false,
      immersive: true,
      drawer: false,
      dark: false,
      font_size: 6,
      filter: "",
      reverse: false,
      fullscreen: false,
      lorem: "\u767e\u934a\u6210\u4ed9",
      cache: {} as IObjectKeys<any>,
      base: "https://ix-xi.vercel.app/api",
      debug: true,
      base_url: import.meta.env.BASE_URL,
    };
  },
  actions: {
    dlog(...data: any[]) {
      if (this.debug) console.log(...data);
    },
    toggleRightDrawer() {
      this.drawer = !this.drawer;
    },
    toggleReverse() {
      this.reverse = !this.reverse;
    },
    toggleDark() {
      this.dark = !this.dark;
    },
    toggleDebug() {
      this.debug = !this.debug;
    },
    size(n: number) {
      var fs = this.font_size + n;
      if (fs > 7) fs = 7;
      if (fs < 1) fs = 1;
      this.font_size = fs;
      this.dlog("fontsize", this.font_size);
    },
    async fetchChapters(b: number) {
      const url = `${this.base}/l/${b}`;
      try {
        const resp = await fetch(url).then((r) => r.json());
        this.chapters = resp.data;
        return (resp.data ? resp.data : []) as Chapter[];
      } catch (e) {
        throw e;
      }
    },
    prev() {
      var i = this.chapterIndex;
      i -= 1;
      if (i < 0) i = 0;
      this.chapterIndex = i;
      return i;
    },
    next() {
      var i = this.chapterIndex;
      i += 1;
      if (i > this.chapters.length - 1) i = this.chapters.length - 1;
      this.chapterIndex = i;
      return i;
    },
    async apply(cb?: Function) {
      this.title = this.chapters[this.chapterIndex - 1].title;
      this.dlog("ix", this);
      try {
        await this.fetchChapter(
          this.id,
          this.title,
          this.chapterIndex,
          this.drawer,
          cb
        );
        const reg = /\/(\w+)$/;
        if (reg.test(window.location.pathname)) {
          window.history.pushState(
            {},
            "",
            window.location.pathname.replace(reg, "/" + this.chapterIndex)
          );
        }
      } finally {
        if (cb) cb();
      }
    },
    toggleImmersive() {
      this.immersive = !this.immersive;
    },
    async swipe(direction: string) {
      if (direction === "right") this.prev();
      if (direction === "lefft") this.next();
      this.apply();
    },
    async fetchChapter(
      b: number,
      t: string,
      i: number,
      d?: boolean,
      cb?: Function
    ) {
      this.chapterModel = false;
      const _fromCache = async (u: string) =>
        u in this.cache ? this.cache[u] : await fetch(u).then((r) => r.json());
      try {
        const url = `${this.base}/l/${b}/c/${i}`;
        const resp = await _fromCache(url);
        this.chapter = resp;
        if (t) {
          this.chapter = resp;
          this.title = t;
          this.chapterIndex = i;
          this.chapterModel = true;
          if (d !== undefined) {
            this.drawer = d;
          }
        }
        if (cb) cb();
        {
          try {
            var _cache = { [url]: resp };
            if (i + 1 < this.chapters.length) {
              const url = `${this.base}/l/${b}/c/${i + 1}`;
              const resp = await _fromCache(url);
              _cache = { ..._cache, ...{ [url]: resp } };
            }
            if (i - 1 >= 0) {
              const url = `${this.base}/l/${b}/c/${i - 1}`;
              const resp = await _fromCache(url);
              _cache = { ..._cache, ...{ [url]: resp } };
            }
            this.cache = _cache;
          } catch (e) {
            throw e;
          }
        }
      } catch (e) {
        throw e;
      } finally {
        if (cb) cb();
      }
    },
  },
  getters: {
    isLastChapter(state) {
      return state.chapterIndex === state.chapters.length - 1;
    },
    isFirstChapter(state) {
      return state.chapterIndex === 0;
    },
    getChapters(state) {
      var ret = state.chapters;
      const _filter = state.filter;
      if (_filter) {
        ret = ret.filter(
          (c) =>
            c.ordernum.indexOf(_filter) > -1 || c.title.indexOf(_filter) > -1
        );
      }
      return ret;
    },
  },
  persist: {
    key: "ix",
  },
});
