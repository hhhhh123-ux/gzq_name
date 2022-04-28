<template>
     <div class="iframe-container">
    <iframe frameborder="0" :src="url" />
  </div>
</template>
<script>
  import { baseURL } from '@/config'
  export default {
    name: 'Swagger',
    data() {
      return {
        url: baseURL + '/druid/login.html',
      }
    },
  }
</script>
<style lang="scss" scoped>
  .iframe-container {
    iframe {
      width: 100%;
      height: 100vh;
    }
  }
</style>