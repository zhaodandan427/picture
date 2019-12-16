import React from 'react';
import { PhotoSwipe } from 'react-photoswipe';
import { PhotoSwipeGallery } from 'react-photoswipe';

export default class PhotoSwipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
      items: [
        {
          src: 'http://lorempixel.com/1200/900/sports/1',
          w: 1200,
          h: 900,
          title: 'Image 1'
        },
        {
          src: 'http://lorempixel.com/1200/900/sports/2',
          w: 1200,
          h: 900,
          title: 'Image 2'
        }
      ]
    }
  }
  componentDidMount() {
    this.PhotoSwipe = window.ReactPhotoswipe.PhotoSwipe;
    this.PhotoSwipeGallery = window.ReactPhotoswipe.PhotoSwipeGallery;
    this.options = {
      index: 3,
      escKey: false,

      // ui option
      timeToIdle: 4000
    };
    var gallery = new PhotoSwipe(someElement, PhotoSwipeUI_Default, someItems, options);
    gallery.init();

    // Note that options object is cloned during the initialization.
    // But you can access it via `gallery.options`.
    // For example, to dynamically change `escKey`:
    gallery.options.escKey = false;
  }
  handleClose = () => {
    this.setState({
      isOpen: !isOpen
    })
  };
  getThumbnailContent = (item) => {
    return (
      <img src={item.thumbnail} width={120} height={90} />
    );
  }
  render() {
    return (
      <div>
        <PhotoSwipe isOpen={isOpen} items={items} options={this.options} onClose={handleClose} />
        <PhotoSwipeGallery items={items} options={this.options} thumbnailContent={this.getThumbnailContent} />
      </div>
    )
  }
}
