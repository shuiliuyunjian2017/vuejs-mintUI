<template>
  <div>
    <mt-cell :title="title">
      <span @click="openPicker">{{initDate || ''}}<i class="fa fa-angle-right"></i></span>
    </mt-cell>
    <mt-datetime-picker :startDate="sDate" ref="picker" type="datetime" v-model="pickerValue" @confirm="getTime"></mt-datetime-picker>
  </div>
</template>

<script>
import { dateFormat } from '@/utils/';
export default {
  data () {
    return {
      pickerValue: ''
    }
  },
  mixins:[{
    methods: {
      dateFormat,
    },
  }],
  computed: {
    sDate() {
      return this.startDate ? new Date(this.startDate) : new Date();
    },
  },
  props:['initDate', 'title', 'startDate'],
  methods:{
    openPicker(){
      this.$refs.picker.open();
    },
    getTime(val){
      this.$emit('setDate', this.dateFormat(new Date(val)));
    } 
  }
}
</script>

<style scoped>
.fa{margin-left: 5px;}
</style>
