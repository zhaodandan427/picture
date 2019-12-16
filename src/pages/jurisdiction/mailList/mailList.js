import React from 'react';
import { Link } from 'react-router-dom';

class MailList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}

  }
  _tokens = [];
  _clearTokens() {
    this._tokens.forEach((token) => token.cancel());
    this._tokens = [];
  }
  componentDidMount() {
    const me = this;
    
  }
  componentWillUnmount() {
    this._clearTokens();
  }
  // //多选
  // _singVal(e) {
  //   // console.log(e)
  // }
  // //全选
  // _allValue(e) {
  //   // console.log(e)
  // }
  render() {
    return (
      <div className={'createAlbum-wrap mailList-wrap'}>
        <header>
          <Link to={'/jurisdiction'}></Link>
          通讯录选择
        <Link to={'/jurisdiction'}><span>完成</span></Link>
        </header>
        <div className={'mailList-content'}>
        
         
        </div>
      </div>
    )
  }
}
export default MailList;