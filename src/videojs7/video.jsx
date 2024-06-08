import React from "react";
import "./skins/shaka/videojs.min.css";
import videojs from "video.js";
import "./components/nuevo";
export default class VideoPlayer extends React.Component {
  componentDidMount() {
    this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
      // console.log("Player Ready!);");
    });

    // eslint-disable-next-line react/prop-types
    if (this.props.streamStatus === "broadcasting") {
      this.player.src({
        src: `https://vdo.alright.global:5443/alright/streams/${this.props.streamId}_adaptive.m3u8`,
        type: "application/x-mpegURL",
      });
    }

    this.player.autoplay(false);
    this.player.preload(false);
    this.player.controls(true);
    this.player.playsinline(true);
    this.player.muted(false);

    // eslint-disable-next-line react/prop-types
    if (this.props.streamStatus !== "broadcasting") {
      this.player.poster(
        `https://www.shutterstock.com/shutterstock/videos/1110440069/thumb/8.jpg?ip=x480`
      );
    } else {
      this.player.poster(
        `https://vdo.alright.global:5443/alright/previews/${this.props.streamId}.png`
      );
    }

    const nuevoOptions = {
      pipButton: false,
    };

    this.player.nuevo(nuevoOptions);
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  render() {
    return (
      <div className="container">
        <div data-vjs-player>
          <video
            ref={(node) => (this.videoNode = node)}
            className="video-js vjs-fluid"
          ></video>
        </div>
      </div>
    );
  }
}
