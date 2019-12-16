import React from 'react';
import * as api from '../../components/api/api-moreAlbum';
import Luo from 'iscroll-luo';
import WxImageViewer from '../../components/imagesViewer';

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      imags: [],
      index: 0,
      isOpen: false
    };
    this.pageNum = 1;
    this.pageCount = 20;
    this.isLoading = false
  }


  onClose = () => {
    this.setState({
      isOpen: false
    })
    console.log('onClose...')
    console.log(this.state);
  }

  openViewer(index) {
    console.log(index)
    this.setState({
      index,
      isOpen: true
    })
    console.log('openViewer...', index)
    console.log(this.state);
  }


  /** 下拉刷新 **/
  onDown() {
    this.pageNum = 1;
    this.state.data = [];
    this._moreAlbum()

  }

  /** 上拉加载更多 **/
  onUp() {
    const me = this;

    me._tokens.push(api.moreAlbum.send(
      {
        albumId: this.props.id,
        pgIndex: this.pageNum + 1,
        pgCount: this.pageCount,
        token: sessionStorage.token
      }
    ).then(res => {
      if (res.code == 200) {
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
        this.setState({
          data,
          imags: data[0].photoList.map((item, index) => {
            return item.thumbnailUrl
          }),

        })
      }
    }))
    /** 注意此处，就算没有更多数据了或接口调用失败等情况，也要刷一下原始数据，Luo内部才知道状态更新了 **/
  }
  _moreAlbum() {
    const me = this;
    me._tokens.push(api.moreAlbum.send(
      {
        albumId: this.props.id,
        pgIndex: this.pageNum,
        pgCount: this.pageCount,
        token: sessionStorage.token
      }
    ).then(res => {
      if (res.code == 200) {
        this.setState({
          data: res.data.elements,
          imags: res.data.elements[0].photoList.map((item, index) => {
            return item.thumbnailUrl
          }),
        })
      }
    }))
  }
  _setData(d) {
    this.setState({
      data: d
    })
  }
  _tokens = [];
  _clearTokens() {
    this._tokens.forEach((token) => token.cancel());
    this._tokens = [];
  }
  componentWillUnmount() {
    this._clearTokens();
  }
  componentDidMount() {
    const me = this;
    me._moreAlbum()
  }
  render() {
    if (!this.state.data) {
      return null
    }
    const { index, isOpen } = this.state;
    return (
      <div style={{ position: 'relative', height: '88vh' }}>
        <Luo
          id='moreOne'
          onDown={() => this.onDown()}
          onUp={() => this.onUp()}
        >
          {
            this.state.data.map((s, i) => {
              return <div key={'js' + i}>
                <h3>{s.date}</h3>
                <ul>
                  {
                    s.photoList.map((item, j) => {
                      return <li key={'js' + j}>
                        <img src={item.squareUrl} alt="" onClick={this.openViewer.bind(this, j)} />
                      </li>

                    })
                  }
                </ul>

                {
                  this.state.isOpen ? <WxImageViewer onClose={this.onClose} urls={this.state.imags} index={this.state.index} /> : ""
                }
              </div>
            })
          }
        </Luo>
      </div >
    );
  }
}
export default Test
