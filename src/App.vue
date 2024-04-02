<template>
  <div>
    <h3>{{ extension.name }}</h3>
    <p>
      {{ Object.keys({ INIT_EXTENSION })[0] }} from global-variables is
      {{ INIT_EXTENSION }}
    </p>
    <button @click="turnOnOff">Toggle ON/OFF the extension</button>
    <p>extension is enabled: {{ isEnabled }}</p>
    <p>
      <strong>{{ minWidth }}x{{ minHeight }}</strong> is minimum image size in
      order to be detected and showed the tooltip
    </p>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import {
  MIN_IMG_WIDTH_PAGE,
  MIN_IMG_HEIGHT_PAGE,
  EXTENSION_IS_ENABLED,
  INIT_EXTENSION,
} from "@/global-variables";

export default defineComponent({
  name: "App",
  data() {
    return {
      extension: {},
      [EXTENSION_IS_ENABLED]: undefined,
    };
  },
  mounted() {
    this.extension = chrome.runtime.getManifest();
    chrome.storage.local.get(EXTENSION_IS_ENABLED, (result) => {
      if (result && result.hasOwnProperty(EXTENSION_IS_ENABLED))
        this[EXTENSION_IS_ENABLED] = result[EXTENSION_IS_ENABLED];
    });
  },
  computed: {
    minWidth() {
      return MIN_IMG_WIDTH_PAGE;
    },
    minHeight() {
      return MIN_IMG_HEIGHT_PAGE;
    },
    INIT_EXTENSION() {
      return INIT_EXTENSION;
    },
    isEnabled() {
      return this[EXTENSION_IS_ENABLED];
    },
  },
  methods: {
    turnOnOff() {
      this[EXTENSION_IS_ENABLED] = !this[EXTENSION_IS_ENABLED];

      chrome.storage.local.set({
        [EXTENSION_IS_ENABLED]: this[EXTENSION_IS_ENABLED],
      });
    },
  },
});
</script>
