<template>
	<div>
		<div class="fixed-top">
			<mt-header class="list-header" fixed title="资讯信息列表"></mt-header>
			<mt-search class="search" v-model="mainSearchValue" cancel-text="取消" @keyup.enter.native="mainSearch"></mt-search>
			<div class="navbar">
				<mt-navbar v-model="selected">
				</mt-navbar>
				<!-- tab-container -->
				<mt-tab-container v-model="selected">
				</mt-tab-container>
			</div>
		</div>
		<div class="content" v-if="data.viewList" :style="{height:wapperHeight}">
			<mt-loadmore :auto-fill="false" :top-method="loadTop" :bottom-method="loadBottom" 
				:bottom-all-loaded="allLoaded" ref="loadmore" :bottomPullText="bottomPullText">
				<ul>
					<li v-for="item in data.viewList" @click="toDetail(item)" @touchstart="touchTodo(item)" @touchend="clearTodo" :key="item.paperTitle">
						<div class="header-img">
							<img :src="item.imagePath" width="100%" height="100%" alt="">
						</div>
						<div class="toppic">
							<span class="overflow">{{ item.paperTitle }}</span>
							<span>学而思</span>
						</div>
						<span class="cross">x</span>
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
import api from "./articlepaperUrl";
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
				paperTitle : null,
				imagePath : null,
			},
			actions : [
				{name : "编辑", method : this.edit},
				{name : "删除", method : this.del}
			],
			sheetVisible:false,
			paperId : "",
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
			this.params.paperTitle = this.mainSearchValue;
			this.params.imagePath = this.mainSearchValue;
			this.getList();
		},
		// 长按编辑和删除
		touchTodo(item) {
			clearInterval(this.Loop); //再次清空定时器，防止重复注册定时器
			this.Loop = setTimeout(() => {
				this.sheetVisible = true;
				this.paperId = item.paperId;
			}, 1000);
		},
		clearTodo() {
			clearInterval(this.Loop);
		},
		// 编辑和删除
		edit() {
			this.$router.push({name : "editArticlepaper", params : 
				{
					paperId : this.paperId
				}
			});
		},
		del() {
			MessageBox.confirm("确定要删除这一行?").then(action => {
				api.delList({deleteSelection : this.paperId}).then(res => {
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
			this.$router.push({name : "detailArticlepaper", params : 
				{
				paperId : item.paperId
				}
			});
		},
		toAdd() {
			this.$router.push({name : "addArticlepaper"});
		}
	},
	computed : {
		wapperHeight() {
			return document.documentElement.clientHeight - 93 + "px";
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
/* 列表样式 */
.content{
  overflow: auto;
  width: 100%;
	margin-top:94px;
	padding:0 8px;
	box-sizing: border-box;
}
::-webkit-content{
  width:0;
  height:0;
}
.content li{
  /* border-top:1px solid #ccc; */
	margin-bottom:5px;
	position:relative;
  background: #fff;
	padding:10px;
	display:flex;
	flex-wrap:nowrap;
	box-shadow: inset 0px -1px 1px -1px #ccc; /* 一像素边框变窄 */
}
.content li:first-child{border-top:0 none;}
.content .header-img{
	width:50px;
	height:50px;
	overflow: hidden;
	border-radius: 5px;
	margin-right:10px;
}
.content .toppic{
	line-height:28px;
	width:80%;
	text-align: left;
}
.toppic span{
	display:block;
	width: 100%;
}
.toppic span:last-child{
	color:#999;
	line-height:22px;
	font-size: 12px;
}
.content li .cross{
	position: absolute;
	right:8px;
	bottom:2px;
	color:#999;
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
</style>