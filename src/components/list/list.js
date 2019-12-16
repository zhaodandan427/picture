import React from 'react';
import { Accordion, List, Checkbox } from 'antd-mobile';
import imgs from './1.jpg';
const CheckboxItem = Checkbox.CheckboxItem;
export default class AccordionExmple extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chooseAll: false,
      data: [
        {
          title: 'A组织部门', childs: [
            { value: 0, label: '张委员', name: '张委员', num: 123 },
            { value: 1, label: '李委员', name: '李委员', num: 222 },
            { value: 2, label: '王委员', name: '王委员', num: 888 },
          ]
        },
        {
          title: 'B组织部门', childs: [
            { value: 0, label: '吴委员', name: '吴委员', num: 123 },
            { value: 1, label: '赵委员', name: '赵委员', num: 222 },
            { value: 2, label: '田委员', name: '田委员', num: 888 },
          ]
        }, {
          title: 'c组织部门', childs: [
            { value: 0, label: '张委员', name: 'xxx委员', num: 123 },
            { value: 1, label: '李委员', name: '李xxx委员', num: 222 },
            { value: 2, label: 'XX委员', name: 'XX委员', num: 888 },
          ]
        }
      ]
    }
  }
  checkoutChange = (e, val) => {
    this.props.changvalues(e, val)
  }
  chooseAll() {

  }
  render() {
    return (
      <div style={{ marginTop: 10, marginBottom: 10 }} className={'chosice-wrap'}>

        {

          this.state.data.map((s, i) => {
            return <Accordion key={'jx' + i} defaultActiveKey="0" className="my-accordion" >

              <Accordion.Panel header={s.title}>
                <List className="my-list">
                  <List.Item>
                    {
                      s.childs.map((item, j) => {
                        return <CheckboxItem key={item.label} onChange={(e) => this.checkoutChange(e, item.label)}>
                          <span style={{
                            position: 'absolute',
                            top: '.15rem',
                            left: '1.4rem'
                          }}>{item.name}</span>
                          <span style={{
                            position: 'absolute',
                            left: '1.4rem',
                            top: '.8rem',
                            color: '#9D9FA2'
                          }}>{item.num}</span>
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
                      })
                    }

                  </List.Item>
                </List>
              </Accordion.Panel>

            </Accordion>
          })
        }
      </div >
    );
  }
}