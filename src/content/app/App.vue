<template>
  <v-app>
    <v-card flat height="750px" tile> 
      <v-toolbar color="#0a6efa" elevation="4" dark>
        <v-toolbar-title>Newsela Helper Tool</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon @click="changeIframeSize()">
          <v-icon>{{ toolOpen ? "mdi-lock" : "mdi-lock-open" }}</v-icon>
        </v-btn>

        <template v-slot:extension>
          <v-tabs>
            <v-tab v-for="tab of tabs" :key="tab.id" :to="tab.route" exact>
              {{ tab.name }}
            </v-tab>
            <v-tabs-slider color="black"></v-tabs-slider>
            <v-tab-item v-for="tab of tabs" :key="tab.id" :value="tab.route">
              <router-view></router-view>
            </v-tab-item>
          </v-tabs>
        </template>
      </v-toolbar>
    </v-card>
    <v-bottom-navigation grow>
      <v-btn href="https://www.w3schools.com/tags/tag_a.asp" target="_blank">
        <span>Request Article</span>
      </v-btn>
      <v-btn
        href="https://github.com/sakrlog/template-vuetify-chrome-extension/blob/master/src/content/app/pages/secondPage/SecondPage.vue"
        target="_blank"
      >
        <span>Content Explorer</span>
      </v-btn>
      <v-btn href="https://router.vuejs.org/guide/#javascript" target="_blank">
        <span>Feedback</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      toolOpen: false,
      tabs: [
        { id: 1, name: "Site Info", route: `/siteInfo` },
        { id: 2, name: "Search Tools", route: `/searchTools` },
        { id: 3, name: "Tag Explorer", route: `/tagExplorer` },
      ],
    };
  },
  name: "App",
  methods: {
    changeIframeSize: function () {
      // select the iframe and change its height to the opposite of what it is
      let msg = { function: "change-newselas-iframe-size" };
      if (this.toolOpen) {
        msg["size"] = "50px";
      } else {
        msg["size"] = "800px";
      }
      this.toolOpen = !this.toolOpen;
      window.parent.postMessage(msg, "*");
    },
    // goBack: function () {
    //   this.$router.go(-1);
    // },
  },
};
</script>

<style lang="scss" scoped></style>
