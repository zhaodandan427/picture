import React from 'react';
import { Link } from 'react-router-dom'
import './picture.scss';
class Picture extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  _setData(d) {
    this.setState({
      data: d
    })
  }
  _addList() {
    if (!this.state.data) { return };
    let datas = this.state.data;
    return datas.map((s, index) => {
      return <div key={index} className={'picturList'}>
        <h3>{s.date}</h3>
        <ul className={'content-area listName'}>
          {
            s.albumList.map((item, number) => {
              return <li key={'jx' + number}>
                <div >
                  <p>{item.memo}</p>
                  <Link to={{
                    pathname: `/deleteThoroughly/${item.albumId}`,
                    state: 'hello',
                  }}><img alt='' src={item.coverImgUrl} />
                  </Link>

                </div>
              </li>
            })
          }
        </ul>
      </div>
    })
  }
  render() {
    return (
      <div className={'deleteThorough-wrap'}>

        {this._addList()}

      </div>
    )
  }
}
export default Picture;
