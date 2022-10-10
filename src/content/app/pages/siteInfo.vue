<template>
  <v-container class="black_texts" fluid>
    <v-row>
      <v-col md="6">
        <v-select
            v-model="selected_filters"
            :items="items_filters"
            attach
            chips
            label="Subject"
            @change="filterListView($event)"
          ></v-select>
        <v-card height="550px" class="overflow-y-auto">
          <v-list two-line v-if="items_to_display !== null">
            <v-list-item-group active-class="blue--text">
              <template v-for="(item, index) in items_to_display" :key="item.name">
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
                  v-if="index < items_to_display.length - 1"
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
      items: null,
      items_to_display: null,
      items_filters: ["-ALL-"],
      selected_filters: [],
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
        this.items_to_display = json.newsela;
        this.items = json.newsela;
        json.newsela.forEach(item => {
          if(item.rights) {
            item.rights.forEach(right => {
              if(right.element == "Subject Alignment") {
                const subjects = right.value.split(",");
                subjects.forEach(subject => {
                  if(this.items_filters.indexOf(subject.trim()) == -1) {
                    this.items_filters.push(subject.trim())
                  }
                })
              }
            })
          }
        })
      });
  },
  methods: {
    handleDetailedView(tableData) {
      if (tableData) {
        this.specific_table_infos = tableData;
      }
    },
    filterListView(filter) {
      if(filter == "-ALL-") {
        this.items_to_display = this.items
      } else {
        // The function should filter any value it gets
        const current_filtered = []
        this.items.forEach(item => {
          if(item.rights) {
            item.rights.forEach(right => {
              if(right.element == "Subject Alignment") {
                if(right.value.includes(filter)) {
                  current_filtered.push(item)
                }
              }
            })
          }
        })
        this.items_to_display = current_filtered
      }

    }
  },
};
</script>

<style lang="scss" scoped>
.black_texts {
  color: black;
}
</style>
