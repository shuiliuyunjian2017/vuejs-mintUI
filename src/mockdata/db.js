// db.js
var Mock = require('mockjs');

module.exports = {
  getCourseList: Mock.mock({
    resultMap: {
      message: "操作成功！",
      resultCode: "000000",
      data: {
        "viewList|15":[{
          "courseId": "@character(upper)@string(number,11)",
          "thumbnailSrc": "../assets/img/cat.jpg",
          "courseName": "@ctitle(5, 15)",
          "courseDec": "@ctitle(10, 30)",
          "price": "@natural(0, 100)",
          "updateDateTime": "@now('year', 'yyyy-MM-dd')"
        }],
        totalRecordCount: 15
      }
    }
    
  }),
  getCourseDetail: Mock.mock({
    resultMap: {
      message: "操作成功！",
      resultCode: "000000",
      data: {
        "detail":{
          "courseId": "@character(upper)@string(number,11)",
          "thumbnailSrc": "../assets/img/cat.jpg",
          "courseName": "@ctitle(5, 15)",
          "courseIntroduce": "@ctitle(10, 30)",
          "price": "@natural(0, 100)",
          "updateDateTime": "@now('year', 'yyyy-MM-dd')"
        }
      }
    }
    
  }),
  getLiveList: Mock.mock({
    resultMap: {
      message: "操作成功！",
      resultCode: "000000",
      data: {
        "viewList|15":[{
          "courseId": "@character(upper)@string(number,11)",
          "thumbnailSrc": "../assets/img/cat.jpg",
          "courseName": "@ctitle(5, 25)",
          "courseDec": "@ctitle(10, 30)",
          "price": "@natural(0, 100)",
          "purchasedCount": "@natural(0, 10000)",
          "courseCount": "@natural(0, 100)",
          "startDateTime": "@now('year', 'yyyy-MM-dd')",
          "endDateTime": "@now('day', 'yyyy-MM-dd')",
          "updateDateTime": "@now('year', 'yyyy-MM-dd')"
        }],
        totalRecordCount: 15
      }
    }
    
  }),
  getLiveDetail: Mock.mock({
    resultMap: {
      message: "操作成功！",
      resultCode: "000000",
      data: {
        "detail":{
          "courseId": "@character(upper)@string(number,11)",
          "thumbnailSrc": "../assets/img/cat.jpg",
          "courseName": "@ctitle(5, 15)",
          "courseIntroduce": "@ctitle(10, 30)",
          "price": "@natural(0, 100)",
          "updateDateTime": "@now('year', 'yyyy-MM-dd')"
        }
      }
    }
    
  }),
};