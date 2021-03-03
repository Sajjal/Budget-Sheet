<template>
  <apexchart type="pie" height="185" :options="chartOptions" :series="series"></apexchart>
</template>

<script>
export default {
  name: 'ApexSimplePieChart',
  data() {
    return {
      series: [],
      chartOptions: {
        colors: ['#24d17d', '#d14c24', '#4287f5', '#f5b342', '#f58442', '#42bcf5', '#4e42f5', '#6d48b5', '#a240b8', '#80294e'],
        chart: {
          type: 'pie',
          toolbar: {
            show: false
          }
        },
        labels: [],
        dataLabels: {
          enabled: false
        },
        legend: {
          show: false
        }
      }
    };
  },

  mounted() {
    this.getLabelsAndSeries();
    this.unsubscribe = this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'updateChartOptions') {
        this.getLabelsAndSeries();
      }
    });
  },

  beforeDestroy() {
    this.unsubscribe();
  },

  methods: {
    getLabelsAndSeries() {
      this.series = Object.values(this.$store.state.chartOptions);
      this.chartOptions = {
        ...this.chartOptions,
        ...{
          labels: Object.keys(this.$store.state.chartOptions)
        }
      };
    }
  }
};
</script>
