<template>
  <v-container class="black_texts" fluid>
    <v-row>
      <v-col md="6">
        <v-card height="615px" class="overflow-y-auto">
          <v-list two-line v-if="items !== null">
            <v-list-item-group active-class="blue--text">
              <template v-for="(item, index) in items" :key="item.name">
                <v-list-item
                  @click="handleDetailedView(item.rights ? item.rights : null)"
                >
                  <template v-slot:default="{ active }">
                    <v-list-item-content>
                      <v-list-item-title v-text="item.name"></v-list-item-title>

                      <v-list-item-subtitle>{{
                        item.host
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-list-item>

                <v-divider
                  v-if="index < items.length - 1"
                  :key="index"
                ></v-divider>
              </template>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col md="6">
        <v-card height="620px" class="overflow-y-auto">
          <v-data-table
            v-if="specific_table_infos !== null"
            :headers="specific_table_headers"
            :items="specific_table_infos"
            :items-per-page="10"
            class="elevation-1"
          ></v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import _ from "lodash";

export default {
  name: "SiteInfo",
  data() {
    return {
      initial: null,
      items: null,
      specific_table_headers: [
        {
          text: "Element",
          align: "start",
          sortable: false,
          value: "element",
        },
        { text: "Value", value: "value" },
      ],
      specific_table_infos: null,
    };
  },
  created() {
    var jsonsource = chrome.runtime.getURL("static/newsela_config.json");
    fetch(jsonsource)
      .then((response) => response.json()) //assuming file contains json
      .then((json) => {
        this.items = json.newsela;
      });
  },
  methods: {
    handleDetailedView(tableData) {
      if (tableData) {
        this.specific_table_infos = tableData;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.black_texts {
  color: black;
}
</style>
