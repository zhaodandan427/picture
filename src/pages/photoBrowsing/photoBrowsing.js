//相册浏览
import React from 'react';
import * as api from '../../components/api/api-photoBrowsing';
import { Link } from 'react-router-dom'
import './photoBrowsing.scss';
import Dialog from '../../components/dialog/againDialog';
import WxImageViewer from '../../components/imagesViewer';
import defaultPicture from '../../assets/img/morentupian.png';
import { Tost, Toast } from 'antd-mobile'
class PhotoBrowsing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      albumList: '',
      commentList: [],
      searchValue: '',
      hasMore: false,
      isLikeData: '',
      liked: 'null',
      imags: [],
      index: 0,
      isOpen: false,
      activeBg: ''
    };
    this.list = [
      { name: '上传照片', pathname: 'uploadAlbum' },
      { name: '管理照片', pathname: 'managePhotos' },
      { name: '垃圾篓', pathname: 'garbageBasket' },
    ]
    this.id = this.props.match.params.id;
    this.select = this.select.bind(this);
    this.all = this.all.bind(this);//点击全文
    this.creatorId = sessionStorage.loginManger;
    this.creatorName = sessionStorage.creatorName;
    this.pageNum = 1;
    this.pageCount = 5;
    this.isAppear = '';


  }

  onClose = () => {
    this.setState({
      isOpen: false
    })
    console.log('onClose...')
    console.log(this.state);
  }

  openViewer(index) {
    this.setState({
      index,
      isOpen: true
    })
    console.log('openViewer...', index)
  }


  /*事件----------------------start */
  select() {
    let flag = !this.state.show;
    this.setState({
      show: flag
    })
  }
  //点击全文
  all() {
    this.text.innerHTML = this.state.albumList.memo
    this._all.style.display = 'none'
  }
  //点击加载更多评论
  getMoreComment() {
    const me = this;
    me._tokens.push(api.commentList.send({
      albumId: this.id,
      pgIndex: this.pageNum,
      pgCount: this.pageCount,
      token: sessionStorage.token
    }).then(res => {
      if (res.code == 200) {
        if (res.data.elements == null || res.data.elements.length == 0) {
          res.data.elements = []
          this.state.hasMore = false
        }
        let totalList = [...this.state.commentList, ...res.data.elements]
        this.setState({
          commentList: totalList
        })
        if (this.state.commentList.length < res.data.totalElements) {
          this.state.hasMore = true;
          this.pageNum++;
        } else {
          this.setState({
            hasMore: false
          })
        }
      }

    }))
  }
  //点击评论
  comment() {
    this.footer.style.display = 'block'
    this.inputRef.focus();
    this.setState({
      searchValue: ''
    })
    this.btnRef.style.background = '#ccc';
  }
  //弹出框
  showToastNoMask() {
    Toast.info('请输入评论', 2, null, false);
  }
  //点击发送
  sendEnter(e) {
    let { searchValue } = this.state;
    this.setState({
      searchValue
    })
    if (searchValue !== '') {
      this.addComment()
      this._detailList()
    }
    if (searchValue == '') {
      this.inputRef.focus();
      this.showToastNoMask();
    } else {
      this.footer.style.display = 'none';
      searchValue = ''
    }
  }
  //发送的按下事件
  mouseDown(e) {
    e.preventDefault()
  }
  // onchange 事件
  inputChange(event) {
    let searchValue = event.target.value;
    this.setState({
      searchValue
    })
  }
  //失去焦点
  getBlur() {
    this.timer = setTimeout(() => {
      this.footer.style.display = 'none'
    }, 500)
  }

  //添加评论接口
  addComment() {
    this._tokens.push(api.commentAdd.send({
      albumId: this.id,
      comment: this.state.searchValue,
      token: sessionStorage.token
    }).then(res => {
      if (res.code == 200) {
        let list = this.state.commentList;
        list.unshift({
          comment: this.state.searchValue,
          commentId: res.data,
          creatorId: this.creatorId,
          creatorName: this.creatorName
        })

        this.setState({
          commentList: list
        })
        this._detailList()
      }
    }))
  }
  //长按事件
  onItemTouchStart(index) {
    const me = this;
    sessionStorage.setItem('index', index)
    this.timeOutEvent = setTimeout(function () {
      this.timeOutEvent = 0;
      me.dialogRef._open()
    }, 400);
  }
  //点击删除评论
  deleteSure() {
    const me = this;
    let id = sessionStorage.index;
    me._tokens.push(api.commentDel.send({
      commentId: id,
      token: sessionStorage.token
    }).then(res => {
      let list = this.state.commentList;
      list.map((items, index) => {
        if (items.commentId == id) {
          list.splice(index, 1)
        }
      })
      this.setState({
        commentList: list
      })
      me._detailList()
    }));
  }
  //点赞
  fabulous() {
    const me = this;
    if (!this.state.isLikeData) { return };
    let isLiked = this.state.isLikeData.isLike;
    this.setState({
      liked: isLiked
    })
    if (isLiked == true) {//已点赞
      me._tokens.push(api.deleteThumbs.send({
        albumId: this.id,
        token: sessionStorage.token
      }).then(res => {
        me._thumbs()
        me._detailList()
      }))
    } else {//取消点赞
      me._tokens.push(api.addThumbs.send({
        albumId: this.id,
        token: sessionStorage.token
      }).then(res => {
        me._thumbs();
        me._detailList()
      }))
    }
  }
  detailContent() {
    this.setState({
      show: false
    })
  }

  /*事件----------------------end */
  _addList() {
    if (this.state.commentList == null) { return }
    if (this.state.commentList.length != 0) {
      let commentList = this.state.commentList;
      return commentList.map((list, index) => {
        return <li key={'jx' + index} className={'clearfix'}
          onTouchStart={() => {
            if (list.creatorId == this.creatorId) {
              this.onItemTouchStart(list.commentId)
            }
          }}
          onTouchEnd={() => {
            clearTimeout(this.timeOutEvent)
          }}
        >
          <div><span>{list.creatorName}说: </span>
            <span>{list.comment}</span>
          </div>

        </li >
      })
    }
  }

  _tokens = [];
  _clearTokens() {
    this._tokens.forEach((token) => token.cancel());
    this._tokens = [];
  }

  //评论列表的封装
  _commentList() {
    const me = this;
    me._tokens.push(api.commentList.send({
      albumId: this.id,
      pgIndex: this.pageNum,
      pgCount: this.pageCount,
      token: sessionStorage.token
    }).then(res => {
      if (res.code == 200) {
        this.pageNum++;
        if (res.data.elements == null) {
          res.data.elements = []
        }
        if (res.data.elements.length < res.data.totalElements) {
          this.state.hasMore = true
        }
        this.setState({
          commentList: res.data.elements
        })
      }
    }))
  }
  //点赞列表的封装
  _thumbs() {
    const me = this;
    me._tokens.push(api._thumbs.send({
      albumId: this.id,
      // pgIndex: this.pageNum,
      // pgCount: this.pageCount,
      token: sessionStorage.token
    }).then(res => {
      this.setState({
        isLikeData: res.data
      })
    }))
  }
  //列表渲染
  _detailList() {
    const me = this;
    me._tokens.push(api.listDetail.send({
      albumId: this.id,
      token: sessionStorage.token
    }).then(res => {
      if (res.code == 200) {
        if (res.data.sudoku == null || res.data.sudoku.length == 0) {
          res.data.sudoku = [{
            imgUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgBAMAAAB54XoeAAAAD1BMVEXx8vLR09Tr7Ozg4uPY2tuKCnp7AAAB/0lEQVRo3u1YXXqDIBD0g1zA6AEkeoCgOUC03v9MBfwDQtKWnfah2XlqHjrf7K7sDBQFg8FgMBgMBoPBYDB+D5dhGC4Njm8YS4MZxqjKBTWIsS03VBBGMe6E5QQreO5vjrHBCKx7+9cNI/FkaPqFWhtqOqEReN7EGu4ruWL/a+kOckrF54AdMOP78UvTazYU3q+OThh2TQZ6AYQFeSoikjRSCU9R0zSesPrvhBLdQxFtLPKU4d8h/qToYO0r+ll+2DZUVzFFVtB9KDyrEwqwsW2V1aGW7il413PBwTJKDYoOnUsO8zyCkoNzZmi2cbNY0xcoH7bQNLdrrFH6llA8DP07XCbaDyyfQJzcaBVWYIFYiQp5NjaBSIlGYK2BEq3ASQIlKpf+R5hEu6cnlIscAgOLondwsyiExG6/P2EkisM+MF1U3gUPMWjh+5snsW0AAr0uylwXFaEB74PWuc8iKnpQWSXKXKMX8T+uEnVuFFEPLz5u0DI3i6ynOPb5q859XHoUuARDK6/MSLAiVddpUeedyJxTHOViO5hEO74Tqad0/qpX42p+Spgqyo7lnp7Y1yVPad31i468HErfpG8C931m9KtK4d0nOsRDp79kcwb9SmDWoJ+NGCZRhvmf/uYXXeMF2WTkWEWfKtUGY3N6iwsGg8FgMBgMBoPBYPwFPgFyVUPe8DG6NgAAAABJRU5ErkJggg==',
            thumbnailUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgBAMAAAB54XoeAAAAD1BMVEXx8vLR09Tr7Ozg4uPY2tuKCnp7AAAB/0lEQVRo3u1YXXqDIBD0g1zA6AEkeoCgOUC03v9MBfwDQtKWnfah2XlqHjrf7K7sDBQFg8FgMBgMBoPBYDB+D5dhGC4Njm8YS4MZxqjKBTWIsS03VBBGMe6E5QQreO5vjrHBCKx7+9cNI/FkaPqFWhtqOqEReN7EGu4ruWL/a+kOckrF54AdMOP78UvTazYU3q+OThh2TQZ6AYQFeSoikjRSCU9R0zSesPrvhBLdQxFtLPKU4d8h/qToYO0r+ll+2DZUVzFFVtB9KDyrEwqwsW2V1aGW7il413PBwTJKDYoOnUsO8zyCkoNzZmi2cbNY0xcoH7bQNLdrrFH6llA8DP07XCbaDyyfQJzcaBVWYIFYiQp5NjaBSIlGYK2BEq3ASQIlKpf+R5hEu6cnlIscAgOLondwsyiExG6/P2EkisM+MF1U3gUPMWjh+5snsW0AAr0uylwXFaEB74PWuc8iKnpQWSXKXKMX8T+uEnVuFFEPLz5u0DI3i6ynOPb5q859XHoUuARDK6/MSLAiVddpUeedyJxTHOViO5hEO74Tqad0/qpX42p+Spgqyo7lnp7Y1yVPad31i468HErfpG8C931m9KtK4d0nOsRDp79kcwb9SmDWoJ+NGCZRhvmf/uYXXeMF2WTkWEWfKtUGY3N6iwsGg8FgMBgMBoPBYPwFPgFyVUPe8DG6NgAAAABJRU5ErkJggg==',
            squareUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgBAMAAAB54XoeAAAAD1BMVEXx8vLR09Tr7Ozg4uPY2tuKCnp7AAAB/0lEQVRo3u1YXXqDIBD0g1zA6AEkeoCgOUC03v9MBfwDQtKWnfah2XlqHjrf7K7sDBQFg8FgMBgMBoPBYDB+D5dhGC4Njm8YS4MZxqjKBTWIsS03VBBGMe6E5QQreO5vjrHBCKx7+9cNI/FkaPqFWhtqOqEReN7EGu4ruWL/a+kOckrF54AdMOP78UvTazYU3q+OThh2TQZ6AYQFeSoikjRSCU9R0zSesPrvhBLdQxFtLPKU4d8h/qToYO0r+ll+2DZUVzFFVtB9KDyrEwqwsW2V1aGW7il413PBwTJKDYoOnUsO8zyCkoNzZmi2cbNY0xcoH7bQNLdrrFH6llA8DP07XCbaDyyfQJzcaBVWYIFYiQp5NjaBSIlGYK2BEq3ASQIlKpf+R5hEu6cnlIscAgOLondwsyiExG6/P2EkisM+MF1U3gUPMWjh+5snsW0AAr0uylwXFaEB74PWuc8iKnpQWSXKXKMX8T+uEnVuFFEPLz5u0DI3i6ynOPb5q859XHoUuARDK6/MSLAiVddpUeedyJxTHOViO5hEO74Tqad0/qpX42p+Spgqyo7lnp7Y1yVPad31i468HErfpG8C931m9KtK4d0nOsRDp79kcwb9SmDWoJ+NGCZRhvmf/uYXXeMF2WTkWEWfKtUGY3N6iwsGg8FgMBgMBoPBYPwFPgFyVUPe8DG6NgAAAABJRU5ErkJggg=='
          }]
        }
        this.setState({
          albumList: res.data,
          imags: res.data.sudoku.map((item, index) => {
            return item.thumbnailUrl
          }),
        })
      }
    }))
  }
  //点击返回
  backWord() {
    this.props.history.push('/')
  }
  //九宫格的测试
  squaredPicture() {
    if (!this.state.albumList.sudoku) { return false }
    return this.state.albumList.sudoku.map((imgList, index) => {
      return <li style={{
        width: '30%',
        height: '3.2rem'
      }} key={'jx' + index} ref={'imgIn' + index} >
        <img src={imgList.squareUrl} alt="" onClick={this.openViewer.bind(this, index)} />
      </li>
    })

  }
  componentDidMount() {
    const me = this;
    me._detailList(); //相册--列表详情
    me._commentList();//评论列表
    me._thumbs();//点赞列表
  }
  // componentDidUpdate() {
  //   const me = this;
  //   me._detailList(); //相册--列表详情
  //   me._commentList();//评论列表
  //   me._thumbs();//点赞列表
  // }
  componentWillUnmount() {
    this._clearTokens();
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }
  render() {
    const flag = this.state.show;
    const { searchValue, hasMore, albumList, isLikeData, commentList } = this.state;

    if (!this.state.albumList.memo || !this.state.isLikeData) {
      return <div className={'photoBrowsing'}>
        <header>
          <span className={'back'} onClick={this.backWord.bind(this)}>
          </span>
          相册浏览
            <span className={'totid'} onClick={this.select}></span>
        </header>
        <div className={`dialog-wrap ${flag ? 'slidedown' : 'slideup'} `} >
          <ul>
            {
              this.list.map((s, i) => {
                return <li key={'zl' + i} style={{
                  lineHeight: '1.5rem'
                }}>
                  <Link to={`/${s.pathname}/${this.id}`}>{s.name}</Link>
                </li>
              })
            }
          </ul>
        </div>
        <div className={'detail-album no-data'} >
          <span className={'task'}></span>
          <h4>暂无数据</h4>
        </div>
      </div>
    };
    return (
      <div className={'photoBrowsing'}>
        <header>
          <span className={'back'} onClick={this.backWord.bind(this)}>
          </span>
          相册浏览
            <span className={'totid'} onClick={this.select}></span>
        </header>
        <div className={`dialog-wrap ${flag ? 'slidedown' : 'slideup'} `} >
          <ul>
            {
              this.list.map((s, i) => {
                return <li key={'zl' + i} style={{
                  lineHeight: '1.5rem'
                }}>
                  <Link to={`/${s.pathname}/${this.id}`}>{s.name}</Link>
                </li>
              })
            }
          </ul>
        </div>

        <div className={'detail-album'} onClick={this.detailContent.bind(this)}>
          <p ref={ref => this.text = ref}>{albumList.memo}
            {
              albumList.memo.length > 30 ? <span ref={ref => this._all = ref}
                onClick={this.all}>全文</span> : ''
            }
          </p>
          <div className={'picture-list'}>
            <ul>
              {
                this.squaredPicture()
              }
              {
                albumList.photoCount > 9 ? <span className={'morePictrue'} id={'getmore'} >
                  <Link to={{
                    pathname: `/moreAlbum/${this.id}`,
                  }}>更多</Link>
                </span> : ''
              }
            </ul>
            {
              this.state.isOpen ? <WxImageViewer onClose={this.onClose} urls={this.state.imags} index={this.state.index} /> : ""
              // <WxImageViewer onClose={this.onClose} urls={this.state.imags} index={this.index}/>
            }
          </div>
          <div className={'comment-wrap'}>
            <span className={'timer'}>{albumList.createTime.slice(0, 10)}</span>
            <div className={'comment-like'}>
              <span className={'comment-items'} onClick={this.comment.bind(this, 0)}>
                <i></i>评论({albumList.commentCount})
              </span>
              <span className={isLikeData.isLike == false ? 'fabulous' : 'activeLike'} onClick={this.fabulous.bind(this)}>
                <i></i>点赞 ({albumList.likeCount})</span>
            </div>
          </div>
          <div className={'comment-wrap-list'} style={{
            display: commentList.length == 0 && isLikeData.page.elements == null ? 'none' : 'block'
          }}>
            <ul className={'thumbs-up'}>
              {
                isLikeData.page.elements !== null && isLikeData.page.elements.map((isLikeList, count) => {
                  return <li key={'like' + count}><span>{isLikeList.userName}</span></li>
                })
              }
              {isLikeData.page.totalElements > 20 ? <span>更多</span> : ''}
            </ul>
            <ul className={'comment-content-list'}>
              {this._addList()}
            </ul>
            <Dialog ref={ref => this.dialogRef = ref} onSure={this.deleteSure.bind(this)}></Dialog>
            <div className={'loadMore'}
              ref={ref => this.getMore = ref}
              style={{
                display: hasMore ? 'block' : 'none',
                userSelect: 'none'
              }}
              onClick={this.getMoreComment.bind(this)}
            >加载更多</div>
          </div>
        </div>
        <footer
          className={'search-comment'}
          ref={ref => this.footer = ref}
          style={{
            display: 'none'
          }}
        >
          <div className={'search-list'}>
            <input
              type={'text'}
              id={'keyword'}
              value={searchValue}
              onChange={this.inputChange.bind(this)}
              onBlur={this.getBlur.bind(this)}
              ref={ref => this.inputRef = ref}
              placeholder={'评论'}
            />
            <button ref={ref => this.btnRef = ref} style={{
              background: '#ccc'
            }}
              onClick={this.sendEnter.bind(this)}
              onMouseDown={this.mouseDown.bind(this)}
            >发送</button>
          </div>
        </footer>
      </div >
    )
  }
}
export default PhotoBrowsing;
