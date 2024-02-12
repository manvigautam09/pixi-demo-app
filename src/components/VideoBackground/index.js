import React, { useState, useEffect } from "react";
import * as PIXI from "pixi.js";
import { Sprite, Stage } from "@pixi/react";

const VideoBackground = () => {
  const [videoTexture, setVideoTexture] = useState(null);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = "videos/V1reel.mp4";
    video.loop = true;
    video.muted = true;
    video.controls = true;
    video.width = 300;
    video.height = 300;
    const texture = PIXI.Texture.from(video);
    setVideoTexture(texture);
  }, []);

  return videoTexture !== null ? (
    <Stage width={320} height={500}>
      <Sprite texture={videoTexture} scale={("0.25", "0.25")} />
    </Stage>
  ) : (
    <div>Loading Video...</div>
  );
};
export default VideoBackground;
