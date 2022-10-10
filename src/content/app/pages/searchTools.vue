<template>
  <v-container class="black_texts" fluid>
    <v-row>
      <v-col md="6">
        <v-row>
          <v-col md="6">
            <v-text-field
              hide-details
              v-model="options.q"
              outlined
              label="Search"
            ></v-text-field>
          </v-col>
          <v-col md="6">
            <v-chip
              class="ma-2"
              :color="newselaChipColor ? '#0a6efa' : null"
              @click="chipClick('newsela')"
            >
              NEWSELA.COM
            </v-chip>
            <v-chip
              class="ma-2"
              :color="alexandriaChipColor ? '#0a6efa' : null"
              @click="chipClick('alexandria')"
            >
              ALEXANDRIA
            </v-chip>
          </v-col>
        </v-row>
        <v-card height="550px" class="overflow-y-auto">
          <v-alert v-if="alertWindow" outlined type="warning" prominent>
            {{alertWindow}}
          </v-alert>
          <v-list two-line v-if="items_to_display !== null">
            <v-list-item-group active-class="blue--text">
              <template
                v-for="(item, index) in items_to_display"
                :key="item.url"
              >
                <v-list-item
                  @click="handleDetailedView(item.rights ? item.rights : null)"
                >
                  <template v-slot:default="{ active }">
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="item.title"
                      ></v-list-item-title>

                      <v-list-item-subtitle>{{
                        "https://www.newsela.com" + item.url
                      }}</v-list-item-subtitle>

                      <v-list-item-subtitle
                        v-text="item.description"
                      ></v-list-item-subtitle>
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
      <v-col md="6"> </v-col>
    </v-row>
  </v-container>
</template>

<script>
import $ from "jquery";

export default {
  name: "SearchTools",
  data() {
    return {
      options: { q: "history" },
      newselaChipColor: true,
      alexandriaChipColor: false,
      alertWindow: null,
      items: null,
      items_to_display: null,
      items_filters: [],
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
  async created() {
    let json = await $.getJSON(
      "https://api.genzel.io/simplesearch?q=" + this.options.q
    );
    if (json && json.results) {
      this.items_to_display = json.results;
    }
  },
  methods: {
    handleDetailedView() {},
    async chipClick(chip) {
      if (chip == "alexandria") {
        // If alexandria filter is clicked
        this.alertWindow = null;
        this.items_to_display = null
        this.newselaChipColor = false;
        this.alexandriaChipColor = "#0a6efa";

        let rootUrl =
          window.parent.location.protocol + "//" + window.parent.location.hostname;

        let newselaConfig = chrome.runtime.getURL("static/newsela_config.json");
        let known_sites = await (await fetch(newselaConfig)).json()
        
        let searchType = this.getPageInfo(known_sites.newsela)
          ? "original"
          : "external";
        let json;
        if (searchType == "original") {
          //it's a partner, so search by originalURL
          json = await $.getJSON(
            "https://api.genzel.io/originalurlsearch?originalURLBegins=" +
              rootUrl
          );
        } else {
          //it's not a partner, so see if there's an external link object
          json = await $.getJSON(
            "https://api.genzel.io/externallinksearch?externalLinkURLBegins=" +
              rootUrl
          );
        }

        if (
          json &&
          json.data &&
          json.data.contents &&
          json.data.contents.length > 0
        ) {
          this.items_to_display = json.data.contents;
        } else {
          this.alertWindow = "No objects ("+searchType+") were found in newsela which start with the url: " + rootUrl;
        }
      } else {
        // If newsela filter is clicked
        this.items_to_display = null;
        this.alertWindow = null;
        this.alexandriaChipColor = false;
        this.newselaChipColor = "#0a6efa";

        let json = await $.getJSON(
          "https://api.genzel.io/simplesearch?q=" + this.options.q
        );
        if (json && json.results) {
          this.items_to_display = json.results;
        } else {
          this.alertWindow = "No results were found on newsela.com with the query: " + this.options.q
        }
      }
    },
    getPageInfo(known_sites) {
      //TODO: I should find a way to get the right URL
      // parent.postMessage("getURL", "*")
      let url = new URL(window.parent.location.href);
      let site_info = false;

      known_sites.some(function (entry) {
        //match the required hostname
        if (entry.host === url.host) {
          //match the optional path
          if (entry.pathname) {
            if (url.pathname.startsWith(entry.pathname)) {
              site_info = entry;
              return true;
            }
          } else {
            site_info = entry;
            return true;
          }
        }
      });

      return site_info;
    },
  },
};
</script>

<style lang="scss" scoped>
.black_texts {
  color: black;
}
</style>
