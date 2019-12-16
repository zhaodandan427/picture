import React from 'react';
import { ImagePicker } from 'antd-mobile';

const data = [];
export default class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: data,
      multiple: false,
    }
  }
  onChange = (files, type, index) => {
    console.log(type)
    console.log(files);
    console.log(index);
    this.setState({
      files,
    });
  }
  onSegChange = (e) => {
    const index = e.nativeEvent.selectedSegmentIndex;
    this.setState({
      multiple: index === 1,
    });
  }
  render() {
    const { files } = this.state;
    return (
      <div>
        <ImagePicker
          files={files}
          onChange={this.onChange}
          onImageClick={(index, fs) => console.log(index, fs)}
          selectable={files.length < 9}
          multiple={this.state.multiple}
          length={3}
        />
      </div>
    )
  }
}