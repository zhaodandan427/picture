import React from 'react';
import { Link } from 'react-router-dom';
import { ImagePicker, Toast, ActivityIndicator } from 'antd-mobile';
import axios from 'axios';
class UploadAlbum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      multiple: true,
      isdiplay: false
    };
    this.id = this.props.match.params.id;
    this.imges = '';



  }
  //上传相册
  onChange = (files, type, index) => {
    this.imges = files;
    this.setState({
      files,
    });
  }
  //弹窗的方法
  successToast(title) {
    Toast.success(title, 1);
  }
  //提示框
  inFor() {
    Toast.info('请上传图片', 1);
  }
  //加载loading

  //点击完成
  complete() {
    this.setState({
      isdiplay: true
    })
    let fileList = this.imges;
    if (fileList.length > 0) {
      fileList.map((items, index) => {
        let file = items.file;
        const formData = new FormData()
        formData.append('img', file);
        formData.append('token', sessionStorage.token);
        formData.append('albumId', this.id);
        let config = {
          headers: { 'Content-Type': 'multipart/form-data' }
        };

        axios.post(`${this.url}?token=${sessionStorage.token}&albumId=${this.id}`, formData, config).then(response => {
          //loading加载
          if (index == fileList.length - 1) {
            this.setState({
              isdiplay: false
            })
            if (this.state.files.length > 0) {
              this.successToast('图片上传成功')
            }
            this.props.history.push(`/photoBrowsing/${this.id}`);
          }
        })
      })
    } else {
      this.inFor()
    }

    //提示框

  }
  _tokens = [];
  _clearTokens() {
    this._tokens.forEach((token) => token.cancel());
    this._tokens = [];
  }

  componentDidMount() {
    const me = this;
    this.url = `${window.BASEURL_01}/mobile/photo/batchupload`;
  }
  render() {
    let id = this.props.match.params.id;
    const { files } = this.state;
    return (
      <div className={'createAlbum-wrap'}>
        <header>
          <Link to={{
            pathname: `/photoBrowsing/${id}`
          }}></Link>
          上传相册
       <span onClick={this.complete.bind(this)}>完成</span>
        </header>
        <div className={'createAlbum-content'}>
          <ImagePicker
            files={files}
            onChange={this.onChange}
            onImageClick={(index, fs) => console.log(index, fs)}
            selectable={files.length < 9}
            multiple={this.state.multiple}
            length={3}
          />
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
      </div>
    )
  }
}
export default UploadAlbum;
