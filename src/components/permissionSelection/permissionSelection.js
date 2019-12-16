import React from 'react';
import headPortrait from './user.jpg';
import './permissionSelection.scss';

class PermissionSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedList: [],
      value: []
    }

  }
  _setData(d) {
    this.setState({
      data: d,
    })

  }

  //点击列表上升下降
  slide(index) {
    let _flag = this.state.checkedList;
    _flag[index] = !_flag[index];
    this.setState({
      checked: _flag
    })
  }
  //全选
  handleAllChange(e, index) {
    e.checked = !e.checked;
    let { data } = this.state;
    let { value } = this.state;
    if (e.checked == true) {
      data[index].userList.map((s, i) => { s.checked = true });
      for (let i = 0; i < data[index].userList.length; i++) {
        let fla = 0
        for (let j = 0; j < value.length; j++) {
          if (value[j].userId == data[index].userList[i].userId) {
            fla = 1
          }
        }
        if (fla == 0) {
          value.push({
            // number: i,
            userId: data[index].userList[i].userId,
            // group: index
          })
        }
      }
    } else {
      data[index].userList.map((s, i) => { s.checked = false });
      for (let i = 0; i < data[index].userList.length; i++) {
        for (let j = 0; j < value.length; j++) {
          if (value[j].userId == data[index].userList[i].userId) {
            value.splice(j, 1);
            j = j - 1;
          }
        }
      }
    }
    this.setState({
      checked: e.checked,
      value
    })
    window.userArry = value;
  }
  //单个的选取
  selected = (e, index, number) => {
    e.checked = !e.checked;
    let { checked, userId } = e
    let { value, checkedList } = this.state;
    if (e.checked === true) {
      let fla = 0;
      for (let i = 0; i < value.length; i++) {
        if (value[i].userId == userId) {
          fla = 1
        }
      }
      if (fla == 0) {
        value.push({
          userId,
          number,
          group: index
        })
      }

    } else {
      value.map((items, ind) => {//判断当前不选的这个的index跟第一级的那个
        if (items.userId === e.userId) {
          value.splice(ind, 1);
        }
      })
      checkedList[index] = false
    }
    this.setState({
      checked,
      value,
      checkedList
    })
    window.userArry = value
  }
  render() {
    if (!this.state.data) { return null };
    let datas = this.state.data;
    let { checkedList } = this.state;
    return (
      <div className={'mailList-wrap'}>
        <ul className={'mailList-firstContent'}>
          {
            datas.map((s, index) => {

              if (!s.userList) { return };
              let children = s.userList;
              return <li key={'jx' + index} className={'clearfix'}>
                <p onClick={this.slide.bind(this, index)}>
                  <span >{s.meetingName}</span>
                  <i className={checkedList[index] ? 'hidei' : ' showi'} ></i>
                </p>
                <input type='checkbox' value={this.state.value}
                  className={'e-selfecheckbox'} checked={s.checked}
                  onChange={this.handleAllChange.bind(this, s, index)} />
                <ol className={`mailList-secondContent ${checkedList[index] ? 'slidedowns' : 'slideups  '}`}>
                  {
                    children.map((item, number) => {
                      return <li key={'jxs' + number}>
                        <dl style={{
                          marginBottom: 0
                        }}>
                          <dt>
                            {/* <img src={headPortrait} alt='' /> */}
                          </dt>
                          <dd>
                            <span className={'userName'}>{item.userName}</span>
                            <span className={'userNum'}>{item.userNumber}</span>
                          </dd>
                          <input type='checkbox' value={this.state.value || ''}
                            className={'e-selfecheckbox'} checked={item.checked}
                            onChange={this.selected.bind(this, item, number)} />
                        </dl>
                      </li>
                    })
                  }
                </ol>
              </li>
            })
          }

        </ul>

      </div>
    )
  }
}
export default PermissionSelection;