import React from 'react';
import './radio.css';
export default class Radio extends React.Component {
  constructor(props) {
    super(props);
    if (sessionStorage.checked) {//记录上一次选中的状态
      this.state = {
        active: sessionStorage.checked //就是选中的状态
      }
    } else {
      this.state = {
        active: 0 //否则默认公开
      }
    }

    this.radioName =
      [
        { name: "公开", "con": "所有委员可见", choic: '' },
        { name: "部分公开", "con": "选中的委员可见", choic: '已选' }
      ];
  }
  //点击事件
  getValue(index) {
    sessionStorage.setItem('checked', index)//先用sessionStorage存储一下选中的状态
    this.setState({
      active: index
    });
    this.props.getValueInput(index)
  }
  //页面初始化加载，计算出选择多少人 ————————————20.19-12-01 王凯  
  pageStart() {
    let userNum;
    if (sessionStorage.getItem('userData')) {
      userNum = JSON.parse(sessionStorage.getItem('userData')).users.length;
    } else {
      userNum = 0;
    }
    return userNum
  }
  render() {
    return (
      <div className={'radio-wrap'}>
        {
          this.radioName.map((s, index) => {
            return <div key={'kx' + index}>
              <p>
                <b ref={ref => this.actives = ref} onClick={this.getValue.bind(this, index)} className={this.state.active == index ? 'active' : ''}></b>
                <span>{s.name}</span><br />
                <span>{s.con}</span>
              </p>
              <span className={'apper'} style={{
                display: index == 0 ? 'none' : 'block'
              }}>{s.choic}{this.pageStart()}人</span>
            </div>
          })
        }
      </div>
    )
  }
}