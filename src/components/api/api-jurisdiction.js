import builder from './api-common';
//从人员中选择
// export const mailList = builder.build({
//   baseUrl: builder.BASEURL_01,
//   url: '/',
//   method: 'GET',
//   simulation: true,
//   simulator: '/static/api-simulation/jurisdiction/list.json',
// });

//会议列表
export const meetingList = builder.build({
  baseUrl: builder.BASEURL_01,
  url: '/right/meeting/user/list',
  method: 'GET',
  simulation: false,
  simulator: '/static/api-simulation/homepage/picture.json',
});