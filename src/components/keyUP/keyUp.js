import React, { Component } from 'react'
import { InputItem } from 'antd-mobile'

export default class InputKeyboard extends Component {
  state = {
    clientHeight: 0
  }

  componentDidMount() {
    let clientHeight = document.documentElement.clientHeight || document.body.clientHeight
    this.setState({ clientHeight })
    window.addEventListener('resize', this.resize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize) // 移除监听
  }

  resize = () => {
    let clientHeight = document.documentElement.clientHeight || document.body.clientHeight
    if (this.state.clientHeight > clientHeight) { // 键盘弹出
      this.inputClickHandle()
    } else { // 键盘收起
      this.inputBlurHandle()
    }
  }

  inputClickHandle = () => {
    // 这里处理键盘弹出的事件
  }
  inputBlurHandle = () => {
    // 这里处理键盘收起的事件
  }

  render() {
    return (
      <InputItem
        className='input'
        placeholder=""
        onClick={this.inputClickHandle}
        onBlur={this.inputBlurHandle}
      />
    )
  }
}