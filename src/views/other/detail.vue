<template>
	<div>
		<mt-header :title="course.courseName" fixed>
      <router-link to="/courselist" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <router-link :to="{name:'editcourse', courseId: course.id}" slot="right">
        编辑
      </router-link>
    </mt-header>

    <div class="g-content has-fixed-top">
    	<ul class="g-detail-list">
        <li class="detail-item img">
          <div>
            <img src="../../assets/img/cat.jpg" width="100px" v-preview/>
          </div>
        </li>
        <li class="detail-item">
          <div class="label">开会时间：</div>
          <div class="text">{{course.meetingBeginDtStr}}</div>
        </li>
        <li class="detail-item">
          <div class="label">结会时间：</div>
          <div class="text">{{course.meetingEndDtStr}}</div>
        </li>
        <li class="detail-item">
          <div class="label">会议状态：</div>
          <div class="text"><i :class="course.meetingStatusCode">{{course.meetingStatusCode | status}}</i></div>
        </li>
        <li class="detail-item">
          <div class="label">开关：</div>
          <div class="text"><mt-switch v-model="switchValue" disabled></mt-switch></div>
        </li>
        <li class="detail-item">
          <div class="label">文件：</div>
          <div class="text"><i class="fa fa-file-word-o"></i> 这是文件.doc</div>
        </li>
        <li class="detail-item">
          <div class="label">电话号码：</div>
          <div class="text"><a href="tel:12345678900">{{12345678900 | phoneMask}}</a></div>
        </li>
        <li class="detail-item">
          <div class="label">电子邮箱：</div>
          <div class="text"><a href="mailto:test1@163.com">123456@qq.com</a></div>
        </li>
        <li class="detail-item">
          <div class="label">会议地址：</div>
          <div class="text"><a href="bdapp://map/marker?location=40.047669,116.313082&title=我的位置&content=百度奎科大厦&src=
          yourCompanyName|yourAppName">{{course.localGps?course.localGps:'广州科学城总部经济区'}}</a></div>
        </li>
        <li class="detail-item">
          <div class="label">视频：</div>
          <div class="text"><video width="90%" height="200px" controls ref="video">
              <source src="@/assets/img/movie.mp4" type="video/mp4">
          </video></div>
        </li>
        <li class="detail-item">
          <div class="label">音频：</div>
          <div class="text">
            <audio width="80%" controls ref="audio" style="margin-top:4px;">
                <source src="@/assets/img/audio.mp3" type="audio/mpeg">
            </audio>
          </div>
        </li>
        <li class="detail-item">
          <div class="label">会议内容：</div>
          <div class="text">随便来点内容吧，随便来点内容吧，随便来点内容吧，随便来点内容吧，{{course.contentStr}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { Indicator, Toast } from 'mint-ui';
import { phoneMask, status } from '@/utils/';
import preview from '@/directives/preview';

export default {
  data() {
  	return {
  		course: {
        id: '123',
  			courseName: '课程详情',
        meetingBeginDtStr: '2018-05-21 08:00:00',
        meetingEndDtStr: '2018-05-23 18:30:00',
        meetingStatusCode: 'approving',
  		},
  		isLoading: false,
      switchValue: false,
  	};
  },
  directives:{
    preview
  },
  mixins:[{
    filters: {
      phoneMask,
      status,
    }
  }],
  watch: {
    //正在加载
    isLoading(isLoading) {
      this.toggleLoadingIconShow(isLoading);
    }
  },
  methods: {
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
  	getDetail() {
  		let params = {
  			courseId: 'bacd134132',
  		};
  		this.isLoading = true;

  		//暂时做个数据延迟的假象
      setTimeout(() => {
	  		this.$http.getCourseDetail(params).then(res => {
	  			let _result = res.resultMap.data.detail;
	  			//this.course = _result;
	  			this.isLoading = false;
	  		}).catch(res => {
	  			this.isLoading = false;
          res.message && Toast(res.message);
	  		});
	  	}, 500);
  	},
  },
  created() {
  	this.getDetail();
  },
};
</script>
<style>
	
</style>