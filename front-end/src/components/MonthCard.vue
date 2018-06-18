<template>
  <v-card width="100%" class="month-card">
    <v-toolbar flat>
      <v-toolbar-title>{{ month.name }}</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon @click.native.stop="monthDialog = true">
        <v-icon>delete</v-icon>
      </v-btn>
      
      <v-dialog v-model="monthDialog" max-width="350">
        <v-card>
          <v-card-title class="headline">Are you sure?</v-card-title>
          <v-card-text>The data will be gone forever! Make sure you first download the data.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="grey" 
              flat="flat" 
              @click.native="weekDialog = false"
              v-if="!awaitingResponse"
            >Cancel</v-btn>
            <v-btn
              color="red" 
              flat="flat" 
              @click="deleteData(month.startDate, month.endDate, month.name)"
              :disabled="awaitingResponse"
              :loading="awaitingResponse"
            >Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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

        <v-btn icon @click.native.stop="weekDialog = true">
          <v-icon>delete</v-icon>
        </v-btn>

        <v-dialog v-model="weekDialog" max-width="350">
          <v-card>
            <v-card-title class="headline">Are you sure?</v-card-title>
            <v-card-text>The data will be gone forever! Make sure you first download the data.</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="grey" 
                flat="flat" 
                @click.native="weekDialog = false"
                v-if="!awaitingResponse"
              >Cancel</v-btn>
              <v-btn
                color="red" 
                flat="flat" 
                @click="deleteData(week.startDate, week.endDate, month.name, week.name)"
                :disabled="awaitingResponse"
                :loading="awaitingResponse"
              >Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-btn :href="`http://localhost:3000/api/dump?startdate=${week.startDate}&enddate=${week.endDate}`" icon>
          <v-icon>cloud_download</v-icon>
        </v-btn>
      </v-list-tile>
    </v-list>
  </v-card>
</template>

<script>
  import axios from 'axios';

  export default {
    props: ["month", "removeData"],
    data () {
      return {
        right: null,
        weekDialog: false,
        monthDialog: false,
        awaitingResponse: false
      }
    },
    methods: {
      deleteData(startDate, endDate, monthName, weekNumber) {
        this.awaitingResponse = true

        axios.get(`http://localhost:3000/api/delete?startdate=${startDate}&enddate=${endDate}`)
          .then(res => {
            this.monthDialog = false
            this.weekDialog = false
            this.awaitingResponse = false

            this.$emit('removeData', { monthName, weekNumber })
          })
          .catch(error => {
            console.log(error)
          })
      }
    }
  }
</script>

<style>
  .month-card .list__tile {
    padding-right: 0;
  }

  .month-card .btn--icon {
    margin-left: 0;
  }

  .month-card .btn--icon:not(:last-child) {
    margin-right: 0;
  }
</style>
