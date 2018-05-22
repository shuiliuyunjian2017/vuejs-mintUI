<template>
	<div>
		<div class="fixed-top">
			<mt-header class="list-header" fixed title="直播课程大纲列表"></mt-header>
			<mt-search class="search" v-model="mainSearchValue" cancel-text="取消" @keyup.enter.native="mainSearch"></mt-search>
			<div class="navbar">
				<mt-navbar v-model="selected">
					<mt-tab-item id="5">
						<span @click="beginDtOpen">开始时间<i class="fa fa-angle-down"></i></span>
					</mt-tab-item>
					<mt-tab-item id="6">
						<span @click="endDtOpen">截止时间<i class="fa fa-angle-down"></i></span>
					</mt-tab-item>
				</mt-navbar>
				<!-- tab-container -->
				<mt-tab-container v-model="selected">
					<mt-tab-container-item id="5">
						<mt-datetime-picker @confirm="beginDtSearch" @cancel="beginDtCancel" ref="beginDtPicker" 
							cancelText="重置" type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日">
						</mt-datetime-picker>
					</mt-tab-container-item>
					<mt-tab-container-item id="6">
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
					<li v-for="item in data.viewList" @click="toDetail(item)" @touchstart="touchTodo(item)" @touchend="clearTodo">
						<div class="toppic">
							<span>{{ item.outlineTitle }}</span>
							<span>{{ item.beginDtStr }}</span>
							<span>{{ item.endDtStr }}</span>
						</div>
						<!-- <div class="time">{{item.meetingBeginDtStr}}</div> -->
					</li>
				</ul>
			</mt-loadmore>
			<div class="no-data" v-if="data.viewList.length==0">暂无数据</div>
			<mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
		</div>
		<!-- <mt-palette-button @expanded="toAdd" class="add-btn" content="+" :radius="80" mainButtonStyle="color:#fff;background-color:#26a2ff;">
			<div class="my-icon-button"></div>
		</mt-palette-button> -->
	</div>
</template>

<script>
import api from "./articlecourseoutlineUrl";
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
				outlineTitle : null,
				beginDt : null,
				endDt : null,
			},
			actions : [
				{name : "编辑", method : this.edit},
				{name : "删除", method : this.del}
			],
			sheetVisible:false,
			outlineId : "",
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
			this.params.outlineTitle = this.mainSearchValue;
			this.getList();
		},
		// 长按编辑和删除
		touchTodo(item) {
			clearInterval(this.Loop); //再次清空定时器，防止重复注册定时器
			this.Loop = setTimeout(() => {
				this.sheetVisible = true;
				this.outlineId = item.outlineId;
			}, 1000);
		},
		clearTodo() {
			clearInterval(this.Loop);
		},
		// 编辑和删除
		edit() {
			this.$router.push({name : "editArticlecourseoutline", params : 
				{
					outlineId : this.outlineId
				}
			});
		},
		del() {
			MessageBox.confirm("确定要删除这一行?").then(action => {
				api.delList({deleteSelection : this.outlineId}).then(res => {
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
			this.$router.push({name : "detailArticlecourseoutline", params : 
				{
				outlineId : item.outlineId
				}
			});
		},
		toAdd() {
			this.$router.push({name : "addArticlecourseoutline"});
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
  border-bottom: 1px solid #ddd;
  box-shadow: 0 0px 1px 0px rgba(204,204,204,0.7);
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
  border-top:1px solid #ccc;
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
.toppic span:nth-child(2n){float:right;}
.toppic span:nth-child(2n+1){float:left;}
</style>