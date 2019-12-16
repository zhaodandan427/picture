import React from 'react';
import { Link } from 'react-router-dom';
import './jurisdiction.scss';
import Radio from '../../components/button/radio';

const mailList = window.test;
export default class Jurisdiction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    }
    this.list = [
      { title: "从通讯录选择", pathname: "mailList" },
      { title: "从会议人员选择", pathname: "meeting" }
    ];
  }
  _getValueInput(index) {
    if (index === 0) {
      sessionStorage.setItem('rightRange', 0)
    } else if (index === 1) {
      sessionStorage.setItem('rightRange', 1)
      let flag = !this.state.show;
      this.setState({
        show: flag
      })
    }
  }

  //完成
  complate() {
    this.props.history.push('/createAlbum')

  }
  pathNum(index) {
    if (index == 0) {
      mailList()//调用gocom 界面
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        setTimeout(() => {
          let userId = '';
          if (sessionStorage.getItem('userData')) {
            const datas = JSON.parse(sessionStorage.getItem('userData'));
            datas.users.forEach((s, i) => {
              userId += s.userId + ','
            })
            userId.substring(0, userId.lastIndexOf(','));
            sessionStorage.setItem('userId', userId)
          }
        }, 0);
      }, 1000);

    }
    else if (index == 1) {
      this.props.history.push('/meeting');
      
    }
  }

  render() {
    const flag = this.state.show;
    return (
      <div className={'createAlbum-wrap jurisdiction-wrap'}>
        <header>
          <Link to={'/createAlbum'}></Link>
          谁可以看
        <span onClick={this.complate.bind(this)}>完成</span>
        </header>
        <div className={'jurisdiction-content'}>
          <Radio getValueInput={this._getValueInput.bind(this)} />
          <ul className={`choick-list ${flag ? 'slidedown' : 'slideup'}`}>

            {
              this.list.map((s, i) => {
                return <li key={'jx' + i} onClick={this.pathNum.bind(this, i)}>
                  {s.title}
                </li>
              })
            }
          </ul>
        </div>
      </div>
    )
  }
  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}
