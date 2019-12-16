import React from 'react';
import { Link } from 'react-router-dom'
import './picture.scss';
import imglink from './morenfengmian.png'
class Picture extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  _setData(d) {
    this.setState({
      data: d
    })
  }


  _addList() {
    let datas = this.state.data;
    if (datas) {
      return datas.map((s, index) => {
        return <div key={index} className={'picturList'}>
          <h3>{s.date}</h3>
          <ul className={'content-area'}>
            {
              s.albumList.map((item, number) => {
                let imgurl = ''
                if (item.coverImgUrl) {
                  imgurl = item.coverImgUrl;
                } else {
                  imgurl = imglink
                }
                return <li key={'jx' + number}>
                  <div>
                    <p>{item.memo}</p>
                    <Link to={{
                      pathname: `/photoBrowsing/${item.albumId}`,
                      state: 'hello',
                    }}><img alt='' src={imgurl} />
                    </Link>
                    <div className={'footer-bom'}>
                      <span className={'timer'}>{item.createTime.slice(0, 10)}</span>
                      <b className={'fr'} style={{
                        fontWeight: 'normal'
                      }}>
                        <span className={'comment'}><i></i>评论 ({item.commentCount})</span>
                        <span className={'fabulous'}><i></i>点赞 ({item.likeCount})</span>
                      </b>
                    </div>
                  </div>
                </li>
              })
            }
          </ul>
        </div>
      })
    } else {
      return <div className={'content no-data'}>
        <span className={'task'} style={{
          marginLeft: '3.3rem'
        }}></span>
        <h4>暂无数据</h4>
      </div>
    }
  }
  render() {
    return (
      <div className={"artists-content"}>
        {this._addList()}
      </div >
    )
  }
}
export default Picture;
