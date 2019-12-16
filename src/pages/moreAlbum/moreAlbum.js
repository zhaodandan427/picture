//相册浏览
import React from 'react';
import { Link } from 'react-router-dom'

import PullLoad from '../../components/pullLoading/pullLoding';
class PhotoBrowsing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
    this.list = [
      { name: '上传照片', pathname: 'uploadAlbum' },
      { name: '管理照片', pathname: 'managePhotos' },
      { name: '垃圾篓', pathname: 'garbageBasket' },
    ]
  }
  /*事件----------------------start */
  select() {
    let flag = !this.state.show;
    this.setState({
      show: flag
    })
  }
  //点击内容区
  pictureClick() {
    this.setState({
      show: false
    })
  }

  /*事件-----------------------end*/
  render() {
    const flag = this.state.show;
    let id = this.props.match.params.id;
    return (
      <div className={'more-album'}>
        <header>
          <Link to={{
            pathname: `/photoBrowsing/${id}`
          }}></Link>
          相册浏览
          <span onClick={this.select.bind(this)}></span>
        </header>
        <div className={`dialog-wrap ${flag ? 'slidedown' : 'slideup'} `} >
          <ul>
            {
              this.list.map((s, i) => {
                return <li key={'zl' + i} style={{
                  height: '1.5rem',
                  lineHeight: '1.5rem'
                }}>
                  <Link to={`/${s.pathname}/${id}`}>{s.name}</Link>
                </li>
              })
            }
          </ul>
        </div>
        <div className={'picture-detail'} onClick={this.pictureClick.bind(this)}>
          <PullLoad ref={ref => this.moreAlbum = ref} id={this.props.match.params.id} />
        </div>
      </div >
    )
  }
}
export default PhotoBrowsing;
