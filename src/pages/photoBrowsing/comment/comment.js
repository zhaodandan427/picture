import React from 'react';
import { Link } from 'react-router-dom';
import { Input, Button } from 'antd';
class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    }
    this.id = this.props.match.params.id;
  }
  inputChange = (e) => {
    this.setState({
      value: e.target.value
    })
  }
  handleClick() {
    //请求接口
    this.props.history.push(`/photoBrowsing/${this.id}`);
    sessionStorage.setItem('inputVal', this.state.value)
  }
  render() {
    return (
      <div className={'comment-finished'}>
        <header>
          <Link to={{
            pathname: `/photoBrowsing/${this.id}`
          }}></Link>
          评论
        <Link to={{
            pathname: `/photoBrowsing/${this.id}`
          }}><span>完成</span></Link>
        </header>
        <div className={'comment-content'}>
          <div style={{
            display: 'flex',
            boxSizing: 'border-box',
            padding: '1rem'
          }}>
            <Input placeholder="评论" onChange={this.inputChange} />
            <Button type="primary" onClick={this.handleClick.bind(this)}>发送</Button>
          </div>
        </div>
      </div>
    )
  }
}
export default Comment;