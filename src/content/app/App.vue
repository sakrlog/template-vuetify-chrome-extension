<template>
  <v-app>
    <v-card flat height="600px" tile>
      <v-toolbar color="light-blue accent-4"
  elevation="4">
        <v-toolbar-title>Newsela helper Tool</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-heart</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
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
    return {};
  },
  name: "App",
  methods: {
    goBack: function () {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped></style>
