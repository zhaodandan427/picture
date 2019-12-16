import builder from './api-common';
//管理相册

export const mangeList = builder.build({
  baseUrl: builder.BASEURL_01,
  url: '/mobile/photo/managelist',
  method: 'GET',
  simulation: false,
  simulator: '/static/api-simulation/homepage/selct.json',
});
//删除相册
export const deleteAlbum = builder.build({
  baseUrl: builder.BASEURL_01,
  url: '/mobile/photo/batchdel',
  method: 'DELETE',
  simulation: false,
  simulator: '',
});