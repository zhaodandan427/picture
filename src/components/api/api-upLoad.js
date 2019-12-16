import builder from './api-common';
//照片上传
export const batchupload = builder.build({
  baseUrl: builder.BASEURL_01,
  url: '/mobile/photo/batchupload',
  method: 'POST',
  simulation: false,
  isFormData: true,
  simulator: '/static/api-simulation/homepage/selct.json',
});

