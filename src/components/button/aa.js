import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
// import Menu from '../menu/Menu.jsx';
class List extends Component {
  constructor() {
    super();
    this.state = {
      chooseAll: false, // 全选标志
      inters: ['bsball', 'ymball', 'fbball'], // 页面加载默认选中项
      intersAll: ['bsball', 'ymball', 'ppball', 'fbball'],
    };
  }
  // 全选
  chooseAll(event) {
    let { checked, value } = event.target;
    let chooseAll = this.state.inters.length === 4 ? true : false;
    let inters = ['bsball', 'ymball', 'ppball', 'fbball'];
    checked ? (
      this.setState({
        inters,
        chooseAll: checked
      })
    ) : (
        this.setState({
          inters: [],
          chooseAll: checked
        })
      );
  }
  // 点击复选框
  chooseInter(event) {
    let val = event.target.value;
    let checked = event.target.checked;
    let { inters } = this.state;
    // event.stopPropagation();
    // 选中复选框并且值不在数组里面
    if (checked && !this.state.inters.includes(val)) {
      inters.push(val);
    } else {
      // 取消选中的选项
      inters = inters.filter(v => val !== v);
    }
    let chooseAll = inters.length === 4 ? true : false;
    this.setState({
      inters,
      chooseAll
    });
  }


  render() {
    return (
      <div className="list">
        <p>
          <label>
            <input type="checkbox" value="bsball" checked={this.state.chooseAll} onChange={this.chooseAll.bind(this)} />
          </label>
        </p>
        <ul>
          <li>
            <label>
              <input type="checkbox" value="bsball" checked={this.state.inters.includes('bsball')} onChange={this.chooseInter.bind(this)} />篮球
             </label>
          </li>
          <li>
            <label>
              <input type="checkbox" value="ymball" checked={this.state.inters.includes('ymball')} onChange={this.chooseInter.bind(this)} />羽毛球
            </label>
          </li>
        </ul>
      </div>
    );
  }
}
export default withRouter(List);