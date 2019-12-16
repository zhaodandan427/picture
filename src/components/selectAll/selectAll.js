import React from 'react';
class SelectAll extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      flag: [],
      data: [],

    }
    this.actives = [];
    this.mark = 0//0为单选 1为全选
  }
  _setData(d) {
    d.map((items, index) => {
      this.state.flag.push(false)
    })
    this.setState({
      data: d,
      flag: this.state.flag
    })
  }
  //选择
  choice(index) {
    let _flag = this.state.flag;
    _flag[index] = !_flag[index];

    //判断是否选中
    this.state.data.map((checkedAll, ind) => {
      checkedAll.photoList.map((s, number) => {
        this.state.flag[index] === true ? s.isClicked = true : s.isClicked = false;
        if (this.state.flag[index] === true) {
          this.mark = 1
        }
      })
    })
    this.setState({
      flag: _flag
    });

  }
  //点击单张图片
  albumClick(s, index, j) {
    this.mark = 0;
    let choicList = 'choic' + index + j;
    let choic = this.refs[choicList];
    if (choic.className === 'default') {
      choic.className = 'active';
    } else {
      choic.className = 'default';
      this.actives.push(choic);
    }
    //选中不选中
    s.isClicked = !s.isClicked
  }

  test() {
    if (this.mark === 0) {
      this.actives.map((items, index) => {
        items.className = 'active'
      })
      this.state.flag.map((s, i) => {
        s = true
      })
    } else {
      this.state.flag.map((s, i) => {
        s = !s
      })
      this.state.flag.map((s, i) => {
        s = true
      })
    }

  }
  jugement() {
    this.selectAllRef.innerHTML = '选择'
  }
  //渲染页面
  _addList() {
    const me = this;
    if (!me.state.data || !me.state.flag) {
      return <div className={'no-data'}>
        <span className={'task'} style={{
          marginLeft: '2.5rem'
        }}></span>
        <h4>暂无数据</h4>
      </div>
    }
    return me.state.data.map((s, i) => {
      return (
        <div className={'management-album-list'} key={'jx' + i}>
          <h3>{s.date}</h3>
          <span className={'choice-album'} ref={ref => this.selectAllRef = ref} onClick={this.choice.bind(this, i)}>
            {this.state.flag[i] ? '取消选择' : '选择'}
          </span>
          <ul ref={'list' + i}>
            {s.photoList.map((s, j) => {
              return (
                <li key={'sm' + j}>
                  <img
                    src={s.squareUrl}
                    alt=""
                    ref={'album' + i}
                    onClick={this.albumClick.bind(this, s, i, j)}
                  />
                  <span ref={'choic' + i + j}
                    className={this.state.flag[i] ? 'default' : 'active'}
                  // className={s.isClicked ? 'default' : 'active'}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      )
    })
  }
  render() {
    return (
      <div>
        <div className={'management-album'}>{this._addList()}</div>
      </div>
    )
  }
}
export default SelectAll;