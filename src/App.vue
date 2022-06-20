<template>
  <div class="root">
    Test.vue: Test is working

    <div>
      <button @click="onCopyToClipboard()">复制到剪贴板</button>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue} from 'vue-class-component'
import clipboards from '../lib/tools/clipboards';

export default class App extends Vue {

  onCopyToClipboard() {
    clipboards.text.set('copy test');
  }

}
</script>

<style scoped lang="scss">
@import "lib/style/dc-base";

.root {
}
</style>
