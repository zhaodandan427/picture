import React from 'react';
import { Checkbox } from 'antd-mobile';
import imgs from './1.jpg';
const CheckboxItem = Checkbox.CheckboxItem;
export default class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: ''
    }
  }
  onChange = (e, val) => {
    this.props.changVal(e, val)

  }

  render() {
    const data = [
      { value: 0, label: '张委员', name: 'xxx委员', num: 123 },
      { value: 1, label: '李委员', name: '李xxx委员', num: 222 },
      { value: 2, label: 'XX委员', name: 'XX委员', num: 888 },
    ];
    return (
      <div>
        {data.map((s, i) => (
          <CheckboxItem key={s.label} onChange={(e) => this.onChange(e, s.label)}>
            <span style={{
              position: 'absolute',
              top: '.15rem',
              left: '1.4rem'
            }}>{s.name}</span>
            <span style={{
              position: 'absolute',
              left: '1.4rem',
              top: '.8rem',
              color: '#9D9FA2'
            }}>{s.num}</span>
            <span style={{
              width: '1rem',
              height: '1rem',
              borderRadius: '100%',
              display: 'block',
              background: `url(${imgs}) no-repeat`,
              backgroundSize: '100% 100%',
              position: 'absolute',
              top: 0

            }} src={imgs} ></span>

          </CheckboxItem>

        ))

        }
      </div>
    )
  }
}