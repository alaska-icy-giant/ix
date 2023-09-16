<template>
  <q-layout view="hHh lpR lFr">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          {{ ixStore.lorem }}
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="ixStore.drawer"
      side="right"
      bordered
      :width="500"
      :breakpoint="300"
    >
      <!-- drawer content -->
      <div class="row">
        <q-icon name="toc"></q-icon>
        <div>
          <span class="text-subtitle2"
            >Total {{ ixStore.chapters.length }} chapters</span
          >
        </div>
        <q-space />
        <q-input rounded dense flat v-model="ixStore.filter">
          <template v-slot:append>
            <q-icon
              v-if="ixStore.filter !== ''"
              name="close"
              @click="ixStore.filter = ''"
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
          @click="ixStore.size(-1)"
        />
        <q-btn
          dense
          flat
          size="sm"
          icon="text_decrease"
          @click="ixStore.size(1)"
        />
        <q-btn
          dense
          flat
          size="sm"
          icon="swap_vertical_circle"
          @click="ixStore.toggleReverse"
        />
        <q-btn
          dense
          flat
          size="sm"
          :icon="ixStore.dark ? 'light_mode' : 'dark_mode'"
          @click="ixStore.dark = !ixStore.dark"
        />
        <q-btn
          v-if="false"
          dense
          flat
          size="sm"
          :icon="ixStore.fullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="ixStore.fullscreen = !ixStore.fullscreen"
        />
      </div>
      <div v-for="(ch, n) in ixStore.getChapters" :key="n">
        <q-btn
          flat
          dense
          @click="
            () => {
              ixStore.chapterIndex = parseInt(ch.ordernum);
              ixStore.apply();
            }
          "
          >{{ ch.title }}
        </q-btn>
      </div>
    </q-drawer>

    <q-page-container>
      <!-- <router-view /> -->
      <!-- <HelloWorld /> -->
      <q-page padding>
        <q-card
          v-touch-swipe.mouse.right.left="handleSwipe"
          v-touch-hold.mouse="handleHold"
          :dark="ixStore.dark"
        >
          <q-card-section ref="ixheader">
            <div>{{ ixStore.title }}</div>
          </q-card-section>

          <q-card-section
            v-for="(t, i) in ixStore.chapter"
            :key="i"
            class="q-mx-xl"
            :class="`text-h${ixStore.font_size}`"
          >
            {{ t }}
          </q-card-section>
        </q-card>
        <q-page-sticky position="right" :offset="[18, 18]">
          <q-btn
            v-show="!ixStore.isLastChapter"
            fab
            :scroll-offset="0"
            icon="keyboard_arrow_right"
            @click.prevent="
              () => {
                ixStore.next();
                ixStore.apply();
                scrollToHeader();
              }
            "
          />
        </q-page-sticky>
        <q-page-sticky position="left" :offset="[18, 18]">
          <q-btn
            v-show="!ixStore.isFirstChapter"
            fab
            icon="keyboard_arrow_left"
            @click.prevent="
              () => {
                ixStore.prev();
                ixStore.apply();
                scrollToHeader();
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
          <q-btn fab icon="keyboard_arrow_down" />
        </q-page-scroller>
        <q-page-scroller
          position="bottom-right"
          :scroll-offset="450"
          :offset="[18, 18]"
        >
          <q-btn fab icon="keyboard_arrow_up" />
        </q-page-scroller>
      </q-page>
    </q-page-container>

    <q-footer reveal elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div class="text-center">
            CopyLeft<span v-if="ixStore.debug">{{ ixStore }}</span>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onMounted } from "vue";
// import HelloWorld from "./components/HelloWorld.vue";
import { useIxStore } from "./store/ixStore";
import { QCardSection, scroll, TouchSwipeValue } from "quasar";

const ixStore = useIxStore();

const toggleRightDrawer = () => {
  ixStore.toggleRightDrawer();
};

const handleHold: TouchSwipeValue = ({ evt, ...newInfo }) => {
  ixStore.toggleImmersive();
  ixStore.dlog(newInfo);
};
const handleSwipe: TouchSwipeValue = async ({ evt, ...newInfo }) => {
  const direction = newInfo.direction as string;
  ixStore.swipe(direction);
};
const ixheader = ref<QCardSection>();
const { getScrollTarget, setVerticalScrollPosition } = scroll;
const scrollToHeader = () => {
  const el = ixheader.value?.$el;
  setVerticalScrollPosition(getScrollTarget(el), el.offsetTop, 1000);
};
onMounted(async () => {
  // ixStore.id = ixStore.id
  await ixStore.fetchChapters(ixStore.id);
  if (ixStore.chapterIndex === -1) ixStore.chapterIndex = 833;
  await ixStore.apply();
});
</script>
