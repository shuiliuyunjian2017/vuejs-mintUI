<template>
	<div>
		<mt-header fixed title="直播课程编辑">
			<router-link to="/listArticlecourse" slot="left">
				<mt-button icon="back"></mt-button>
			</router-link>
		</mt-header>
		<div class="content">
		</div>
		<mt-button class="width80" type="primary" size="small" @click="save">保存</mt-button>
	</div>
</template>

<script>
import api from "./articlecourseUrl";
import { Toast } from "mint-ui";

function toDouble(obj) {
	if(obj < 10){
		return "0" + obj;
	} else {
		return obj;
	}
}

export default {
	data () {
		return {
			data : "",
			formData : {
			}
		}
	},
	mixins : [utils],
	created() {
		api.toDetail({courseId : this.$route.params.courseId}).then(res => {
			if (res.resultMap.resultCode == "SUCCESS") {
				this.data=res.resultMap.data;
				this.formData.gradeName = this.data.gradeName;
				this.formData.subjectName = this.data.subjectName;
				this.formData.courseTitle = this.data.courseTitle;
				this.formData.imagePath = this.data.imagePath;
				this.formData.beginDt = this.data.beginDtStr;
				this.formData.endDt = this.data.endDtStr;
				this.formData.classCount = this.data.classCount;
				this.formData.price = this.data.price;
				this.formData.buyCount = this.data.buyCount;
				this.formData.version = this.data.version || this.data.iVersion;
        
			}
		}, res => {
			Toast(res.message);
		});
	},
	methods : {
		beginDtClick() {
			this.$refs.beginDtRef.open();
		},
		beginDtConfirm(val) {
			var temp = new Date(val);
			var time = temp.getFullYear() + "-" + toDouble(temp.getMonth() + 1) + "-" + toDouble(temp.getDate()) + " "
				+ toDouble(temp.getHours()) + ":" + toDouble(temp.getMinutes()) + ":" + toDouble(temp.getSeconds());
			this.formData.beginDt = time;
		},
		endDtClick() {
			this.$refs.endDtRef.open();
		},
		endDtConfirm(val) {
			var temp = new Date(val);
			var time = temp.getFullYear() + "-" + toDouble(temp.getMonth() + 1) + "-" + toDouble(temp.getDate()) + " "
				+ toDouble(temp.getHours()) + ":" + toDouble(temp.getMinutes()) + ":" + toDouble(temp.getSeconds());
			this.formData.endDt = time;
		},
		save() {
			api.saveDetail(this.formData).then(res => {
				if (res.resultMap.resultCode == "SUCCESS") {
					Toast("保存成功");
					this.$router.push({path:"/listArticlecourse"});
				}
			}, res => {
				Toast(res.resultMap.message);
			});	
		}
	}
}
</script>

<style scoped>
.content{
  margin-top:40px;
  text-align:left;
  padding:0 5px;
}
.width80{
  width:80px;
  margin-top:10px;
}
.mint-popup{width: 100%;}
.width80.mint-button{width:100%;}
.fa{
  margin-left:5px;
}
</style>

