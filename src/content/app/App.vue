<template>
  <v-app>
    <v-card flat height="600px" tile>
      <v-toolbar color="light-blue accent-4" elevation="4">
        <v-toolbar-title>Newsela helper Tool</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon @click="changeIframeSize()">
          <v-icon>{{toolOpen?"mdi-lock":"mdi-lock-open"}}</v-icon>
        </v-btn>

        <template v-slot:extension>
          <v-tabs align-with-title>
            <v-tab>Tab 1</v-tab>
            <v-tab>Tab 2</v-tab>
            <v-tab>Tab 3</v-tab>
          </v-tabs>
        </template>
      </v-toolbar>
    </v-card>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      toolOpen: false,
    };
  },
  name: "App",
  methods: {
    changeIframeSize: function () {
      // select the iframe and change its height to the opposite of what it is
      let msg = {"function":"change-newselas-iframe-size"}
      if(this.toolOpen){
        msg["size"] = "50px"
      }else{
        msg["size"] = "600px"
      }
      this.toolOpen = !this.toolOpen
      window.parent.postMessage(msg, "*")
    },
    goBack: function () {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped></style>
