<template>
  <v-container class="black_texts" fluid>
    <v-row>
      <v-col md="6">
        <v-select
          v-model="selected_filters"
          :items="items_filters"
          attach
          chips
          label="Filter"
          @change="filterListView($event)"
        ></v-select>
        <v-card height="560px" class="overflow-y-auto" elevation="0">
          <v-list two-line v-if="items_to_display !== null">
            <v-list-item-group active-class="blue--text">
              <template
                v-for="item in Object.keys(items_to_display)"
                :key="item.name"
              >
                <v-list-item
                  @click="handleDetailedView(items_to_display[item].data)"
                >
                  <template v-slot:default="{ active }">
                    <v-list-item-content>
                      <v-list-item-title v-text="item"></v-list-item-title>

                      <v-list-item-subtitle>{{
                        `${items_to_display[item].count} tags of this type have been associated with ${items_to_display[item].assigned_count_all} items.`
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-list-item>
              </template>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col md="6">
        <v-card height="630px" class="overflow-y-auto">
          <v-data-table
            v-if="specific_table_infos !== null"
            :headers="specific_table_headers"
            :items="specific_table_infos"
            :items-per-page="10"
            class="elevation-1"
          >
            <template v-slot:item.ID="{ item }">
              <div>
                <div v-for="d of Object.keys(item.ID)">
                  <strong>{{ d }}:</strong><span>{{ item.ID[d] }}</span>
                </div>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "TagExplorer",
  data() {
    return {
      items_filters: [
        "Group By TagType",
        "Group By Subject",
        "Group By Standard",
        "Group By Name",
      ],
      selected_filters: ["Group By TagType"],
      filtered_tags: null,
      items_to_display: null,
      raw_tags: null,
      specific_table_headers: [
        {
          text: "NAME",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "SUBJECT", value: "subject" },
        { text: "ASSIGNED TO", sortable: true, value: "assigned_to" },
        { text: "ORIGIN", value: "origin" },
        { text: "TYPE", value: "type" },
        { text: "ID", value: "ID" },
      ],
      specific_table_infos: null,
    };
  },
  mounted() {
    var alx_tags = chrome.runtime.getURL("static/alexandria_tags.json");
    fetch(alx_tags)
      .then((response) => response.json()) //assuming file contains json
      .then((json) => {
        this.raw_tags = json.data.tags;
        this.filtered_tags = this.filter(this.raw_tags);
        this.items_to_display = this.filtered_tags["tagType"];
      });
  },
  methods: {
    handleDetailedView(tableData) {
      if (tableData) {
        this.specific_table_infos = tableData;
      }
    },
    filterListView(filterType) {
      switch (filterType) {
        case "Group By TagType":
          this.items_to_display = this.filtered_tags["tagType"];
          break;
        case "Group By Subject":
          this.items_to_display = this.filtered_tags["subjectLong"];
          break;
        case "Group By Standard":
          this.items_to_display = this.filtered_tags["standard"];
          break;
        case "Group By Name":
          this.items_to_display = this.filtered_tags["name"];
          break;
      }
    },
    filter(tags) {
      let cluster = { tagType: {}, subjectLong: {}, standard: {}, name: {} };
      const filters = ["tagType", "name", "subjectLong"];

      tags.forEach((inside_tag) => {
        inside_tag.forEach((tag) => {
          if (tag.assignedCount > 0) {
            filters.forEach((filter) => {
              cluster = this.add(cluster, tag, filter);
            });
            if (Array.isArray(tag.standards)) {
              tag.standards.forEach((standard) => {
                cluster = this.add(cluster, tag, "standard", standard.name);
              });
            }
          }
        });
      });
      return cluster;
    },
    add(cluster, tag, filter, name = false) {
      let element;
      if (!name) {
        element = tag[filter];
      } else {
        element = name;
      }
      if (element in cluster[filter]) {
        cluster[filter][element]["count"] = cluster[filter][element].count + 1;
        cluster[filter][element]["assigned_count_all"] =
          cluster[filter][element].assigned_count_all + tag.assignedCount;
        const obj = {
          name: tag.name,
          subject: tag.subjectLong,
          assigned_to: tag.assignedCount,
          type: tag.tagType,
          ID: {
            ID: tag.id,
            UID: tag.uid,
            CUID: tag.certicaId,
          },
        };
        let data = cluster[filter][element].data;
        data.push(obj);
        cluster[filter][element]["data"] = data;
      } else {
        const obj = {
          name: tag.name,
          subject: tag.subjectLong,
          assigned_to: tag.assignedCount,
          type: tag.tagType,
          ID: {
            ID: tag.id,
            UID: tag.uid,
            CUID: tag.certicaId,
          },
        };
        cluster[filter][element] = {
          count: 1,
          assigned_count_all: tag.assignedCount,
          data: [obj],
        };
      }
      return cluster;
    },
  },
};
</script>

<style lang="scss" scoped>
.black_texts {
  color: black;
}
</style>
