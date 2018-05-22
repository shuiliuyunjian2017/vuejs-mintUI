import axios from './axios';

let postUrl = "http://192.168.13.238:9200/baseinfo";
let proxyUrl = "http://192.168.13.238:8083/iHF";
let fileUrl = "http://192.168.13.238:9200/uploadFileIO";
let imageUrl = "http://192.168.13.238:9200/uploadImgIO";

//第一个参数是url地址，第二个参数是请求传参，第三个参数修改请求过期时间
export default {
  //课程列表
  getCourseList (params) {
    return axios.post('/course/list', params);
  },
  //课程详情
  getCourseDetail (params) {
    return axios.post('/course/detail', params);
  },
  //直播资源列表
  getLiveList (params) {
    return axios.post('/live/list', params);
  },
  //直播资源详情
  getLiveDetail (params) {
    return axios.post('/live/detail', params);
  },
  //获取状态值的参数
  getMeetingStatus (params) {
    return axios.post(postUrl + 'system/code/ptCodeInt/ptListCodeInt', params);
  },
  // 查看详情
  getMeetingInfoDetail (params) {
    return axios.get(postUrl + 'meetingInfo/ptmeetinginfo/ptviewOne.yh', params);
  },
  // 修改详情
  updateMeetingInfo (params) {
    return axios.get(postUrl + 'meetingInfo/ptmeetinginfo/ptsaveOne.yh', params);
  },
  // 增加列表
  addMeetingInfo (params) {
    return axios.get(postUrl + 'meetingInfo/ptmeetinginfo/ptaddOne.yh', params);
  },
};
