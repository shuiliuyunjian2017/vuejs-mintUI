<template>
	<div>
		<mt-header fixed :title="data.outlineTitle + '详情'">
			<router-link to="/listArticlecourseoutline" slot="left">
				<mt-button icon="back"></mt-button>
			</router-link>
		</mt-header>
		<div class="content">
			<ul class="detail-list">
				<li><span>章节:</span>{{data.outlineTitle}}</li>
				<li><span>开始时间:</span>{{data.beginDtStr}}</li>
				<li><span>截止时间:</span>{{data.endDtStr}}</li>
			</ul>
		</div>
	</div>
</template>

<script>
import api from "./articlecourseoutlineUrl";
import { Toast } from "mint-ui";
import preview from '@/directives/preview';
export default {
	data () {
		return {
			data : "",
		}
	},
	directives : {preview},
	created() {
		api.toDetail({outlineId : this.$route.params.outlineId}).then(res => {
			if(res.resultMap.resultCode == "SUCCESS") {
				this.data = res.resultMap.data;
			}
		}, res => {
			Toast(res.message);
		});
	},
	components : {

	}
}
</script>

<style scoped>
.content{
  margin-top:40px;
  text-align:left;
  padding:0 5px;
}
.detail-list li{
	position: relative;
	line-height:32px;
	min-height:32px;
	padding-left:5.5rem;
  word-break: break-all;
  overflow: auto;
	border-bottom:1px solid #d9d9d9;
}
.detail-list li.img-li{
  padding-left:0;
  height:50px;
  padding:5px 0;
}
.detail-list li.img-li div{
  height:50px;
  overflow-x:auto;
  text-align:center;
}
.detail-list span{
	position: absolute;
	text-align:right;
	width:5.5rem;
	left:0;
	top:0;
	bottom:0;
}
.fa{color:#26a2ff;}
</style>

