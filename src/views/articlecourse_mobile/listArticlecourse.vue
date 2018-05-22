<template>
	<div>
		<div class="fixed-top">
			<mt-header class="list-header" fixed title="直播课程列表"></mt-header>
			<mt-search class="search" v-model="mainSearchValue" cancel-text="取消" @keyup.enter.native="mainSearch"></mt-search>
			<div class="navbar">
				<mt-navbar v-model="selected">
					<mt-tab-item id="6">
						<span @click="beginDtOpen">开始时间<i class="fa fa-angle-down"></i></span>
					</mt-tab-item>
					<mt-tab-item id="7">
						<span @click="endDtOpen">截止时间<i class="fa fa-angle-down"></i></span>
					</mt-tab-item>
				</mt-navbar>
				<!-- tab-container -->
				<mt-tab-container v-model="selected">
					<mt-tab-container-item id="6">
						<mt-datetime-picker @confirm="beginDtSearch" @cancel="beginDtCancel" ref="beginDtPicker" 
							cancelText="重置" type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日">
						</mt-datetime-picker>
					</mt-tab-container-item>
					<mt-tab-container-item id="7">
						<mt-datetime-picker @confirm="endDtSearch" @cancel="endDtCancel" ref="endDtPicker" 
							cancelText="重置" type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日">
						</mt-datetime-picker>
					</mt-tab-container-item>
				</mt-tab-container>
			</div>
		</div>
		<div class="content" v-if="data.viewList" :style="{height:wapperHeight}">
			<mt-loadmore :auto-fill="false" :top-method="loadTop" :bottom-method="loadBottom" 
				:bottom-all-loaded="allLoaded" ref="loadmore" :bottomPullText="bottomPullText">
				<ul>
					<li v-for="item in data.viewList" @click="toDetail(item)" @touchstart="touchTodo(item)" @touchend="clearTodo" :key="item.gradeName">
						<div class="toppic">
							<div class="list-left">    <!-- 分为左右两块 -->
								<span>{{ item.courseTitle }}</span>
								<span v-if="item.beginDt.year==item.endDt.year&&item.beginDt.month==item.endDt.month&&item.beginDt.date==item.endDt.date">
									{{item.beginDt.year-100 | toDou}}年{{item.beginDt.month}}月{{item.beginDt.date}}日 {{item.beginDt.hours | toDou}}:{{item.beginDt.minutes | toDou}} - {{item.endDt.hours | toDou}}:{{item.endDt.minutes | toDou}} {{item.classCount}}次课
								</span>
								<span v-else>
									{{item.beginDt.year-100 | toDou}}年{{item.beginDt.month | toDou}}月{{item.beginDt.date | toDou}}日 - {{item.endDt.year-100}}年{{item.endDt.month | toDou}}月{{item.endDt.date | toDou}}日 {{item.classCount}}次课
								</span>
								<span>
									<strong>￥{{item.price | toFloat}}</strong>
									已有{{item.buyCount}}人购买
								</span>
							</div>
							<span class="list-right">
								<img :src="item.imagePath" alt="" width="100%">  <!-- 图片宽度变为20% -->
							</span>
						</div>
					</li>
				</ul>
			</mt-loadmore>
			<div class="no-data" v-if="data.viewList.length==0">暂无数据</div>
			<mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
		</div>
		<mt-palette-button @expanded="toAdd" class="add-btn" content="+" :radius="80" mainButtonStyle="color:#fff;background-color:#26a2ff;">
			<div class="my-icon-button"></div>
		</mt-palette-button>
	</div>
</template>

<script>
import api from "./articlecourseUrl";
import { Toast,Loadmore,MessageBox  } from "mint-ui";
function toDouble(obj) {
	if (obj < 10) {
		return "0" + obj;
	} else {
		return obj;
	}
}
export default {
	data () {
		return {
			data : "",
			mainSearchValue : "",
			selected : "",

			allLoaded : false,
			bottomPullText : "",
			params : {   //接口参数
				gradeName : null,
				subjectName : null,
				courseTitle : null,
				imagePath : null,
				beginDt : null,
				endDt : null,
				classCount : null,
				price : null,
				buyCount : null,
			},
			actions : [
				{name : "编辑", method : this.edit},
				{name : "删除", method : this.del}
			],
			sheetVisible:false,
			courseId : "",
		}
	},
	created() {
		this.params.sortOrder = "updatedDt";
		this.params.sortType = "desc";
		this.getList();
		// 判断是否过期
		/*api.judgeTicket({}).then(res => {
			this.params.sortOrder = "updatedDt";
			this.params.sortType = "desc";
			this.getList();
		}, res => {
			Toast("登录已过期，请重新登录");
		});*/
	},
	methods : {
		beginDtOpen() {
			this.$refs.beginDtPicker.open();
		},
		beginDtCancel() {
			this.params.beginDtStr = "";
			this.getList();
		},
		// 时间搜索
		beginDtSearch(msg) {
			let temp = new Date(msg);
			this.params.beginDtStr = temp.getFullYear() + "-" + toDouble(temp.getMonth() + 1) + "-" + toDouble(temp.getDate());
			this.getList();
		},
		endDtOpen() {
			this.$refs.endDtPicker.open();
		},
		endDtCancel() {
			this.params.endDtStr = "";
			this.getList();
		},
		// 时间搜索
		endDtSearch(msg) {
			let temp = new Date(msg);
			this.params.endDtStr = temp.getFullYear() + "-" + toDouble(temp.getMonth() + 1) + "-" + toDouble(temp.getDate());
			this.getList();
		},
		sure() {
			this.selected = "";
			this.getList();
		},
		// 获取会议列表
		getList() {
			api.getList(this.params).then(res => {
				this.data = res.resultMap.data;
				if (this.params.page >= this.data.countPage) {
					this.bottomPullText = "";
				}
			}, res => {
				Toast(res.message);
			});
		},
		// 上拉加载
		loadBottom() {
			clearInterval(this.Loop);
			if (this.params.page >= this.data.countPage) {
				this.allLoaded=true;
			} else {
				this.params.page ++;
			}
			this.$refs.loadmore.onBottomLoaded();
			this.getList();
		},
		// 下拉刷新
		loadTop() {
			this.allLoaded = false;
			clearInterval(this.Loop);
			this.params.page = 1;
			this.$refs.loadmore.onTopLoaded();
			this.getList();
		},
		// 内容搜索
		mainSearch() {
			this.params.gradeName = this.mainSearchValue;
			this.params.subjectName = this.mainSearchValue;
			this.params.courseTitle = this.mainSearchValue;
			this.params.imagePath = this.mainSearchValue;
			this.params.classCount = this.mainSearchValue;
			this.params.price = this.mainSearchValue;
			this.params.buyCount = this.mainSearchValue;
			this.getList();
		},
		// 长按编辑和删除
		touchTodo(item) {
			clearInterval(this.Loop); //再次清空定时器，防止重复注册定时器
			this.Loop = setTimeout(() => {
				this.sheetVisible = true;
				this.courseId = item.courseId;
			}, 1000);
		},
		clearTodo() {
			clearInterval(this.Loop);
		},
		// 编辑和删除
		edit() {
			this.$router.push({name : "editArticlecourse", params : 
				{
					courseId : this.courseId
				}
			});
		},
		del() {
			MessageBox.confirm("确定要删除这一行?").then(action => {
				api.delList({deleteSelection : this.courseId}).then(res => {
					if (res.resultMap.resultCode=="SUCCESS") {
						Toast("删除成功");
						this.getList();
					}
				}, res => {
					Toast(res.resultMap.message);
				});
			});
		},
		toDetail(item) {
			this.$router.push({name : "detailArticlecourse", params : 
				{
				courseId : item.courseId
				}
			});
		},
		toAdd() {
			this.$router.push({name : "addArticlecourse"});
		}
	},
	filters:{
		// 时间补0
		toDou(msg){
			if (msg < 10) {
				return "0" + msg;
			} else {
				return msg;
			}
		},
		// 数字加两位小数
		toFloat(msg){
			return msg.toFixed(2);
		}
	},
	computed : {
		wapperHeight() {
			return document.documentElement.clientHeight - 144 + "px";
		}
	}
}
</script>

<style scoped>
.fixed-top{
  position: fixed;
  top:0;
  width: 100%;
}
.list-header{
  z-index:5;
}
.search{height:auto;margin-top:40px;}
.navbar{
  font-size:1rem;
  background:#fff;
}
.navbar .mint-navbar{
  /* border-bottom: 1px solid #ddd;
  box-shadow: 0 0px 1px 0px rgba(204,204,204,0.7); */
	box-shadow: inset 0px -1px 1px -1px #ccc; /* 一像素边框变窄 */
}
/* 筛选状态等的样式 */
.mint-tab-container{overflow: inherit;}
.filter{
  box-shadow:0 2px 1px 0px rgba(150,150,150,0.3);
}
.filter h3{
  margin-top:15px;
  padding-left:1.17rem;
  text-align: left;
}
.filter .clear button{
  width:5rem;
  float:left;
  box-sizing: border-box;
  margin-left:1.17rem;
  margin-top:10px;
}
.filter .reset-sure{
  margin-top:10px;
  width:100%;
  height:33px;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}
.filter .reset-sure button{
  width:50%;
  float:left;
  border-radius: 0;
}
/* 列表样式 */
.content{
  overflow: auto;
  width: 100%;
  margin-top:144px;
}
::-webkit-content{
  width:0;
  height:0;
}
.content li{
  /* border-top:1px solid #ccc; */
	box-shadow: inset 0px -1px 1px -1px #ccc; /* 一像素边框变窄 */
  margin-bottom:5px;
  background: #fff;
  padding:10px;
}
.content li:first-child{border-top:0 none;}
.content .toppic{
  height:28px;
  line-height:28px;
}
.content .time{
  text-align: right;
  font-size:0.8rem;
  color:#666;
  margin-top:10px;
}
/* 添加按钮 */
.add-btn{
  position:fixed;
  background:#26a2ff;
  color:#fff;
  padding:0;
  border-radius: 50%;
  width:3rem;
  height:3rem;
  font-size:2rem;
  line-height:3rem;
  text-align: center;
  border:0 none;
  right:10px;
  bottom:10px;
}
.no-data{
  height:50px;
  line-height:50px;
}

/* 新增加的样式 */
.content .toppic{
	height: auto;
	overflow: hidden;
	display:flex;
	flex-wrap: nowrap;
}
.toppic .list-left{
	width:80%;
	padding:1px 0;
}
.list-left span{
	display:block;
	width:100%;
	text-align:left;
}
.list-left span:first-child{
	font-size:18px;
	font-weight: bold;
}
.list-left span:nth-child(2),.list-left span:nth-child(3){
	font-size:14px;
	color:#999;
}
.list-left span:nth-child(3) strong{
	font-size:16px;
	color:#EB4F38;
	margin-right:10px;
}
.toppic .list-right{
	width:20%;
	align-items:center;
	display: flex;
}
</style>