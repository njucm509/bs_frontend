<template>
  <v-card>
    <v-card-text>
      <search-item :step="step" ref="search"/>
    </v-card-text>
    <v-card-actions class="elevation-10">
      <v-flex class="xs3 mx-auto">
        <v-btn @click="step = 1" :disabled="step === 1">文件</v-btn>
        <v-btn @click="step = 2" :disabled="step === 2">列</v-btn>
      </v-flex>
    </v-card-actions>
  </v-card>
</template>

<script>
  import SearchItem from "./search/SearchItem";

  export default {
    name: "search",
    components: {
      'search-item': SearchItem
    },
    data() {
      return {
        step: 1,
      }
    }
  }
</script>

<style scoped>

</style>
