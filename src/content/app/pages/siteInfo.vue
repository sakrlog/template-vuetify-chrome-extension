<template>
  <v-container class="black_texts" fluid>
    <v-row>
      <v-col md="6">
        <v-btn @click="getData()"> trigger </v-btn>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col md="6">
        <v-data-table
          v-if="infos !== null"
          :headers="headers"
          :items="infos"
          :items-per-page="10"
          class="elevation-1"
        ></v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "SiteInfo",
  data() {
    return {
      count: 10,
      headers: [
        {
          text: "Element",
          align: "start",
          sortable: false,
          value: "element",
        },
        { text: "Value", value: "value" },
      ],
      infos: null,
    };
  },
  methods: {
    getData: function () {
      this.count += 1
      var jsonsource = chrome.runtime.getURL("static/newsela_config.json");
      fetch(jsonsource)
        .then((response) => response.json()) //assuming file contains json
        .then((json) => {
          this.infos = json.newsela[this.count].rights
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.black_texts {
  color: black;
}
</style>
