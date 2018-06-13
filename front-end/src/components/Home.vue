<template>
  <v-container class="full-height" fluid grid-list-xl>
    <v-select
      :items="years"
      v-model="selectedYear"
      label="Select"
      item-value="text"
      y-offset
      single-line
    ></v-select>

    <v-layout class="full-height" row wrap>
      <v-layout v-if="loading" justify-center>
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-layout>

      <v-alert v-if="error" :value="true" type="error">
        Something went wrong
      </v-alert>

      <div class="empty-state" v-if="!loading && !months.length">
        <p>No data found</p>
      </div>

      <v-flex v-else-if="!loading" v-for="month in months" :key="month.name" xs12 sm6 md3 xl2>
        <MonthCard :month="month"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import MonthCard from './MonthCard.vue'
import axios from 'axios'

export default {
  components: {
    MonthCard
  },
  created() {
    this.getMonths();
  },
  data() {
    return {
      loading: false,
      error: null,
      selectedYear: '2018',
      months: [],
      years: [
        { text: '2018' },
        { text: '2017' },
        { text: '2016' }
      ]
    }
  },
  watch: {
    selectedYear() {
      this.getMonths();
    }
  },
  methods: {
    getMonths() {
      this.loading = true;

      axios.get(`http://localhost:3000/api/months?year=${this.selectedYear}`)
        .then(res => {
          this.months = res.data;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          this.error = err;
        })
    }
  }
}
</script>

<style scoped>
  .input-group--select {
    max-width: 10rem;
  }
</style>
