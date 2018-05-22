import HomePage from '@/views/home.vue'

import CourseListPage from '@/views/course/list.vue'
import AddCoursePage from '@/views/course/add.vue'
import EditCoursePage from '@/views/course/edit.vue'
import CourseDetailPage from '@/views/course/detail.vue'

import LiveListPage from '@/views/live/list.vue'
import LiveDetailPage from '@/views/live/detail.vue'

import OtherListPage from '@/views/other/list.vue'

import PersonalPage from '@/views/personal.vue'

export default [
  {
    path: '/',//默认进入路由
    redirect: '/home'//重定向
  },
  {
    path: '/home',
    name: 'home',
    component: HomePage,
    meta: ['home', '首页'],
  },
  {
    path: '/courselist',
    name: 'courselist',
    component: CourseListPage,
    meta: ['courselist', '名师推荐'],
  },
  {
    path: '/addcourse',
    name: 'addcourse',
    component: AddCoursePage,
    meta: ['courselist', '添加课程'],
  },
  {
    path: '/editcourse/:courseId',
    name: 'editcourse',
    component: EditCoursePage,
    meta: ['courselist', '编辑课程'],
  },
  {
    path: '/coursedetail/:courseId',
    name: 'coursedetail',
    component: CourseDetailPage,
    meta: ['courselist', '名师推荐课程详情'],
  },
  {
    path: '/livelist',
    name: 'livelist',
    component: LiveListPage,
    meta: ['livelist', '口袋直播'],
  },
  {
    path: '/livedetail/:courseId',
    name: 'livedetail',
    component: LiveDetailPage,
    meta: ['livelist', '口袋直播课程详情'],
  },
  {
    path: '/otherlist',
    name: 'otherlist',
    component: OtherListPage,
    meta: ['otherlist', '其他列表'],
  },
  {
    path: '/personal',
    name: 'personal',
    component: PersonalPage,
    meta: ['personal', '个人主页'],
  },
]