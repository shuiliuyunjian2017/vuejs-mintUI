<template>
	<div>
		<mt-header fixed title="课程详情">
			<router-link to="/listArticlecourse" slot="left">
				<mt-button icon="back"></mt-button>
			</router-link>
		</mt-header>
		<div class="content">
			<div class="content-top">
				<h3>{{data.courseTitle}}</h3>
				<p v-if="data.beginDt.year==data.endDt.year&&data.beginDt.month==data.endDt.month&&data.beginDt.date==data.endDt.date">
					{{data.beginDt.year-100 | toDou}}年{{data.beginDt.month}}月{{data.beginDt.date}}日 {{data.beginDt.hours | toDou}}:{{data.beginDt.minutes | toDou}} - {{data.endDt.hours | toDou}}:{{data.endDt.minutes | toDou}} {{data.classCount}}次课
				</p>
				<p v-else>
					{{data.beginDt.year-100 | toDou}}年{{data.beginDt.month | toDou}}月{{data.beginDt.date | toDou}}日 - {{data.endDt.year-100}}年{{data.endDt.month | toDou}}月{{data.endDt.date | toDou}}日 {{data.classCount}}次课
				</p>
				<p>
					<strong class="fl">￥{{data.price | toFloat}}</strong>
					<span class="fr">已有{{data.buyCount}}人购买</span>
				</p>
			</div>
			<div class="line"></div>
			<ul class="detail-list">
				<li>课程大纲</li>
				<li v-for="(item,index) in outlineList.viewList" :key="item.outlineTitle">
					<h3>
						<span v-if="index<9">0</span>{{index+1}}.
						<span>{{item.outlineTitle}}</span>
					</h3>
					<p>{{item.beginDtStr}} &nbsp&nbsp {{item.teacherName}}</p>
				</li>
			</ul>
			<div class="teacher">
				<h2>主讲老师</h2>
				<div>
					<div class="header fl">
						<img :src="data.imagePath" width="50px" height="50px" alt="">
					</div>
					<div class="name fl">
						<p>主讲老师：{{data.gradeName}}</p>
						<p>好评率:98.3% | 授课171节</p>
					</div>
				</div>
			</div>
			<div class="sign">
				<mt-button type="primary">立即报名</mt-button>
			</div>
		</div>
	</div>
</template>

<script>
import api from "./articlecourseUrl";
import api2 from "../articlecourseoutline_mobile/articlecourseoutlineUrl";
import { Toast } from "mint-ui";
import preview from '@/directives/preview';
export default {
	data () {
		return {
			data : "",
			outlineList:'',
			params : {   //接口参数
				outlineTitle : null,
				beginDt : null,
				endDt : null,
			},
		}
	},
	directives : {preview},
	created() {
		api.toDetail({courseId : this.$route.params.courseId}).then(res => {
			if(res.resultMap.resultCode == "SUCCESS") {
				this.data = res.resultMap.data;
				console.log(this.data.beginDt);
			}
		}, res => {
			Toast(res.message);
		});
		api2.getList(this.params).then(res => {
			this.outlineList = res.resultMap.data;
		}, res => {
			Toast(res.message);
		});
	},
	components : {

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
	}
}
</script>

<style scoped>
.content{
  margin-top:40px;
  text-align:left;
}
.detail-list li{
	position: relative;
	line-height:24px;
  word-break: break-all;
	overflow: auto;
	padding:10px 0;
	/* border-bottom:1px solid #d9d9d9; */
	box-shadow: inset 0px -1px 1px -1px #d9d9d9; /* 一像素边框变窄 */
}
.detail-list li h3{
	color:#999;
}
.detail-list li h3 span:last-child{
	color:#333;
}
.detail-list li:first-child{
	line-height:30px;
	font-weight:bold;
	border-bottom:0 none;
}
.detail-list li:last-child{
	border-bottom:0 none;
}
.detail-list li p{
	color:#999;
	line-height: 18px;
	font-size: 14px;
	text-indent: 2em;
}
/* 修改页面加的样式 */
.content-top{
	padding: 0 8px 10px;
}
.content-top h3{
	line-height:24px;
	margin:60px 0 0;
	font-size:18px;
}

.content-top p{
	color:#999;
	font-size: 14px;
	line-height:24px;
}
.content-top p:last-child{
	margin-top:10px;
	overflow: hidden;
}
.content-top p strong{
	color:#EB4F38;
}
.line{
	height:10px;
	background: #F7F6F8;
}
.detail-list{
	padding:20px 8px 0;
}
.teacher{padding:0 10px;}
.teacher h2{
	line-height:50px;
	padding:10px 0;
}
.header{
	width:50px;
	height:50px;
	border-radius:50%;
	overflow: hidden;
	margin-right:10px;
	margin-bottom:20px;
}
.name p{line-height:24px;}
.name p:first-child{
	font-weight:bold;
}
.name p:last-child{
	color:#999;
	font-size:14px;
}
.sign button{
	width:100%;
	border-radius:0;
}
</style>

