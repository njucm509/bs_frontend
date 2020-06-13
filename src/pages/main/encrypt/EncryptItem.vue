<template>
  <v-stepper v-model="step">
    <v-stepper-header style="color: black">
      <v-stepper-step :complete="step > 1" step="1">选择数据</v-stepper-step>
      <v-divider/>
      <v-stepper-step :complete="step > 2" step="2">处理方式</v-stepper-step>
      <v-divider/>
      <v-stepper-step :complete="step > 3" step="3">确认处理</v-stepper-step>
      <v-divider/>
      <v-stepper-step step="4">处理结果</v-stepper-step>
    </v-stepper-header>
    <v-stepper-items>
      <v-stepper-content step="1">
        <v-card class="xs10 mx-auto">
          <v-form v-model="valid" ref="basic">
            <v-layout row>
              xxx
            </v-layout>
          </v-form>
        </v-card>

      </v-stepper-content>
      <v-stepper-content step="2">
        <v-card>
          第二步
        </v-card>
      </v-stepper-content>
      <v-stepper-content step="3">
        <v-card class="my-2">
          第三步
        </v-card>
      </v-stepper-content>
      <v-stepper-content step="4">
        <v-card>
          第四步
        </v-card>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
  export default {
    name: "EncryptItem",
    props: {
      step: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        valid: false,
      };
    },
  };
</script>

<style scoped>
</style>
