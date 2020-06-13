<template>
  <v-card class="xs10 mx-auto">
    <v-card-title>
      <v-spacer/>
      <v-btn @click="down">下载</v-btn>
    </v-card-title>
    <v-data-table :headers="headers" :items="data" :pagination.sync="pagination" :total-items="totalItems"
                  :loading="loading"
                  class="elevation-1">
      <template slot="items" slot-scope="props">
        <td class="text-xs-center" v-for="(field,id) in fields" :key="id">
          {{ props.item[field.sysName] == null ? '*': props.item[field.sysName] }}
        </td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  export default {
    name: "ReleasedDataItem",
    props: {
      fields: {
        type: Array
      },
      headers: {
        type: Array
      },
      data: {
        type: Array
      }
    },
    data() {
      return {
        pagination: {
          rowsPerPage: 10
        },
        totalItems: 0,
        loading: false,
      }
    },
    methods: {
      down() {
        let headers = this.headers.map((v) => v.value);
        let header = '\ufeff' + this.headers.map((v) => v.value).toString();
        let data = this.data;
        let lines = '\n';
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < headers.length; j++) {
            if (data[i][headers[j]]) {
              lines += data[i][headers[j]];
            } else {
              lines += '*';
            }
            lines += ',';
          }
          lines += '\n';
        }
        let link = document.createElement('a');
        let exportData = new Blob([header + lines], {type: 'text/csv,charset=UTF-8'});
        link.href = URL.createObjectURL(exportData);
        link.download = 'released_data.csv';
        link.click();
      }
    }
  }
</script>

<style scoped>

</style>
