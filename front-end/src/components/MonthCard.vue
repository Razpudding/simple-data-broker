<template>
  <v-card width="100%" class="month-card">
    <v-toolbar flat>
      <v-toolbar-title>{{ month.name }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn :href="`http://localhost:3000/api/dump?startdate=${month.startDate}&enddate=${month.endDate}`" icon>
        <v-icon>cloud_download</v-icon>
      </v-btn>
    </v-toolbar>
    <v-divider></v-divider>
    <v-list dense class="pt-0">
      <v-list-tile v-for="week in month.weeks" :key="week.name">
        <v-list-tile-content>
          <v-list-tile-title>Week {{ week.name }}</v-list-tile-title>
        </v-list-tile-content>
        <v-btn :href="`http://localhost:3000/api/dump?startdate=${week.startDate}&enddate=${week.endDate}`" icon>
          <v-icon>cloud_download</v-icon>
        </v-btn>
      </v-list-tile>
    </v-list>
  </v-card>
</template>

<script>
  export default {
    data () {
      return {
        right: null
      }
    },
    props: ["month"]
  }
</script>

<style>
  .month-card .list__tile {
    padding-right: 0;
  }
</style>
