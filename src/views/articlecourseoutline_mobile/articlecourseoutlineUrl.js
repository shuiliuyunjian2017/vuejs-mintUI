import axios from '@/api/axios';
let postUrl = "http://192.168.13.238:9200/baseinfo";
let proxyUrl = "http://192.168.13.238:8083/iHF";
let fileUrl = "http://192.168.13.238:8400/uploadFileIO";
let imageUrl = "http://192.168.13.238:8400/uploadImgIO";

export default {
	// 获取地址
	getPostUrl() {
		return proxyUrl;
	},
	// 获取文件上传接口
	getFileUrl() {
		return fileUrl;
	},
	// 获取图片上传接口
	getImageUrl() {
		return imageUrl;
	},
	// 判断登录是否过期
	judgeTicket(params) {
		return axios.post(proxyUrl + '/baseInfo/proxyValidateJson.yh', params);
	},
	// 获取状态值的参数
	getCodeIntType(params) {
		return axios.post(postUrl + '/code/ptCodeInt/ptListCodeInt', params);
	},
	// 获取列表
	getList(params) {
		return axios.get(postUrl + '/atest/ptarticlecourseoutline/ptviewList', params, 3000);
		// return axios.get(postUrl + "/atest/ptarticlecourseoutline/ptviewList.yh", params, 3000);
	},
	// 删除列表数据
	delList(params) {
		return axios.get(postUrl + '/atest/ptarticlecourseoutline/ptdelete', params, 3000);
		// return axios.get(postUrl + "/atest/ptarticlecourseoutline/ptdelete.yh", params, 3000);
	},
	// 增加列表
	addList(params) {
		return axios.get(postUrl + '/atest/ptarticlecourseoutline/ptaddOne', params, 3000);
		// return axios.get(postUrl + "/atest/ptarticlecourseoutline/ptaddOne.yh", params, 3000);
	},
	// 查看详情
	toDetail(params) {
		return axios.get(postUrl + '/atest/ptarticlecourseoutline/ptviewOne', params, 3000);
		// return axios.get(postUrl + "/atest/ptarticlecourseoutline/ptviewOne.yh", params, 3000);
	},
	// 修改详情
	saveDetail(params) {
		return axios.get(postUrl + '/atest/ptarticlecourseoutline/ptsaveOne', params, 3000);
		// return axios.get(postUrl + "/atest/ptarticlecourseoutline/ptsaveOne.yh", params, 3000);
	}
}