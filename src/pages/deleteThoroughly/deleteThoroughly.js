import React from 'react';
import * as api from '../../components/api/api-garbaget';
import './deleteThoroughlyWrap.scss';
import SelectAll from '../../components/selectAll/selectAll';
import Dialog from '../../components/dialog/againDialog';
import Luo from 'iscroll-luo';
import { Toast } from 'antd-mobile';
class DeleteThoroughly extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
    this.pageNum = 1;
    this.pageCount = 20;
    this.id = this.props.match.params.id;
    this.photoId = '';
    this.ids = '';
  }
  _tokens = [];
  _clearTokens() {
    this._tokens.forEach((token) => token.cancel());
    this._tokens = [];
  }

  //轻提示框
  toask(title) {
    Toast.success(title, 1);
  }
  //获取图片id
  getPhotoid() {
    let { data } = this.state;
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].photoList.length; j++) {
        if (data[i].photoList[j].isClicked == true) {
          this.photoId += data[i].photoList[j].photoId + ',';
        }
      }
    }
    this.ids = this.photoId.substring(0, this.photoId.length - 1);
  }

  //点击删除
  deleteClick() {
    this.getPhotoid();
    if (this.ids !== '') {
      this.dialogRef._open();//出现弹框
    } else {
      Toast.info('请选择照片')
    }
  }
  //恢复
  refSove() {
    this.getPhotoid();
    if (this.ids !== '') {
      this.dialogRefSoveRef._open()//出现恢复弹框
    } else {
      Toast.info('请选择照片')
    }
  }
  //恢复确认
  confirmRefSove() {
    const me = this;
    let { data } = this.state;
    me._tokens.push(api.recover.send({
      albumId: this.id,
      photoIds: this.ids,
      token: sessionStorage.token
    }).then(res => {
      if (res.code == 200) {
        let photoIdList = this.ids.split(',');
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].photoList.length; j++) {
            for (let m = 0; m < photoIdList.length; m++) {
              if (data[i].photoList[j].photoId == photoIdList[m]) {
                data[i].photoList.splice(j, 1);
                if (j > 0) {
                  j--
                }
              }
            }
          }
        }
        this.setState({
          data
        })
        photoIdList = '';
        this.photoId = '';
        this.imgSrcRef.test();
        this.imgSrcRef.jugement();
      }

    }))
    this.toask('恢复成功')
  }
  //删除确认
  confirm() {
    const me = this;
    let { data } = this.state;
    me._tokens.push(api.batchdel.send({
      photoIds: this.ids,
      pgIndex: this.pageNum,
      pgCount: this.pageCount,
      token: sessionStorage.token
    }).then(res => {
      if (res.code === 200) {
        let photoIdList = this.ids.split(',');
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].photoList.length; j++) {
            for (let m = 0; m < photoIdList.length; m++) {
              if (data[i].photoList[j].photoId == photoIdList[m]) {
                data[i].photoList.splice(j, 1);
                if (j > 0) {
                  j--
                }
              }
            }
          }
        }
        this.setState({
          data
        })
        photoIdList = '';
        this.photoId = '';
        this.imgSrcRef.test();
        this.imgSrcRef.jugement()
      }
    }))
    this.toask('删除成功')
  }
  componentWillUnmount() {
    this._clearTokens();
  }
  //垃圾篓相册照片接口
  garbagePhotolist() {
    this._tokens.push(api.photoList.send({
      albumId: this.id,
      pgIndex: this.pageNum,
      pgCount: this.pageCount,
      token: sessionStorage.token
    }).then(res => {
      if (res.code === 200) {
        if (res.data == null) {
          this.imgSrcRef._setData([]);
          this.setState({
            data: []
          })
        } else {
          this.imgSrcRef._setData(res.data.elements);
          this.setState({
            data: res.data.elements
          })
        }
      }
    }))
  }
  //上拉加载更多
  onUp() {
    const me = this;
    me._tokens.push(api.photoList.send({
      albumId: this.id,
      pgIndex: this.pageNum + 1,
      pgCount: this.pageCount,
      token: sessionStorage.token
    }).then(res => {
      if (res.code == 200) {
        let { data } = this.state//原始数据
        if (res.data == null) {
          this.imgSrcRef._setData([]);
          this.setState({
            data: []
          })
        } else {
          if (this.pageNum * this.pageCount < res.data.totalElements) {
            this.pageNum++;

            let newList = res.data.elements;//新数据
            if (data[data.length - 1].date == newList[0].date) {//原始数据的最后一项的日期等于新数据的第一项的日期
              for (let i = 0; i < newList[0].photoList.length; i++) {
                data[data.length - 1].photoList.push(newList[0].photoList[i])//把新数据的子项push到原数组中
              }
              if (newList.lenght > 1) {
                for (let m = 1; newList.length; m++) {//循环分页从第二页开始
                  data.push(newList[m]) //原始数据push新数据
                }
              }
            } else {
              data = data.concat(newList)
            }

          }
        }
        this.setState({
          data
        })
        this.imgSrcRef._setData(data);
      }

    }))
  }
  //下拉刷新
  onDown() {
    this.pageNum = 1;
    this.state.data = [];
    this.garbagePhotolist()
  }
  back() {
    this.props.history.goBack()
  }
  componentDidMount() {
    const me = this;
    me.garbagePhotolist()
  }
  render() {
    let id = this.props.match.params.id;
    return (
      <div className={'createAlbum-wrap deleteThoroughly-wrap'}>
        <header>
          <span className={'backBtn'} onClick={this.back.bind(this)}></span>
          垃圾篓
        </header>
        <div className={'  mangePhone-content deleteThoroughly-content'} style={{
          position: 'relative',
          height: '85vh'
        }}>
          <Luo
            id='deletehorouhly'
            onUp={() => this.onUp()}
            onDown={() => this.onDown()}
          >
            <SelectAll ref={ref => this.imgSrcRef = ref} />
          </Luo>
        </div>
        <Dialog ref={(ref) => (this.dialogRef = ref)} onSure={this.confirm.bind(this)} />
        <footer>
          <ul className={'label-list'}>
            <li onClick={
              this.deleteClick.bind(this)}
            >删除</li>
            <li onClick={this.refSove.bind(this)}>恢复</li>
          </ul>
        </footer>
        <Dialog ref={(ref) => (this.dialogRefSoveRef = ref)}
          title={'确认要恢复吗'}
          onSure={this.confirmRefSove.bind(this)} />
      </div >

    )
  }
}
export default DeleteThoroughly;