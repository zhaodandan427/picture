
import React from 'react';
import { Link } from 'react-router-dom'
import './homepage.scss';
import * as api from '../../components/api/api-homepage';
import Picture from '../../components/homePicture/homePicture';
import $ from 'jquery';
import Luo from 'iscroll-luo';

const gocome = window.GoCom;
class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTime: true,
      showCommon: true,
      sortingPoint: true,
      show: false,
      data: [],
      searchValue: '',
      list: [
        { name: '帮助', pathname: 'help' },
        { name: '垃圾篓', pathname: 'garbageBasket' }
      ]

    };
    this.pageNum = 1;
    this.pageCount = 20;
    this.isLoading = false;


  }
  /*事件--------------------start */

  //返回轻应用页面
  goComBack() {
    gocome.closeWindow()
  }
  //时间
  sortingTime() {
    let flag = !this.state.showTime;
    this.setState({
      showTime: flag
    })
    if (flag) {//升序
      this._albumList('createTime', 'desc')
    }
    else if (!flag) {//降序
      this._albumList('createTime', 'asc')
    }
  }
  //评论
  sortinCommon() {
    let flag = !this.state.showCommon;
    this.setState({
      showCommon: flag
    })
    if (flag) {//升序
      this._albumList('commentCount', 'desc')
    }
    else if (!flag) {//降序
      this._albumList('commentCount', 'asc')
    }

  }
  //点赞
  sortingPoint() {
    let flag = !this.state.sortingPoint;
    this.setState({
      sortingPoint: flag
    })
    if (flag) {//升序
      this._albumList('likeCount', 'desc')
    }
    else if (!flag) {//降序
      this._albumList('likeCount', 'asc')
    }

  }
  //点击创建创建相册。。。。。
  select() {
    delete sessionStorage.userData;
    delete sessionStorage.formData;
    delete sessionStorage.checked;
    let flag = !this.state.show;
    let list = this.state.list;
    window.fileList = [];
    window.count = 0;
    this.setState({
      show: flag,
    })

  }
  //点击取消
  cancel() {
    this.lookRef.style.display = 'block'
    this.searchWrap.style.display = 'none';
    this.menuRef.style.display = 'block'
    this.deleteRef.style.opacity = 0;
    this.setState({
      searchValue: ''
    })
    this._albumList()
  }
  //点击搜索
  search() {
    this.searchWrap.style.display = 'block';
    this.lookRef.style.display = 'none';
    this.menuRef.style.display = 'none'

  }
  //点击X号清空input的value值
  clear() {
    // this.inputRef.value = '';
    this.deleteRef.style.opacity = 0;
    this.setState({
      searchValue: ''
    })
  }
  //获取input 光标
  focus() {
    this.deleteRef.style.opacity = 1
  }
  inputChange(event) {
    let searchValue = event.target.value;
    this.setState({
      searchValue
    })
  }

  _enter() {
    $('#search').on('keypress', (e) => {
      if (e.keyCode == 13) {
        this._albumList('', '', this.state.searchValue)
      }
    })
  }
  //点击Dom 让创建相册那快消失
  _elementTag() {
    this.setState({
      show: false
    })
  }
  /*事件------------------------------end */

  /*接口封装---------------------------start */
  //相册列表
  _albumList(sortColumn, sortType, memo, pgIndex, pgCount) {
    const me = this;
    me._tokens.push(api.pictureList.send(
      {
        sortColumn: sortColumn,
        sortType: sortType,
        memo: memo,
        pgIndex: this.pageNum,
        pgCount: this.pageCount,
        token: sessionStorage.token
      }
    ).then(res => {
      if (res.code === 200) {
        this.pictureList._setData(res.data.elements);
        this.setState({
          data: res.data.elements
        })
      }
    }))
  }
  /*接口封装---------------------------end */
  //上拉加载下拉刷新
  /** 下拉刷新 **/
  onDown() {
    this.pageNum = 1;
    this.state.data = [];
    this._albumList('createTime', 'desc');
  }

  /** 上拉加载更多 **/
  onUp() {
    const me = this;
    me._tokens.push(api.pictureList.send(
      {
        sortColumn: 'createTime',
        sortType: 'desc',
        memo: this.state.searchValue,
        pgIndex: this.pageNum + 1,
        pgCount: this.pageCount,
        token: sessionStorage.token
      }
    ).then(res => {
      if (res.code == 200) {
        let { data } = this.state//原始数据
        if (res.data.elements === null) {
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

        } else {
          this.isLoading = false;
        }
        this.setState({
          data
        })
        this.pictureList._setData(data);
      }
    }))
    /** 注意此处，就算没有更多数据了或接口调用失败等情况，也要刷一下原始数据，Luo内部才知道状态更新了 **/
  }
  //获取token
  GetQueryString(param) { //param为要获取的参数名 注:获取不到是为null
    var currentUrl = window.location.href; //获取当前链接
    var arr = currentUrl.split("?");//分割域名和参数界限
    if (arr.length > 1) {
      arr = arr[1].split("&");//分割参数
      for (var i = 0; i < arr.length; i++) {
        var tem = arr[i].split("="); //分割参数名和参数内容
        if (tem[0] == param) {
          return tem[1];
        }
      }
      return null;
    }
    else {
      return null;
    }
  }

  _tokens = [];
  _clearTokens() {
    this._tokens.forEach((token) => token.cancel());
    this._tokens = [];
  }

  componentDidMount() {
    const me = this;
    try {
      gocome.maxWindow("isMaxWindow");
    } catch (e) {
    }
    sessionStorage.setItem('rightRange', 0)
    //
    //相册--列表

    me._albumList('createTime', 'desc');
    me._enter();
  }

  componentWillUnmount() {
    this._clearTokens();
  }

  componentWillMount() {
    const me = this;
    let tokens = me.GetQueryString('token');
    if (tokens) {
      sessionStorage.setItem('token', tokens);
      this.loginToken = tokens
    }
    else {
      this.loginToken = sessionStorage.token
    }
    me._tokens.push(api.login.send({
      token: this.loginToken
    }).then(res => {
      sessionStorage.setItem('roleManger', res.data.role);
      sessionStorage.setItem('loginManger', res.data.userId);
      sessionStorage.setItem('creatorName', res.data.trueName);

      if (res.data.role === 'ADMIN') {
        this.setState({
          list: [{ name: '创建相册', pathname: 'createAlbum' },
          { name: '帮助', pathname: 'help' },
          { name: '垃圾篓', pathname: 'garbageBasket' },]
        })
      } else {
        this.setState({
          lsit: [{ name: '帮助', pathname: 'help' },
          { name: '垃圾篓', pathname: 'garbageBasket' }]
        })
      }
    }))
  }

  //数据渲染
  render() {
    const flag0 = this.state.showTime;
    const flag1 = this.state.showCommon;
    const flag2 = this.state.sortingPoint;
    const flag = this.state.show;
    const { searchValue, list } = this.state;
    return (
      <div className={'hompage-wrap'}>
        <div className={'homepage-items'} >
          <header >
            <div ref={ref => this.lookRef = ref} style={{
              display: 'block'
            }}>
              <span onClick={this.goComBack.bind(this)} ></span>
              <span>活动相册</span>
            </div>
            <span className={'search'} onClick={this.search.bind(this)}></span>
            <span ref={ref => this.menuRef = ref}
              style={{
                display: 'block'
              }}
              className={'select'} onClick={this.select.bind(this)}></span>
            <div className={`dialog-wrap ${flag ? 'slidedown' : 'slideup'} `} >
              <ul >
                {
                  list.map((s, i) => {
                    return <li key={'zl' + i}>
                      <Link to={`/${s.pathname}`}>{s.name}</Link>
                    </li>
                  })
                }
              </ul>
            </div>
          </header>
          <ul className={'sort-wrap'}  >
            <li><span>时间</span><span onClick={this.sortingTime.bind(this)} className={flag0 ? 'hidei' : 'showi'}></span></li>
            <li><span>评论</span><span onClick={this.sortinCommon.bind(this)} className={flag1 ? 'hidei' : 'showi'}></span></li>
            <li><span>点赞</span><span onClick={this.sortingPoint.bind(this)} className={flag2 ? 'hidei' : 'showi'}></span></li>
          </ul>

        </div>

        <div className={'content'}
          onClick={this._elementTag.bind(this)}
          style={{
            position: 'relative'
            , height: '85vh',
          }} ref={ref => this.scrollDom = ref}>
          <Luo
            id='homePageList'
            onDown={() => this.onDown()}
            onUp={() => this.onUp()}>
            <Picture ref={ref => this.pictureList = ref} />
          </Luo>
        </div>

        <div className={'search-wrap'} ref={ref => this.searchWrap = ref} style={{
          display: 'none'
        }}>

          <input type={'search'}
            id={'search'}
            value={searchValue}
            onFocus={this.focus.bind(this)}
            onChange={this.inputChange.bind(this)} />
          <span className={'delete'}
            ref={ref => this.deleteRef = ref}
            style={{ opacity: 0 }}
            onClick={this.clear.bind(this)}
          >
          </span>
          <span onClick={this.cancel.bind(this)}>取消</span>
        </div>
      </div >
    )
  }
}
export default HomePage;
