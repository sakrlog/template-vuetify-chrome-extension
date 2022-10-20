<template>
  <v-container class="black_texts" fluid>
    <v-row>
      <v-col md="5">
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
              :disabled="parentWindowDetails ? false : true"
            >
              ALEXANDRIA
            </v-chip>
          </v-col>
        </v-row>
        <v-card height="560px" class="overflow-y-auto">
          <v-card-text v-if="alertWindow">
            <v-alert outlined type="warning" prominent>
              {{ alertWindow }}
            </v-alert>
          </v-card-text>
          <v-list two-line v-if="items_to_display !== null">
            <v-list-item-group active-class="blue--text">
              <template
                v-for="(item, index) in items_to_display"
                :key="item.url"
              >
                <v-list-item @click="handleDetailedView(item)">
                  <template v-slot:default="{ active }">
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="item.title"
                      ></v-list-item-title>

                      <v-list-item-subtitle>{{
                        "https://www.newsela.com" + item.url
                      }}</v-list-item-subtitle>

                      {{ item.description }}
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
      <v-col md="7">
        <v-card height="620px" class="overflow-y-auto">
          <v-row>
            <v-col>
              <v-treeview
                v-model="treeSelection"
                :items="articleComponents"
                selectable
                return-object
              ></v-treeview>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col class="pa-6" cols="8">
              <template v-if="!treeSelection.length">
                No nodes selected.
              </template>
              <template v-else>
                <v-list two-line v-if="treeSelection !== null">
                  <v-list-item-group active-class="blue--text">
                    <template
                      v-for="(item, index) in treeSelection"
                      :key="item.id"
                    >
                      <v-list-item>
                        <template v-slot:default="{ active }">
                          <v-list-item-content>
                            <v-list-item-title
                              v-text="item.name"
                            ></v-list-item-title>

                            <!-- <a
                              v-if="
                                /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/.test(
                                  item.value
                                ) == true
                              "
                              :href="item.name"
                              target="_blank"
                              >External URL
                              <v-icon :href="item.name" target="_blank"
                                >open-in-new</v-icon
                              ></a
                            > -->
                            <!-- <span v-else>{{item.value}}</span> -->

                            {{item.value}}
                          </v-list-item-content>
                        </template>
                      </v-list-item>
                      <v-divider
                        v-if="index < treeSelection.length - 1"
                        :key="index"
                      ></v-divider>
                    </template>
                  </v-list-item-group>
                </v-list>
              </template>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import $ from "jquery";

export default {
  name: "SearchTools",
  data() {
    return {
      treeSelection: [],
      articleComponents: [],
      parentWindowDetails: null,
      options: { q: "history" },
      newselaChipColor: true,
      alexandriaChipColor: false,
      alertWindow: null,
      items: null,
      items_to_display: null,
    };
  },
  async created() {
    let json = await $.getJSON(
      "https://api.genzel.io/simplesearch?q=" + this.options.q
    );
    if (json && json.results) {
      this.items_to_display = json.results;
    }

    //Get the parent url that alexandria uses
    window.parent.postMessage("getParentWindowDetails", "*");
    window.addEventListener(
      "message",
      (event) => {
        if (event.data.message !== "window_location_href") {
          return;
        }
        this.parentWindowDetails = event.data.parent;
      },
      false
    );
  },
  methods: {
    handleDetailedView(selected) {
      let currentId = 0;
      function createTreeView(data) {
        let tree = [];
        if (!data || data.length < 1 || data === null) {
          console.log("--- DATA IS EMPTY ---");
          return tree;
        } else if (typeof data === "object" && !Array.isArray(data)) {
          //This is an object {} for sure
          const keys = Object.keys(data);
          for (const key of keys) {
            // k:key and v:data[key]
            if (
              typeof data[key] === "string" ||
              typeof data[key] === "number"
            ) {
              const obj = { id: currentId++, name: key, value: data[key] };
              tree.push(obj);
            } else {
              //could be an object or an array I don't know - send it back in reccursion
              const obj = {
                id: currentId++,
                name: key,
                children: createTreeView(data[key]),
              };
              tree.push(obj);
            }
          }
        } else if (Array.isArray(data)) {
          // The data is 100% an array, but I still don't know its content
          for (const element of data) {
            if (typeof element === "string" || typeof element === "number") {
              const obj = { id: currentId++, name: element, value: element };
              tree.push(obj);
            } else {
              //could be an object or an array I don't know - send it back in reccursion
              const number = data.indexOf(element) + 1;
              const obj = {
                id: currentId++,
                name: number,
                children: createTreeView(element),
              };
              tree.push(obj);
            }
          }
        }
        return tree;
      }
      this.articleComponents = [];
      this.treeSelection = [];
      this.articleComponents = createTreeView(selected);
    },
    async chipClick(chip) {
      if (chip == "alexandria") {
        // If alexandria filter is clicked
        this.alertWindow = null;
        this.items_to_display = null;
        this.newselaChipColor = false;
        this.alexandriaChipColor = "#0a6efa";

        let rootUrl =
          this.parentWindowDetails.protocol +
          "//" +
          this.parentWindowDetails.hostname;

        let newselaConfig = chrome.runtime.getURL("static/newsela_config.json");
        let known_sites = await (await fetch(newselaConfig)).json();

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
          this.alertWindow =
            "No objects (" +
            searchType +
            ") were found in newsela which start with the url: " +
            rootUrl;
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
          this.alertWindow =
            "No results were found on newsela.com with the query: " +
            this.options.q;
        }
      }
    },
    getPageInfo(known_sites) {
      let url = new URL(this.parentWindowDetails.href);
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
    }
  },
};
</script>

<style lang="scss" scoped>
.black_texts {
  color: black;
}
</style>
