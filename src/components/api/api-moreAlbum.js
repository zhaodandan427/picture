import builder from './api-common';
//上传更多相册

export const moreAlbum = builder.build({
  baseUrl: builder.BASEURL_01,
  url: '/mobile/photo/more',
  method: 'GET',
  simulation: false,
  simulator: '/static/api-simulation/homepage/picture.json',
});
