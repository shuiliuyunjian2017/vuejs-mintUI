<template>
  <div>
    <div class="g-fixtop">
      <mt-header title="名师推荐" fixed>
        <mt-button icon="back">返回</mt-button>
      </mt-header>
      <mt-search class="search" v-model="keywords" cancel-text="取消" @keyup.enter.native="getList('clear')"></mt-search>
    </div>
    
    <div class="g-content-infinite has-fixed-top3">
      <!-- 列表有数据时 -->
      <div v-if="list.length > 0">
        <ul
          v-infinite-scroll="getList"
          infinite-scroll-disabled="isLoading"
          infinite-scroll-distance="20"
          class="g-list">
          <li v-for="item in list" @click="toDetail(item)" class="item f-clearfix"> <!-- @touchstart="touchTodo(item)" @touchend="clearTodo" -->
            <div class="item-pic">
              <img src="../../assets/img/cat.jpg" alt="" />
            </div>
            <div class="item-txt">
              <div class="tit">{{item.courseName}}</div>
              <div class="subtit">{{item.courseDec}}</div>
              <div class="bot">
                <span class="coin">-{{item.price || 0}}智币-</span>
                <span class="time">更新时间：{{item.updateDateTime | dateFormat('YYYY-MM-DD')}}</span>
              </div>
            </div>         
          </li>
          <li>
            <!-- 底部正在加载的图标 -->
            <div class="g-list-loading"><mt-spinner type="fading-circle" :size="25"></mt-spinner>正在刷新</div>
          </li>
        </ul>
        
        <!-- 已加载完所有数据时 -->
        <div class="g-nomore-data" v-if="totalRecord === list.length && totalRecord !== 0">已经到底啦</div>

        <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
      </div>

      <!-- 列表无数据时且不是在加载状态时 -->
      <div class="g-no-data" v-if="list.length === 0 && !isLoading">
        <img src="../../assets/img/no-record.jpg" alt="" />
        <p class="tips">暂无数据</p>
      </div>
      
    </div>

    <!-- 添加数据 -->
    <div @click="toAdd" class="btn-add">+</div>
  </div>
</template>

<script>
import { Indicator, Toast } from 'mint-ui';
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
      isLoading: false,
      keywords: '',
      actions:[
        {
          name: '编辑',
          method: this.edit
        },
        {
          name: '删除',
          method: this.del
        }
      ],
      sheetVisible: false,
      updateDateTime: new Date(),
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
    isLoading(isLoading) {
      this.toggleLoadingIconShow(isLoading);
    }
  },
  methods:{
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
    getList(type){
      //清除记录
      if (type) {
        this.curPage = 0;
        this.countPage = 1;
        this.list = [];
      }

      //TODO 页码这些字段和后台的确认
      this.curPage++;

      //如果当前页码大于所有记录的最大页码数
      if (this.countPage < this.curPage) {
        return;
      }

      let params = {
            page: this.curPage,
            pageSize: this.pageSize,
            //just for test mixin method dateFormat
            updateDateTime: this.dateFormat(this.updateDateTime, 'YYYY-MM-DD'),
          };

      this.isLoading = true;

      //暂时做个数据延迟的假象
      setTimeout(() => {
        this.$http.getCourseList(params).then(res => {
          let _result = res.resultMap.data;
          this.list = this.list.concat(_result.viewList || []);
          this.countPage = _result.countPage;
          this.totalRecord = _result.count;
          this.isLoading = false;
        }).catch(res => {
          this.isLoading = false;
          res.message && Toast(res.message);
        });
      }, 500);
      
    },
    //去详情页
    toDetail(item) {
      this.$router.push({
        name: 'coursedetail',
        params: {
          courseId: item.courseId
        }
      });
    },
    // 长按编辑和删除
    touchTodo(item){
      clearInterval(this.Loop); //再次清空定时器，防止重复注册定时器
      this.Loop=setTimeout(()=>{
          this.sheetVisible = true;
          this.meetingId = item.meetingId;
      },1000);
    },
    clearTodo(){
      clearInterval(this.Loop);
    },
    toAdd() {
      this.$router.push({name:'addcourse'});
    },
  },
  created() {
    this.getList();
  },
}
</script>

<style lang="less" scoped>
@import '../../assets/styles/var.less';
.btn-add {
  position: fixed;
  background-color: @colorPrimary;
  color: #fff;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  font-size: 2rem;
  line-height: 2.8rem;
  text-align: center;
  right: 10px;
  bottom: 70px;
}
.search {
  height: auto;
  margin-top: 40px;
}
</style>
