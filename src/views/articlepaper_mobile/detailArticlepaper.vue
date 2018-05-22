<template>
	<div>
		<mt-header fixed title="咨询详情">
			<router-link to="/listArticlepaper" slot="left">
				<mt-button icon="back"></mt-button>
			</router-link>
		</mt-header>
		<div class="content">
			<h3>{{data.paperTitle}}</h3>
			<img :src="data.imagePath" width="100%" alt="">
			<p>{{data.paperContentRtf}}</p>
		</div>
	</div>
</template>

<script>
import api from "./articlepaperUrl";
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
		api.toDetail({paperId : this.$route.params.paperId}).then(res => {
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
  padding:0 8px;
}
.content h3{
	line-height:32px;
	padding: 10px 0;
	text-align:center;
}
.content p{
	margin:20px 0;
	font-size:14px;
}
</style>

