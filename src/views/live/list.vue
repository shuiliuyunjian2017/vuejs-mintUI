<template>
  <div>
    <div class="g-mask" v-if="showMask" @click="toggleTab(null)"></div>

  	<div class="g-fixtop">
	    <mt-header title="口袋直播">
	      <mt-button icon="back">返回</mt-button>
	    </mt-header>
    
      <!-- 过滤 -->
      <div class="g-filters">
        <div class="g-tabs">
          <div 
            class="item" 
            id="tab-grade"
            @click="toggleTab('grade')"
            :class="{'is-selected': curTabSelected === 'grade'}">
              {{curGrade.name}}
              <i class="fa fa-caret-down g-ml10" :class="{'fa-caret-up': curTabSelected === 'grade'}"></i>
          </div>
          <div 
            class="item" 
            id="tab-subject"
            @click="toggleTab('subject')"
            :class="{'is-selected': curTabSelected === 'subject'}">
              {{curSubject.name}}
              <i class="fa fa-caret-down g-ml10" :class="{'fa-caret-up': curTabSelected === 'subject'}"></i>
          </div>
        </div>
        <div class="g-tabs-content">
          <div 
            id="cont-grade"
            class="item" 
            :class="{'is-selected': curGrade.id === item.id}"
            v-show="curTabSelected === 'grade'"
            @click="toggleSelect(index, 'grade')"
            v-for="(item, index) in gradeList">
            <span>{{item.name}}</span>
            <span class="icon" v-if="curGrade.id === item.id"><i class="fa fa-check"></i></span>
          </div>
          <div 
            id="cont-subject"
            class="item" 
            :class="{'is-selected': curSubject.id === item.id}" 
            v-show="curTabSelected === 'subject'" 
            @click="toggleSelect(index, 'subject')"
            v-for="(item, index) in subjectList">
            <span>{{item.name}}</span>
            <span class="icon" v-if="curSubject.id === item.id"><i class="fa fa-check"></i></span>
          </div>
        </div>

      </div>

    </div>

    <div class="g-content-infinite has-fixed-top2">
      <!-- 列表有数据时 -->
      <div v-if="list.length > 0">
        <ul
          v-infinite-scroll="getList"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="20"
          class="g-list livelist">
          <li v-for="item in list" @click="toDetail(item)" class="item f-clearfix">
            <div class="item-txt">
              <div class="tit">{{item.courseName}}</div>
              <div class="subtit"><span class="g-mr10">{{item.startDateTime | formateStartDate}} - {{item.endDateTime | formateStartDate}}</span>{{item.courseCount}}次课</div>
              <div class="bot">
                <span class="price g-mr10"><span class="price-icon">¥</span>{{item.price || 0}}.00</span>
                <span class="purcount">已有{{item.purchasedCount}}人购买</span>
              </div>
            </div>
            <div class="item-pic">
              <img src="../../assets/img/cat.jpg" alt="" />
            </div>       
          </li>
          <li>
            <!-- 底部正在加载的图标 -->
            <div class="g-list-loading"><mt-spinner type="fading-circle" :size="25"></mt-spinner>正在刷新</div>
          </li>
        </ul>
        
        <!-- 已加载完所有数据时 -->
        <div class="g-nomore-data" v-if="totalRecord === list.length && totalRecord !== 0">已经到底啦</div>
      </div>

      <!-- 列表无数据时且不是在加载状态时 -->
      <div class="g-no-data" v-if="list.length === 0 && !loading">
        <img src="../../assets/img/no-record.jpg" alt="" />
        <p class="tips">暂无数据</p>
      </div>
      
    </div>
  </div>
</template>

<script>
import { Indicator } from 'mint-ui';
import { dateFormat } from '@/utils/';

export default {
  data () {
    return {
      //列表
      list: [],
      //分页条数
      pageSize: 10,
      //当前页码
      curPage: 0,
      countPage: 1,
      //总记录数
      totalRecord: 0,
      loading: false,
      filtersSelected: '',
      gradeList: [{
        id: 'g1',
        name: '七年级',
      }, {
        id: 'g2',
        name: '八年级',
      }, {
        id: 'g3',
        name: '九年级',
      }, {
        id: 'g4',
        name: '高一年级',
      }, {
        id: 'g5',
        name: '高二年级',
      }, {
        id: 'g6',
        name: '高三年级',
      }],
      subjectList: [{
        id: 's1',
        name: '语文',
      }, {
        id: 's2',
        name: '数学',
      }, {
        id: 's3',
        name: '英语',
      }, {
        id: 's4',
        name: '物理',
      }, {
        id: 's5',
        name: '化学',
      }, {
        id: 's6',
        name: '公开课',
      }],
      curTabSelected: '',
      curGrade: {
        id: 'g2',
        name: '八年级',
      },
      curSubject: {
        id: 's2',
        name: '数学',
      },
      showMask: false,
    }
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
    loading(isLoading) {
      this.toggleLoadingIconShow(isLoading);
    },
    'curGrade.id'() {
      this.curPage = 1;
      this.getList();
    },
    'curSubject.id'() {
      this.curPage = 1;
      this.getList();
    },
  },
  filters: {
  	formateStartDate(str) {
  		let dateStr = str.split('-');
  		return dateStr[0].substring(2) + '年' + dateStr[1] + '月' + dateStr[2] + '日';
  	},
  },
  methods:{
    //切换tab
    toggleTab(type) {
      if (type) {
        this.curTabSelected = type;
        this.showMask = true;
      } else {
      //点tab外的面板，隐藏内容选择
        this.curTabSelected = '';
        this.showMask = false;
      }  
    },
    //切换选中项
    toggleSelect(index, type) {
      if (type === 'grade') {
        this.curGrade = this.gradeList[index];
      } else if (type === 'subject') {
        this.curSubject = this.subjectList[index];
      }
      this.showMask = false;
      this.curTabSelected = '';
    },
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
    //获取列表
    getList(){
      //TODO 页码这些字段和后台的确认
      this.curPage++;

      //如果当前页码大于所有记录的最大页码数
      if (this.countPage < this.curPage) {
        return;
      }

      let params = {
            page: this.curPage,
            pageSize: this.pageSize,
          };

      this.loading = true;

      //暂时做个数据延迟的假象
      setTimeout(() => {
        this.$http.getLiveList(params).then(res => {
          let _result = res.resultMap.data;
          this.list = this.list.concat(_result.viewList || []);
          this.countPage = _result.countPage;
          this.totalRecord = _result.count;
          this.loading = false;
        }).catch(res => {
          this.loading = false;
          Toast(res.message);
        });
      }, 500);
      
    },
    //去详情页
    toDetail(item) {
      this.$router.push({
        name: 'livedetail',
        params: {
          courseId: item.courseId
        }
      });
    },
  },
  created() {
    this.getList();
  },
}
</script>

<style lang="less" scoped>
@import '../../assets/styles/var.less';
.livelist {
	.item-pic {
		width: 4rem;
		height: 4.2em;
		margin-right: 0;
		margin-left: 1rem;
		margin-top: auto;
		margin-bottom: auto;
		img {
			width: 4rem;
			height: 4.2em;
		}
	}
	.bot {
		position: static;
		margin-top: .8rem;
	}
	.price {
		font-family: 'arial';
		color: @colorOrange;
		font-size: 1rem;
		.price-icon {
			margin-right: 2px;
			font-size: .8rem;
		}
	}
	.purcount {
		font-size: .9rem;
		color: @colorFontLightGray2;
	}
}
</style>
