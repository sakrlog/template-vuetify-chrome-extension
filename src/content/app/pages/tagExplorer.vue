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
        <v-card height="550px" class="overflow-y-auto">
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
      <v-col md="6">
        <v-card height="620px" class="overflow-y-auto">
          <v-data-table
            v-if="specific_table_infos !== null"
            :headers="specific_table_headers"
            :items="specific_table_infos"
            :items-per-page="10"
            class="elevation-1"
          >
          <template v-slot:item.ID="{item}">
            <div>
              <div v-for="d of Object.keys(item.ID)">
                <strong>{{d}}:</strong><span>{{item.ID[d]}}</span>
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
      selected_filters:["Group By TagType","Group By Subject","Group By Standard","Group By Name"],
      items: null,
      items_to_display: null,
      specific_table_headers: [
        {
          text: "NAME",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "SUBJECT", value: "subject"},
        { text: "ASSIGNED TO", sortable: true, value: "assigned_to"},
        { text: "ORIGIN", value: "origin"},
        { text: "TYPE", value: "type"},
        { text: "ID", value: "ID"},
      ],
      specific_table_infos: null,
    };
  },
  mounted() {
    var alx_tags = chrome.runtime.getURL("static/alexandria_tags.json");
    fetch(alx_tags)
      .then((response) => response.json()) //assuming file contains json
      .then((json) => {
        let tags = json.data.tags;
        let cluster = {};

        tags.forEach((tago) => {
          tago.forEach((tag) => {
            if (tag.assignedCount > 0) {
              if (tag.name in cluster) {
                cluster[tag.name]["count"] = cluster[tag.name].count + 1;
                cluster[tag.name]["assigned_count_all"] =
                  parseInt(cluster[tag.name].assigned_count_all) +
                  tag.assignedCount;
                const obj = {
                  name: tag.name,
                  subject: tag.subjectLong?tag.subjectLong:"null",
                  assigned_to: tag.assignedCount,
                  origin: tag.origin,
                  type: tag.tagType,
                  ID: {
                    ID: tag.id,
                    UID: tag.uid,
                    CUID: tag.certicaId,
                  },
                };
                let data = cluster[tag.name].data;
                data.push(obj);
                cluster[tag.name]["data"] = data;
              } else {
                const obj = {
                  name: tag.name,
                  subject: tag.subjectLong?tag.subjectLong:"null",
                  assigned_to: Number(tag.assignedCount),
                  origin: tag.origin,
                  type: tag.tagType,
                  ID: {
                    ID: tag.id,
                    UID: tag.uid,
                    CUID: tag.certicaId,
                  },
                };
                cluster[tag.name] = {
                  count: 1,
                  assigned_count_all: tag.assignedCount,
                  data: [obj],
                };
              }
            }
          });
        });
        this.items_to_display = cluster;
      });
  },
  methods: {
    handleDetailedView(tableData) {
      if (tableData) {
        this.specific_table_infos = tableData;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.black_texts {
  color: black;
}
</style>
