import builder from './api-common';
//相片列表
export const listDetail = builder.build({
  baseUrl: builder.BASEURL_01,
  url: '/mobile/album/info',
  method: 'GET',
  simulation: false,
  simulator: '/static/api-simulation/homepage/selct.json',
});

//评论-----列表
export const commentList = builder.build({
  baseUrl: builder.BASEURL_01,
  url: '/mobile/comment/list',
  method: 'GET',
  simulation: false,
  simulator: '/static/api-simulation/homepage/selct.json',
});
//评论-----删除列表
export const commentDel = builder.build({
  baseUrl: builder.BASEURL_01,
  url: '/mobile/comment/del',
  method: 'DELETE',
  simulation: false,
  simulator: '/static/api-simulation/homepage/selct.json',
});
//评论------增加数据
export const commentAdd = builder.build({
  baseUrl: builder.BASEURL_01,
  url: '/mobile/comment/add',
  method: 'POST',
  simulation: false,
  isFormData: true,
  simulator: '/static/api-simulation/homepage/selct.json',
});
//点赞------列表
export const _thumbs = builder.build({
  baseUrl: builder.BASEURL_01,
  url: '/mobile/like/list',
  method: 'GET',
  simulation: false,
  simulator: '/static/api-simulation/homepage/selct.json',
});
//添加点赞
export const addThumbs = builder.build({
  baseUrl: builder.BASEURL_01,
  url: '/mobile/like/add',
  method: 'POST',
  simulation: false,
  isFormData: true,
  simulator: '/static/api-simulation/homepage/selct.json',
});
//取消点赞
export const deleteThumbs = builder.build({
  baseUrl: builder.BASEURL_01,
  url: '/mobile/like/cancel',
  method: 'POST',
  simulation: false,
  isFormData: true,
  simulator: '/static/api-simulation/homepage/selct.json',
});
//下载图片
export const downImg = builder.build({
  baseUrl: builder.BASEURL_01,
  url: '/mobile/photo/download',
  method: 'GET',
  simulation: false,
  isFormData: true,
  simulator: '/static/api-simulation/homepage/selct.json',
});
