import React from 'react';
import './App.css';
import { Route, HashRouter, Switch } from 'react-router-dom';
import HomePage from './pages/homepage/homepage';
import PhotoBrowsing from './pages/photoBrowsing/photoBrowsing';//相册浏览
import CreateAlbum from './pages/createAlbum/createAlbum';//创建相册
import Help from './pages/help/help';//帮助
import GarbageBasket from './pages/garbageBasket/garbageBasket';//垃圾篓
import UploadAlbum from './pages/uploadAlbum/uploadAlbum';//上传相册
import ManagePhotos from './pages/managePhotos/managePhotos';//管理相册
import MoreAlbum from './pages/moreAlbum/moreAlbum';//点击更多页面
import Comment from './pages/photoBrowsing/comment/comment';//评论
import Jurisdiction from './pages/jurisdiction/jurisdiction';//权限----谁可以看
import MailList from './pages/jurisdiction/mailList/mailList';//从通讯录中选择
import Meeting from './pages/jurisdiction/meeting/meeting';//从会议中选择
import DeleteThoroughly from './pages/deleteThoroughly/deleteThoroughly';//永久删除
function App() {
  return (
    <div className="App">
      <HashRouter>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/photoBrowsing/:id" component={PhotoBrowsing} />
          <Route path="/comment/:id" component={Comment} />
          <Route path="/createAlbum" component={CreateAlbum} />
          <Route path="/help" component={Help} />
          <Route path="/garbageBasket" component={GarbageBasket} />
          <Route path="/uploadAlbum/:id" component={UploadAlbum} />
          <Route path="/managePhotos/:id" component={ManagePhotos} />
          <Route path="/moreAlbum/:id" component={MoreAlbum} />
          <Route path="/jurisdiction" component={Jurisdiction} />
          <Route path="/mailList" component={MailList} />
          <Route path="/meeting" component={Meeting} />
          <Route path="/deleteThoroughly/:id" component={DeleteThoroughly} />
        </Switch>
      </HashRouter>

    </div>
  );
}

export default App;
