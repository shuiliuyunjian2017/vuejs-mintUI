<template>
  <div id="app"> 
    <router-view/>

    <mt-tabbar class="g-tabbar" v-model="tabbarSelected" fixed>
    	<mt-tab-item id="home">
        <i class="fa fa-home"></i>
        首页
      </mt-tab-item>
      <mt-tab-item id="courselist">
        <i class="fa fa-book"></i>
        推荐
      </mt-tab-item>
      <mt-tab-item id="livelist">
        <i class="fa fa-video-camera"></i>
        直播
      </mt-tab-item>
      <mt-tab-item id="listArticlecourse">
        <i class="fa fa-book"></i>
        课程
      </mt-tab-item>
      <mt-tab-item id="listArticlepaper">
        <i class="fa fa-video-camera"></i>
        资讯
      </mt-tab-item>
      <mt-tab-item id="personal">
        <i class="fa fa-user-circle"></i>
        我的
      </mt-tab-item>
    </mt-tabbar>
  </div>
    

</template>

<script>
export default {
  name: 'App',
  data() {
  	return {
  		tabbarSelected: this.$route.name,
  	};
  },
  watch: {
  	tabbarSelected(val) {	
  		this.$router.push({name: val});
  	},
  	'$route.name'(routename) {
  		this.tabbarSelected = this.$route.meta[0];
  	},
  },
  methods: {

  },
  created() {
  	console.log(this.$route);
  },
}
</script>

<style lang="less">
//@import './assets/css/reset.css';
@import './assets/styles/reset.less';
@import './assets/styles/global.less';
@import 'font-awesome/css/font-awesome.css';
#app {
	background: #fff;
  text-align: left;
  color: @colorFontPrimary;
}

.g-tabbar {
  i {
    display: block;
    margin-bottom: 2px;
    font-size: 1.2rem;
  }
}
</style>
