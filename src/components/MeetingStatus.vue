<template>
  <div>
    <mt-cell title="会议状态">
      <span @click="setStatus">{{initStatus ? (initStatus | status) : '请选择'}}<i class="fa fa-angle-right"></i></span>
    </mt-cell>
    <mt-popup v-model="popupVisible" position="bottom">
      <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
    </mt-popup>
  </div>
</template>

<script>
import { status } from '@/utils/';
export default {
  data () {
    return {
      options:[],
      value:'',
      popupVisible:false,
      slots: [
        {
          flex: 1,
          values: [],
          className: 'slot1',
          textAlign: 'center'
        }
      ]
    }
  },
  props:['initStatus', 'notNeedAll'],
  mixins:[{
    filters: {
      status,
    },
  }],
  components: {

  },
  created(){
    //默认会有“全部”的选项
    if (!this.notNeedAll) {
      this.options.push({'label':'全部','name':'','value':false});
      this.slots[0].values.push('全部');
    }

    this.$http.getMeetingStatus({'codetypeId':'meetingStatus'}).then(res =>{
      console.log(res);
      let meetingTemp = res.resultMap.data.viewList;
      for(let item of meetingTemp){
        this.options.push({
          'label':item.codeDesc,
          'name':item.codeId,
          'value':false
        });
        this.slots[0].values.push(item.codeDesc);
      }
    },res=>{
      console.log(res);
      res.resultMap && res.resultMap.message && this.$message.error(res.resultMap.message);
    })
  },
  methods:{
    onValuesChange(picker,values){
      for(var item of this.options){
        if(values==item.label){
          this.$emit('setStatusCode',item.name);
        }
      }
    },
    setStatus(){
      this.popupVisible = true;
    }
  },
  watch:{
    postStatus(){
      this.value=this.postStatus;
    }
  }
}
</script>

<style scoped>
.mint-popup{width: 100%;}
.mint-button{width:100%;}
.fa{
  margin-left:5px;
}
</style>
