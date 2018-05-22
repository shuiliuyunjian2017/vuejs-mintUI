import Vue from 'vue';
import Router from 'vue-router';

import base from './base';
import articlecourse from '@/views/articlecourse_mobile/articlecourseRouter';
import articlecourseoutline from '@/views/articlecourseoutline_mobile/articlecourseoutlineRouter';
import articlepaper from '@/views/articlepaper_mobile/articlepaperRouter';

Vue.use(Router);
var routes = [base, articlecourse, articlecourseoutline, articlepaper];
var routeArr = [];
for (let i of routes) {
  routeArr = routeArr.concat(i);
};

const router = new Router({
  routes:routeArr
});

export default router;
