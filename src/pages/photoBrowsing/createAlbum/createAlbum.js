import React from 'react';
import { Link } from 'react-router-dom';
import * as api from '../../components/api/api-homepage';
import './createAlbum.scss';
import axios from 'axios';
import { ImagePicker } from 'antd-mobile';
import $ from 'jquery';
import CollapsePanel from 'antd/lib/collapse/CollapsePanel';
const url = window.BASEURL_01 + '/mobile/album/uploadImgs';
const urls = window.BASEURL_01 + '/mobile/album/uploadImg';
window.fileList = []
class CreateAlbum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      multiple: true,
      value: '',
      memo: ''
    }
    this.singFile = []
  }
  onChange = (files, type, index) => {

    if (type == 'add') {
      files.map((items, index) => {
        const formData = new FormData()
        let file = items.file;
        formData.append('img', file);
        formData.append('token', sessionStorage.token);
        let config = {
          headers: { 'Content-Type': 'multipart/form-data' }
        };
        axios.post(url, formData, config).then(response => {
          window.fileList.push(response.data.data[0])
        })
      })
      this.setState({
        files
      });

    } else {
      files.map((items, number) => {
        if (index == number) {
          files.splice(index, 1)
        }
      })
      this.setState({
        files
      })
    }
  }
  onChanges() {
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
      this.singFile.push(response.data.data)
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
  //点击跳转
  jumplist() {
    sessionStorage.setItem('formData', JSON.stringify({
      photoList: window.fileList,
      memo: this.state.memo,
      cover: this.singFile[0]
    }))
  }

  //点击完成
  complate() {
    var obj = {};
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
      photoList += items + ','
    })
    let listata = JSON.stringify(photoList);//创建相册
    //封面图
    let cover = '';
    if (this.formDatalist) {
      cover = this.formDatalist.cover
    } else {
      cover = this.singFile[0];
    }
    //是否公开
    let rightRange = sessionStorage.rightRange;

    //创建接口
    this._tokens.push(api.createAlbum.send({
      photoList: listata,
      memo: this.state.memo,
      rightRange: rightRange,
      userIds: userId,
      cover: cover,
      token: sessionStorage.token
    }).then(res => {
    }))
    //返回首页
    this.timerList = setTimeout(() => {
      this.props.history.push('/');
    }, 100)
  }
  componentWillUnmount() {
    this._clearTokens();
    clearTimeout(this.timerList)
  }

  componentDidMount() {
    if (sessionStorage.formData) {
      this.imgRef.setAttribute('src', this.formDatalist.cover)
      $("#prompt3").css("display", "none");
      $('#img3').css('display', 'block');
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
            <input type='text' ref={ref => this.inputRef = ref}
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
                ref={ref => this.imgPicker = ref}
              />
            </div>
          </div>
          <div className={'album-face'}>
            <p>相册封面</p>
            <div className={'up-load'}>
              <div id="imgPreview">
                <div id="prompt3">
                  <span id="imgSpan">
                    +
                  </span>
                  <input type="file" id="file" className="filepath" onChange={this.onChanges.bind(this)} accept="image/jpg,image/jpeg,image/png,image/PNG" />
                </div>
                <img src="#" id="img3" ref={ref => this.imgRef = ref} />
              </div>
            </div>
          </div>
          <div className={'jurisdiction'}>
            <div>谁可以看</div>
            <span onClick={this.jumplist.bind(this)}>
              <Link to={{
                pathname: '/jurisdiction'
              }}>
              </Link>
            </span>
          </div>
        </div>
      </div >
    )
  }

}
export default CreateAlbum;