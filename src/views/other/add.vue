<template>
  <div>

    <mt-header :title="title" fixed>
      <router-link to="/courselist" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>

    <div class="g-content has-fixed-top">
      <mt-field label="会议主题" placeholder="请输入会议主题" v-model="meetingTopic">
      </mt-field>

      <meeting-time @setDate="setStartTime" :initDate="meetingBeginDt" title="开会时间"></meeting-time>

      <meeting-time @setDate="setEndTime" :initDate="meetingEndDt" :startDate="meetingBeginDt" title="结会时间"></meeting-time>

      <meeting-status @setStatusCode="setStatusCode" :initStatus="meetingStatusCode" :notNeedAll="true"></meeting-status>

      <mt-field label="会议地址" placeholder="请输入会议地址" v-model="localGps">
      </mt-field>

      <mt-field label="手机号" placeholder="请输入手机号" type="tel" v-model="contactPhonenum"></mt-field>

      <mt-field label="邮箱" placeholder="请输入邮箱" type="email" v-model="contactEmail"></mt-field>

      <mt-field label="参会人数" placeholder="请输入数字" type="number" v-model="participantsNum"></mt-field>

      <mt-field label="会议内容" type="textarea" rows="4" placeholder="请输入会议内容" v-model="content"></mt-field>

      <div class="g-tc">
        <div class="btn btn-prim btn-save" @click="save">保存</div>
        <!-- <mt-button type="primary" size="small" @click="save">保存</mt-button> -->
      </div>
    </div>
    
  </div>
</template>
<script>
import { Indicator, Toast } from 'mint-ui';
import MeetingStatus from '@/components/MeetingStatus';
import MeetingTime from '@/components/MeetingTime';
import { isPhone, isNumber} from '@/utils/validator';
import { dateFormat } from '@/utils/';

export default {
  data () {
    return {
      model: 'add',
      title: '添加课程',
      meetingTopic: '',
      meetingBeginDt: '',
      meetingEndDt: '',
      content: '',
      contactPhonenum: '',
      contactEmail: '',
      meetingStatusCode: '',
      localGps: '',
      appId: 'DCAMPUS',
      appOrgId: '7788',
      meetingId: this.$route.params.meetingId,
      version:'',
      participantsNum:'',
      isLoading: false,
      isChecked: false,
      rules: {
        meetingTopic: {
          required: true, message: '请输入会议主题',
        },
        contactPhonenum: {
          required: true, message: '请输入手机号码', validator: isPhone, 
        },
        participantsNum: {
          message: '参会人数', validator: isNumber, 
        },
      },
    }
  },
  components: {
    MeetingStatus,
    MeetingTime
  },
  mixins:[{
    filters: {
      dateFormat,
    },
    methods: {
      dateFormat,
    },
  }],
  watch: {
    //正在加载
    isLoading(isLoading) {
      this.toggleLoadingIconShow(isLoading);
    }
  },
  methods: {
    /*computeStatus(val) {
      if (!this.isChecked) {
        return '';
      }

      if (val) {
        return 'success';
      }

      return 'error';
    },*/
    //正在加载的切换
    toggleLoadingIconShow(isLoading) {
      if (isLoading) {
        Indicator.open({
          spinnerType: 'fading-circle'
        });
      } else {
        Indicator.close();
      }
    },
    setStartTime(val) {
      this.meetingBeginDt = val;
    },
    setEndTime(val) {
      this.meetingEndDt = val;
    },
    setStatusCode(val) {
      this.meetingStatusCode = val;
    },
    save() {  
      let checkResult = this.checkForm();
      this.isChecked = true;
      if (!checkResult.result) {
        Toast(checkResult.message);
        return;
      }

      this.isLoading = true;

      this.$http.addMeetingInfo(this.formData).then(res => {
        this.isLoading = false;
        Toast('新建成功');
        this.$router.push({name: 'courselist'});
      }).catch(res => {
        this.isLoading = false;
        res.resultMap && res.resultMap.message && Toast(res.resultMap.message);
      });  
    },
    checkForm() {
      let checkList = this.rules,
          checkResult = {
            result: true
          },
          checkItem;

      this.isChecked = false;
      for (let item in checkList) {
        checkItem = checkList[item];
        //有标记必填，却为空
        if (checkItem.required && this[item] === '') {
          return {
            message: checkItem.message,
            result: false,
          };
        }

        //有自定义校验方法
        if (checkItem.validator) {
          checkResult = checkItem.validator(this[item]);
          if (!checkResult.result) {
            return checkResult;
          }
        }
      }

      return checkResult;
    },
    //获取详情
    getDetail() {
      let params = {
            meetingId: this.meetingId,
          };

      this.isLoading = true;

      this.$http.getDetail(params).then(res =>{
        let _result = res.resultMap.data;

        if (_result) {
          this.meetingTopic = _result.meetingTopic;
          this.meetingStatusCode = _result.meetingStatusCode;
          this.localGps = _result.localGps || '广州科学城总部经济区';
          this.version = _result.version || _result.iVersion;
          this.content = _result.contentStr;
          this.contactPhonenum = _result.contactPhonenum;
          this.contactEmail = _result.contactEmail;
          this.participantsNum = _result.participantsNum;

          if(_result.meetingBeginDt.year) {
            this.meetingBeginDt = this.dateFormat(new Date(_result.meetingBeginDt.time));
            this.meetingEndDt = this.dateFormat(new Date(_result.meetingEndDt.time));
          } else {
            this.meetingBeginDt = this.dateFormat(new Date(_result.meetingBeginDt));
            this.meetingEndDt = this.dateFormat(new Date(_result.meetingEndDt));
          }
        }

        this.isLoading = false;
      }).catch(res => {
        this.isLoading = false;
        res.resultMap && res.resultMap.message && Toast(res.resultMap.message);
      });
    },
    //初始化
    initData() {
      console.log(this.$route);
      this.model = this.$route.query.courseId ? 'eidt' : 'add';
      this.title = this.model === 'add' ? '添加课程' : '编辑课程';

      //编辑模式时，调一次获取详情数据
      if (this.model === 'eidt') {
        this.getDetail();
      }
    },
  },
  created() {
    this.initData();
  },
} 
</script>
<style scoped>
.btn-save {
  display: block;
  margin: 0 auto;
  width: 80%;
} 
</style>