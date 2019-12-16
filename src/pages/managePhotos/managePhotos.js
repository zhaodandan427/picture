import React from 'react';
import { Link } from 'react-router-dom';
import * as api from '../../components/api/api-mangePhoto';
import './mangePhone.scss';
import SelectAll from '../../components/selectAll/selectAll';
import Dialog from '../../components/dialog/againDialog';
import Luo from 'iscroll-luo';
import { Toast } from 'antd-mobile';

class ManagePhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
    this.pageNum = 1;
    this.pageCount = 20;
    this.isLoading = false;
    this.id = this.props.match.params.id;
    this.photoId = '';
    this.ids = '';
  }
  //提示tost
  //弹窗的方法
  successToast(title) {
    Toast.success(title, 1);
  }
  //点击删除
  delete() {
    this.getPhotoid();
    if (this.ids !== '') {
      this.dialogRef._open(); //出现弹框
    } else {
      this.successToast('请选择图片')
    }

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
  //点击确认按钮
  confirm() {
    const me = this;
    let { data } = this.state;
    me._tokens.push(api.deleteAlbum.send({
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
        this.imgSrcRef.test()
        this.imgSrcRef.jugement();
        this.successToast('删除成功')
      }
    }))


    //删除页面中的数据


  }

  //通过ref获取
  getAllSelected() {
    let selected = [];
    for (let item in this.refs) {
      if (this.refs[item].className === 'default') {
        selected.push(this.refs[item]);
      }
    }
    return selected;
  }

  /**事件-------------------end */

  _tokens = [];
  _clearTokens() {
    this._tokens.forEach((token) => token.cancel());
    this._tokens = [];
  }

  _photoList() {
    const me = this;
    //管理相册的接口
    me._tokens.push(api.mangeList.send({
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
  componentDidMount() {
    this._photoList()
  }

  componentWillUnmount() {
    this._clearTokens();
  }
  //下拉刷新
  onDown() {
    this.pageNum = 1;
    this.state.data = []
    this._photoList();
  }
  //上拉加载
  /** 上拉加载更多 **/
  onUp() {
    const me = this;
    me._tokens.push(api.mangeList.send(
      {
        albumId: this.id,
        pgIndex: this.pageNum + 1,
        pgCount: this.pageCount,
        token: sessionStorage.token
      }
    ).then(res => {
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
    /** 注意此处，就算没有更多数据了或接口调用失败等情况，也要刷一下原始数据，Luo内部才知道状态更新了 **/
  }
  render() {
    let id = this.props.match.params.id;
    return (
      <div className={'createAlbum-wrap mangePhone-wrap'}>
        <header>
          <Link
            to={{
              pathname: `/photoBrowsing/${id}`
            }}
          />
          管理相册
					<span
            style={{
              position: 'absolute',
              right: '1rem'
            }}
            onClick={this.delete.bind(this)}
          >
            删除
					</span>
        </header>
        <div className={'mangePhone-content'} style={{
          position: 'relative',
          height: '85vh'
        }}>
          <Luo
            id='mangePhotos'
            onDown={() => this.onDown()}
            onUp={() => this.onUp()}
          >
            <SelectAll ref={ref => this.imgSrcRef = ref} />
          </Luo>
        </div>
        <Dialog ref={(ref) => (this.dialogRef = ref)} onSure={this.confirm.bind(this)} />
      </div>
    );
  }
}
export default ManagePhotos;