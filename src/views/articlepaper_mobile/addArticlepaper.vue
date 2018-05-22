<template>
	<div>
		<mt-header fixed title="资讯信息新增">
			<router-link to="/listArticlepaper" slot="left">
				<mt-button icon="back"></mt-button>
			</router-link>
		</mt-header>
		<div class="content">
		</div>
		<mt-button class="width80" type="primary" size="small" @click="add">确定</mt-button>
	</div>
</template>

<script>
import api from "./articlepaperUrl";
import { Toast } from "mint-ui";
import utils from "../../utils/utils";

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
			formData : {
			}
		}
	},
	mixins : [utils],
	created() {
	},
	methods : {
		add() {
			api.addList(this.formData).then(res => {
				if (res.resultMap.resultCode == "SUCCESS") {
					Toast("新增成功");
					this.$router.push({path : "/listArticlepaper"});
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

