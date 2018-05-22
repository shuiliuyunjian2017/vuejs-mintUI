<template>
	<div>
		<mt-header :title="course.courseName" fixed>
      <router-link to="/livelist" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>

    <div class="has-fixed-top">
    	{{course.courseName}}
    </div>
  </div>
</template>
<script>
import { Indicator } from 'mint-ui';
export default {
  data() {
  	return {
  		course: {
  			courseName: '视频课程详情'
  		},
  		loading: false,
  	};
  },
  watch: {
    //正在加载
    loading(isLoading) {
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
  		this.loading = true;

  		//暂时做个数据延迟的假象
      setTimeout(() => {
	  		this.$http.getCourseDetail(params).then(res => {
	  			let _result = res.resultMap.data.detail;
	  			this.course = _result;
	  			this.loading = false;
	  		}).catch(res => {
	  			this.loading = false;
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