import builder from './api-common';

//登录接口
export const login = builder.build({
  baseUrl: builder.BASEURL_01,
  url: '/login',
  method: 'POST',
  simulation: false,
  isFormData: true,
  simulator: '/static/api-simulation/homepage/picture.json',
});
//首页的图片列表
export const pictureList = builder.build({
  baseUrl: builder.BASEURL_01,
  url: '/mobile/album/list',
  method: 'GET',
  simulation: false,
  simulator: '/static/api-simulation/homepage/picture.json',
});
//创建相册
export const createAlbum = builder.build({
  baseUrl: builder.BASEURL_01,
  url: '/mobile/album/create',
  method: 'POST',
  simulation: false,
  isFormData: true,
  simulator: '/static/api-simulation/homepage/picture.json',
});
