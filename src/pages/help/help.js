import React from 'react';
import { Link } from 'react-router-dom';
class Help extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          text1: '相册创建时，信息错误怎么办？',
          text2: '可由管理员在管理系统进行删除或修改相册信息。'
        },
        {
          text1: '对相册评论时，评论错误怎么办？',
          text2: '找到自己的评论信息，长按后根据提示删除即可。'
        },
        {
          text1: '如何删除照片？',
          text2: '进入相册点击管理照片选中要删除的照片，经确认后即可删除。仅可删除自己上传的照片。'
        },
        {
          text1: '照片被误删除了怎么办？',
          text2: '垃圾篓中可保留30日内删除的照片。在垃圾篓中找到对应照片恢复即可。'
        },
        {
          text1: '上传照片慢和失败怎么办?',
          text2: '上传慢或失败多因网络较差影响，请使用WIFI或信号良好的移动网络环境下操作。'
        }

      ]
    }
  }
  render() {
    return (
      <div className={'help-wrap'}>
        <header style={{
          textAlign: 'center'
        }}>
          <Link to='/'></Link>
          帮助
        </header>
        <div className={'help-content'}>
          {
            this.state.data.map((s, i) => {
              return <div className={'help-contents'} key={'jx' + i}>
                <p> Q:{s.text1}</p>
                <p style={{
                  marginTop: -34,
                  color: '#231F20'
                }}> A:{s.text2}</p>
              </div>
            })
          }
        </div>
      </div>
    )
  }
}
export default Help;