<template>
  <v-container class="black_texts" fluid>
    <v-row>
      <v-col md="8">
        <div><h1>Site Info Page</h1></div>
      </v-col>
      <v-col md="4">
        <v-text-field
          outlined
          background-color="yellow"
          hint="adai toulo ya boulos?"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  name: "SiteInfo",
};
</script>

<style lang="scss" scoped>
.black_texts {
  color: black;
}
</style>
