import React from 'react';
import { Link } from 'react-router-dom';
import * as api from '../../components/api/api-homepage';
import './createAlbum.scss';
import axios from 'axios';
import { ImagePicker, Toast, ActivityIndicator } from 'antd-mobile';
import $ from 'jquery';
const url = window.BASEURL_01 + '/mobile/album/uploadImgs';
const urls = window.BASEURL_01 + '/mobile/album/uploadImg';
window.fileList = [];
window.count = 0;//存上次的图片的length
class CreateAlbum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      multiple: true,
      value: '',
      memo: '',
      isdiplay: false
    }
    this.singFile = [];

  }
  onChange = (files, type, index) => {
    this.setState({
      isdiplay: true
    })

    if (type == 'add') {
      for (let i = window.count; i < files.length; i++) {
        let items = files[i];
        const formData = new FormData();
        let file = items.file;
        formData.append('imageFile[]', file);
        formData.append('token', sessionStorage.token);
        let config = {
          headers: { 'Content-Type': 'multipart/form-data' }
        };
        axios.post(url, formData, config).then(response => {
          this.setState({
            isdiplay: false
          })
          window.fileList.push(response.data.data[0])
        })
      }
      window.count = files.length;
    }
    else {
      let { files } = this.state;
      window.count = files.length;
      if ((index + 1) == window.count) {
        files.splice(index, 1)
      }
      this.setState({
        files,
        isdiplay: false
      })
    }
    this.setState({
      files
    })
  }
  onChanges() {
    this.setState({
      isdiplay: true
    })
    $("#prompt3").css("display", "none");
    let reads = new FileReader();
    let fileI = document.getElementById('file').files[0];
    reads.readAsDataURL(fileI);
    reads.onload = function (e) {
      document.getElementById('img3').src = this.result;
      $("#img3").css("display", "block");
    };
    const formData = new FormData();
    formData.append('img', fileI);
    formData.append('token', sessionStorage.token);
    let config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    };
    axios.post(urls, formData, config).then(response => {
      this.setState({
        isdiplay: false
      })
      this.singFile.push(response.data.data);

    })
  }
  //输入框
  changeVal(e) {
    this.setState({
      memo: e.target.value
    })
  }

  _tokens = [];
  _clearTokens() {
    this._tokens.forEach((token) => token.cancel());
    this._tokens = [];
  }
  //轻弹出框
  promptBox() {
    Toast.info('请输入相册描述', 1);
  }
  //点击跳转
  jumplist() {
    let url = '';
    if (sessionStorage.formData) {
      let corObj = JSON.parse(sessionStorage.formData)
      if (corObj.cover) {
        url = corObj.cover
      }
    }
    if (url != '') {//不为空时，走的是存储的照片
      sessionStorage.setItem('formData', JSON.stringify({
        photoList: window.fileList,
        memo: this.state.memo,
        cover: url
      }))
    } else {//否则就是默认开始的状态
      sessionStorage.setItem('formData', JSON.stringify({
        photoList: window.fileList,
        memo: this.state.memo,
        cover: this.singFile[0],
      }))
    }
    this.props.history.push('/jurisdiction');
  }

  //点击完成
  complate() {
    var userId = '';
    //获取selectedUsers的过程;
    if (sessionStorage.getItem('userData')) {
      var datas = JSON.parse(sessionStorage.getItem('userData'));
      for (var i = 0; i < datas.users.length; i++) {
        if (i == 0) {
          userId = datas.users[i].userId;
        } else {
          userId += ',' + datas.users[i].userId;
        }
      }
    } else {
      userId = ''
    }



    let photoList = '';//上传相册
    window.fileList.map((items, index) => {
      if (index == 0) {
        photoList = items;
      } else {
        photoList += ',' + items
      }
    })
    let listata = photoList;//创建相册
    console.log(listata)

    //封面图
    let cover = '';
    if (this.formDatalist) {
      cover = this.formDatalist.cover;
    } else {
      cover = this.singFile[0];
    }
    //是否公开
    let rightRange = sessionStorage.rightRange;

    //判断描述不为空
    if (this.state.memo == '') {
      this.promptBox()
    } else {
      //判断自己是否可见
      if (userId == '') {
        userId = sessionStorage.loginManger//默认创建者可以看
      } else {
        userId = userId + ',' + sessionStorage.loginManger
      }
      //创建接口
      this._tokens.push(api.createAlbum.send({
        photoList: listata,
        memo: this.state.memo,
        rightRange: rightRange,
        userIds: userId,
        cover: cover,
        token: sessionStorage.token
      }).then(res => {
        if (res.code == 200) {
          this.props.history.push('/');
        }
      }))
    }

  }
  componentWillUnmount() {
    this._clearTokens();

  }

  componentDidMount() {
    if (sessionStorage.formData) {
      let corObj = JSON.parse(sessionStorage.formData)
      if (corObj.cover) {
        this.imgRef.setAttribute('src', corObj.cover)
        $("#prompt3").css("display", "none");
        $('#img3').css('display', 'block');
      }
    }
  }
  componentWillMount() {
    if (sessionStorage.formData) {
      this.formDatalist = JSON.parse(sessionStorage.getItem('formData'));
      let memo = this.formDatalist.memo;
      this.state.memo = memo;
      this.formDatalist.photoList.map((items, index) => {
        this.state.files.push({
          url: items
        })
      })
    }
  }
  render() {
    const { files, memo } = this.state;
    return (
      <div className={'createAlbum-wrap'}>
        <header>
          <Link to={'/'}></Link>
          创建相册
        <span onClick={this.complate.bind(this)}>完成</span>
        </header>
        <div className={'createAlbum-content'}>
          <div className={'album-description'}>
            <textarea className={'input-memo'} type='text' ref={ref => this.inputRef = ref}
              placeholder='请输入相册介绍'
              value={memo}
              onChange={this.changeVal.bind(this)} />
            <div className={'image-picker'}>
              <ImagePicker
                files={files}
                onChange={this.onChange}
                onImageClick={(index, fs) => console.log(index, fs)}
                selectable={files.length < 9}
                multiple={this.state.multiple}
                length={3}
              />
            </div>
          </div>
          <div className={'album-face'}>
            <p>相册封面</p>
            <div className={'up-load'}>
              <div id="imgPreview">
                <div id="prompt3">
                  <input type="file" id="file" className="filepath"
                    onChange={this.onChanges.bind(this)}
                    accept="image/jpg,image/jpeg,image/png,image/PNG" />
                </div>
                <img src="#" id="img3" ref={ref => this.imgRef = ref} />
              </div>
            </div>
          </div>
          <div className={'jurisdiction'}>
            <div>谁可以看</div>
            <span className={'jumpt'} onClick={this.jumplist.bind(this)}>
            </span>
          </div>
        </div>
        <div style={{
          position: 'fixed',
          left: 0,
          top: 0,
          opacity: 0.8,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.65)',
          zIndex: 3000,
          pointerevents: 'none',//不能操作
          display: this.state.isdiplay == true ? "block" : 'none'
        }}>
          <ActivityIndicator
            toast
            text="Loading..."
            animating={this.state.animating}
          />
        </div>
      </div >
    )
  }

}
export default CreateAlbum;