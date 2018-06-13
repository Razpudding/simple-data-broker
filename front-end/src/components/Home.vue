<template>
  <v-container fluid grid-list-xl>
    <v-select
      :items="years"
      v-model="selectedYear"
      label="Select"
      item-value="text"
      y-offset
      single-line
    ></v-select>

    <v-layout row wrap v-for="year in years" :key="year.text" v-show="year.text === selectedYear">
      <v-flex v-for="month in months" :key="month" xs12 sm6 md3>
        <MonthCard :title="month"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import MonthCard from './MonthCard.vue'

export default {
  components: {
    MonthCard
  },
  data() {
    return {
      selectedYear: '2018',
      years: [
        { text: '2018' },
        { text: '2017' },
        { text: '2016' }
      ],
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }
  }
}
</script>

<style scoped>
  .input-group--select {
    max-width: 10rem;
  }
</style>
