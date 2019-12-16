import builder from './api-common';
//垃圾篓相册列表
export const garbageList = builder.build({
  baseUrl: builder.BASEURL_01,
  url: '/mobile/wastebin/album/list',
  method: 'GET',
  simulation: false,
  simulator: '/static/api-simulation/homepage/picture.json',
});

//恢复相册
export const recover = builder.build({
  baseUrl: builder.BASEURL_01,
  url: '/mobile/wastebin/album/photo/recover',
  method: 'POST',
  simulation: false,
  isFormData: true,
  simulator: '/static/api-simulation/homepage/picture.json',
});
//删除垃圾篓
export const batchdel = builder.build({
  baseUrl: builder.BASEURL_01,
  url: '/mobile/wastebin/album/photo/batchdel',
  method: 'DELETE',
  simulation: false,
  simulator: '/static/api-simulation/homepage/picture.json',
});
//垃圾篓相册0-照片列表
export const photoList = builder.build({
  baseUrl: builder.BASEURL_01,
  url: '/mobile/wastebin/album/photo/list',
  method: 'GET',
  simulation: false,
  simulator: '/static/api-simulation/homepage/picture.json',
});
