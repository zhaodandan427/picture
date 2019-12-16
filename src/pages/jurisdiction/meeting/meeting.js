import React from 'react';
import { Link } from 'react-router-dom';
import * as api from '../../../components/api/api-jurisdiction';
import Maillist from '../../../components/permissionSelection/permissionSelection';
import Luo from 'iscroll-luo';
class Meeting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
    this.pageNum = 1
    this.pageCount = 20;
    this.isLoading = false;
  }
  _tokens = [];
  _clearTokens() {
    this._tokens.forEach((token) => token.cancel());
    this._tokens = [];
  }
  //上拉加载更多
  onUp() {
    const me = this;
    //会议列表
    me._tokens.push(api.meetingList.send({
      pgIndex: this.pageNum + 1,
      pgCount: this.pageCount,
      token: sessionStorage.token
    }).then(res => {
      if (res.code === 200) {
        this.pageNum++;
        let totalCount = [...this.state.data, ...res.data.elements];
        this.mailListRef._setData(totalCount);
        this.setState({
          data: totalCount
        })
        this.mailListRef._addList()
      }
    }))
  }

  componentDidMount() {
    const me = this;
    //会议列表
    me._tokens.push(api.meetingList.send({
      pgIndex: this.pageNum,
      pgCount: this.pageCount,
      token: sessionStorage.token
    }).then(res => {
      if (res.code === 200) {
        this.mailListRef._setData(res.data.elements);
        this.setState({
          data: res.data.elements
        })
      }
    }))
  }
  //完成
  complate() {
    //获取selectedUsers的过程;
    if (sessionStorage.getItem('userData')) {
      var datas = JSON.parse(sessionStorage.getItem('userData'));
      for (var i = 0; i < window.userArry.length; i++) {
        let fla = 0;
        for (var j = 0; j < datas.users.length; j++) {
          if (window.userArry[i].userId == datas.users[j].userId) {
            fla = 1
          }
        }
        if (fla == 0) {
          datas.users.push({ userId: window.userArry[i].userId })
        }
      }
      sessionStorage.setItem('userData', JSON.stringify(datas));
    } else if (window.userArry) {
      let data = { users: window.userArry }
      sessionStorage.setItem('userData', JSON.stringify(data));
    } else {
      sessionStorage.setItem('userData', '')
    }
    console.log(sessionStorage.rightRange)
    this.props.history.push('/jurisdiction');//跳转路由
  }

  componentWillUnmount() {
    this._clearTokens();
  }
  //
  render() {
    return (
      <div className={'createAlbum-wrap meeting-wrap'}>
        <header>
          <Link to={'/jurisdiction'}></Link>
          会议选择
        <span onClick={this.complate.bind(this)}>完成</span>
        </header>
        <div className={'meeting-content'} style={{
          position: 'relative',
          height: '85vh'
        }}>
          <Luo
            id='meetingChoic'
            onUp={() => this.onUp()}
            noDown={true}
            noDownStr={''}
            iscrollOptions={{
              preventDefault: false,
              click: false
            }}
          >
            <Maillist ref={ref => this.mailListRef = ref} />
          </Luo>
        </div>
      </div >
    )
  }
}
export default Meeting;