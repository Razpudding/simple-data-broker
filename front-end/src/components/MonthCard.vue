<template>
  <v-card width="100%">
    <v-toolbar flat>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>cloud_download</v-icon>
      </v-btn>
    </v-toolbar>
    <v-divider></v-divider>
    <v-list dense class="pt-0">
      <v-list-tile v-for="item in items" :key="item.title" @click="">
        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
        <v-btn icon>
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
        items: [
          { title: 'Week 1'},
          { title: 'Week 2'},
          { title: 'Week 3'},
          { title: 'Week 4'}
        ],
        right: null
      }
    },
    props: ["title"]
  }
</script>