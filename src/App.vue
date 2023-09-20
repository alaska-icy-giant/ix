<template>
  <q-layout view="hHh lpR lFr">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          {{ ix.lorem }}
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="ix.drawer"
      side="right"
      bordered
      ref="rightDrawer"
      :width="500"
      :breakpoint="300"
    >
      <div class="row">
        <q-icon name="toc"></q-icon>
        <div>
          <span class="text-subtitle2"
            >Total {{ ix.chapters.length }} chapters</span
          >
        </div>
        <q-space />
        <q-input rounded dense flat v-model="ix.filter">
          <template v-slot:append>
            <q-icon
              v-if="ix.filter !== ''"
              name="close"
              @click="ix.filter = ''"
              class="cursor-pointer"
              size="xs"
            />
            <q-avatar icon="search" size="xs" />
          </template>
        </q-input>
        <q-btn dense flat size="sm" icon="text_increase" @click="ix.size(-1)" />
        <q-btn dense flat size="sm" icon="text_decrease" @click="ix.size(1)" />
        <q-btn
          dense
          flat
          size="sm"
          icon="swap_vertical_circle"
          @click="ix.toggleReverse"
        />
        <q-btn
          dense
          flat
          size="sm"
          :icon="ix.dark ? 'light_mode' : 'dark_mode'"
          @click="ix.dark = !ix.dark"
        />
        <q-btn
          v-if="false"
          dense
          flat
          size="sm"
          :icon="ix.fullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="ix.fullscreen = !ix.fullscreen"
        />
      </div>
      <q-virtual-scroll
        ref="virtualListRef"
        :style="`max-height: ${$q.screen.height - 90}px`"
        component="q-list"
        :items="ix.getChapters"
        separator
      >
        <template v-slot="{ item, index }">
          <q-item
            :key="index"
            dense
            clickable
            @click="
              () => {
                scrollToHeader();
                ix.chapterIndex = parseInt(item.ordernum) - 1;
                ix.apply(() => $q.loading.hide());
              }
            "
            :class="{ 'bg-black text-white': index === ix.chapterIndex }"
          >
            <q-item-section>
              <q-item-label> #{{ index }} - {{ item.title }} </q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-virtual-scroll>
      <!-- drawer content -->
      <div v-if="false">
        <div class="row">
          <q-icon name="toc"></q-icon>
          <div>
            <span class="text-subtitle2"
              >Total {{ ix.chapters.length }} chapters</span
            >
          </div>
          <q-space />
          <q-input rounded dense flat v-model="ix.filter">
            <template v-slot:append>
              <q-icon
                v-if="ix.filter !== ''"
                name="close"
                @click="ix.filter = ''"
                class="cursor-pointer"
                size="xs"
              />
              <q-avatar icon="search" size="xs" />
            </template>
          </q-input>
          <q-btn
            dense
            flat
            size="sm"
            icon="text_increase"
            @click="ix.size(-1)"
          />
          <q-btn
            dense
            flat
            size="sm"
            icon="text_decrease"
            @click="ix.size(1)"
          />
          <q-btn
            dense
            flat
            size="sm"
            icon="swap_vertical_circle"
            @click="ix.toggleReverse"
          />
          <q-btn
            dense
            flat
            size="sm"
            :icon="ix.dark ? 'light_mode' : 'dark_mode'"
            @click="ix.dark = !ix.dark"
          />
          <q-btn
            v-if="false"
            dense
            flat
            size="sm"
            :icon="ix.fullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="ix.fullscreen = !ix.fullscreen"
          />
        </div>
        <div v-for="(ch, n) in ix.getChapters" :key="n">
          <q-btn
            flat
            dense
            :color="
              `${ix.chapterIndex + 1}` === ch.ordernum ? 'info' : 'primary'
            "
            @click="
              () => {
                scrollToHeader();
                ix.chapterIndex = parseInt(ch.ordernum) - 1;
                ix.apply(() => $q.loading.hide());
              }
            "
            >{{ ch.title }}
          </q-btn>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <!-- <router-view /> -->
      <!-- <HelloWorld /> -->
      <q-page padding>
        <q-card
          v-touch-swipe.mouse.right.left="handleSwipe"
          v-touch-hold.mouse="handleHold"
          :dark="ix.dark"
        >
          <q-card-section ref="ixheader">
            <div>{{ ix.title }}</div>
          </q-card-section>

          <q-card-section
            v-for="(t, i) in ix.chapter"
            :key="i"
            class="q-mx-xl"
            :class="`text-h${ix.font_size}`"
          >
            {{ t }}
          </q-card-section>
        </q-card>
        <q-page-sticky position="right" :offset="[18, 18]">
          <q-btn
            v-show="!ix.isLastChapter"
            fab
            :scroll-offset="0"
            color="primary"
            icon="keyboard_arrow_right"
            @click.prevent="
              () => {
                scrollToHeader();
                ix.next();
                ix.apply(() => $q.loading.hide());
              }
            "
          />
        </q-page-sticky>
        <q-page-sticky position="left" :offset="[18, 18]">
          <q-btn
            v-show="!ix.isFirstChapter"
            fab
            color="primary"
            icon="keyboard_arrow_left"
            @click.prevent="
              () => {
                scrollToHeader();
                ix.prev();
                ix.apply(() => $q.loading.hide());
              }
            "
          />
        </q-page-sticky>
        <!-- place QPageScroller at end of page -->
        <q-page-scroller
          reverse
          position="top"
          :scroll-offset="20"
          :offset="[0, 18]"
        >
          <q-btn fab color="primary" icon="keyboard_arrow_down" />
        </q-page-scroller>
        <q-page-scroller
          position="bottom-right"
          :scroll-offset="450"
          :offset="[18, 18]"
        >
          <q-btn fab color="primary" icon="keyboard_arrow_up" />
        </q-page-scroller>
      </q-page>
    </q-page-container>

    <q-footer reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div class="text-center">
            CopyLeft<span v-if="ix.debug">{{ ix }}</span>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { nextTick, onUnmounted, ref } from "vue";
import { onMounted } from "vue";
// import HelloWorld from "./components/HelloWorld.vue";
import { useIxStore } from "./store/ixStore";
import {
  QCardSection,
  QVirtualScroll,
  scroll,
  TouchSwipeValue,
  useQuasar,
} from "quasar";

const ix = useIxStore();

const toggleRightDrawer = () => {
  ix.toggleRightDrawer();
};

const handleHold: TouchSwipeValue = ({ evt, ...newInfo }) => {
  ix.toggleImmersive();
  ix.dlog(newInfo);
};
const handleSwipe: TouchSwipeValue = async ({ evt, ...newInfo }) => {
  const direction = newInfo.direction as string;
  ix.swipe(direction);
};
const $q = useQuasar();
const ixheader = ref<QCardSection>();
const { getScrollTarget, setVerticalScrollPosition } = scroll;
const scrollToHeader = () => {
  loading();
  const el = ixheader.value?.$el;
  setVerticalScrollPosition(getScrollTarget(el), el.offsetTop, 1000);
};

// function onVirtualScroll({ index }) {
//   // this.virtualListIndex = index
//   ix.dlog(index);
// }

const onKeyup = (e: KeyboardEvent): void => {
  switch (e.key) {
    case "ArrowRight":
      $q.loading.show();
      if (ix.next()) {
        ix.apply(() => $q.loading.hide());
      }
      break;
    case "ArrowLeft":
      $q.loading.show();
      if (ix.prev()) {
        ix.apply(() => $q.loading.hide());
      }
      break;
    default:
      break;
  }
};

const virtualListRef = ref<QVirtualScroll>();
const loading = () => $q.loading.show();
var timeoutId: any = null;
onMounted(async () => {
  // ixStore.id = ixStore.id
  await ix.fetchChapters(ix.id);
  if (ix.chapterIndex === -1) {
    ix.chapterIndex = 845;
  }
  $q.loading.show();
  await ix.apply(() => $q.loading.hide());

  nextTick(() => {
    if (window.location.pathname === "/") {
      window.history.pushState({}, `/${ix.chapterIndex}`);
    }
    timeoutId = setTimeout(() => {
      if (virtualListRef.value) {
        const _index = ix.chapterIndex;
        virtualListRef.value.scrollTo(_index, "center-force");
        // console.log("screen", $q.screen);
        window.addEventListener("keyup", onKeyup);
      }
    }, 50);
  });
  onUnmounted(() => {
    clearTimeout(timeoutId);
    window.removeEventListener("keyup", onKeyup);
  });
});
</script>
