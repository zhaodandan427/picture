import React from 'react';
import { Link } from 'react-router-dom';
import './garbageBasket.scss';
import * as api from '../../components/api/api-garbaget';
import DeletePicture from '../../components/deletePicture/deletePicture';
import Luo from 'iscroll-luo';

class GarbageBasket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
    this.pageNum = 1;
    this.pageCount = 20;
    this.isLoading = false;

  }
  /*退回事件 */
  goBack() {
    this.props.history.goBack()
  }
  _tokens = [];
  _clearTokens() {
    this._tokens.forEach((token) => token.cancel());
    this._tokens = [];
  }
  //垃圾篓相册接口
  garbageList() {
    this._tokens.push(api.garbageList.send({
      pgIndex: this.pageNum,
      pgCount: this.pageCount,
      token: sessionStorage.token
    }).then(res => {
      if (res.code === 200) {
        this.deletePictureRef._setData(res.data.elements);
        this.setState({
          data: res.data.elements
        })
      }
    }))
  }
  //上拉加载更多
  onDown() {
    this.pageNum = 1;
    this.state.data = [];
    this.garbageList();
  }
  //下拉刷新
  onUp() {
    this._tokens.push(api.garbageList.send({
      pgIndex: this.pageNum + 1,
      pgCount: this.pageCount,
      token:sessionStorage.token
    }).then(res => {
      if (res.code === 200) {
        let { data } = this.state//原始数据
        if (res.data.elements === null) {
          res.data.elements = []
        }
        if (res.data.elements.length < 1) {
          this.isLoading = true
        }
        if (this.pageNum * this.pageCount < res.data.totalElements) {
          this.pageNum++;

          let newList = res.data.elements;//新数据
          if (data[data.length - 1].date == newList[0].date) {//原始数据的最后一项的日期等于新数据的第一项的日期
            for (let i = 0; i < newList[0].albumList.length; i++) {
              data[data.length - 1].albumList.push(newList[0].albumList[i])//把新数据的子项push到原数组中
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
        this.setState({
          data
        })
        this.deletePictureRef._setData(data)
      }
    }))
  }

  componentDidMount() {
    const me = this;
    me.garbageList()
  }


  componentWillUnmount() {
    this._clearTokens();
  }
  render() {
    if (!this.state.data) {
      return <div className={'createAlbum-wrap garbageBasket-wrap'}>
        <header>
          <i onClick={this.goBack.bind(this)}></i>
          垃圾篓
        </header>
        <div className={'garbageBasket-content no-data'}>
          <span className={'task'}></span>
          <h4>暂无数据</h4>
        </div>
      </div>
    }
    return (
      <div className={'createAlbum-wrap garbageBasket-wrap'}>
        <header>
          <i onClick={this.goBack.bind(this)}></i>
          垃圾篓
        </header>
        <div className={'garbageBasket-content'} style={{
          position: 'relative',
          height: '85vh'
        }}>
          <Luo
            id='garbgebask'
            onDown={() => this.onDown()}
            onUp={() => this.onUp()}>
            <DeletePicture ref={ref => this.deletePictureRef = ref} />
          </Luo>
        </div>
      </div>
    )
  }
}
export default GarbageBasket;