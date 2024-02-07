import { Sprite, useApp, useTick } from "@pixi/react";
import { Texture } from "pixi.js";
import { useEffect, useRef } from "react";

// const VideoBackground = ({ videoUrl }) => {
//   const spriteRef = useRef();
//   const app = useApp();

//   useEffect(() => {
//     const video = document.createElement("video");
//     video.src = videoUrl;
//     video.loop = true;
//     video.muted = true;
//     video.play();

//     const texture = Texture.from(video);
//     spriteRef.current = { texture };

//     const update = () => {
//       if (texture) texture.update();
//     };

//     app.ticker.add(update);

//     return () => {
//       app.ticker.remove(update);
//       video.pause();
//       texture.destroy();
//     };
//   }, [app, videoUrl]);

//   return (
//     spriteRef.current && spriteRef.current.texture && <Sprite ref={spriteRef} />
//   );
// };

// const VideoBackground = ({ videoUrl }) => {
//   const spriteRef = useRef();
//   const videoRef = useRef();
//   const textureRef = useRef();

//   useEffect(() => {
//     // Create a video element
//     const video = document.createElement("video");
//     video.src = videoUrl;
//     video.loop = true;
//     video.muted = true;
//     video.play();
//     videoRef.current = video;
//     console.log("#### videoRef", videoRef.current);

//     // Create a texture from the video
//     const texture = Texture.from(video);
//     console.log("#### texture", texture);
//     textureRef.current = texture;

//     // Set the texture to the sprite
//     // if (spriteRef.current) {
//     console.log("### now", spriteRef, spriteRef.current);
//     spriteRef.current = { texture };
//     console.log("### then", spriteRef, spriteRef.current);
//     // }

//     return () => {
//       video.pause();
//       texture.destroy();
//     };
//   }, [videoUrl]);

//   useTick((delta) => {
//     if (textureRef.current) {
//       textureRef.current.update();
//     }
//   });

//   return (
//     spriteRef.current && spriteRef.current.texture && <Sprite ref={spriteRef} />
//   );
// };

// const VideoBackground = ({ videoUrl }) => {
//   const app = useApp();
//   const videoRef = useRef(null);
//   const spriteRef = useRef(null);

//   useEffect(() => {
//     // Create and configure the video element
//     const video = document.createElement("video");
//     video.src = videoUrl;
//     video.loop = true;
//     video.muted = true;
//     video.autoplay = true; // Important for autoplaying the video
//     video.load(); // Start loading the video

//     videoRef.current = video;

//     // Create a texture when the video can play
//     video.oncanplay = () => {
//       const texture = Texture.from(video);
//       spriteRef.current = { texture };
//     };

//     return () => {
//       //   video.pause();
//       //   if (spriteRef.current) {
//       //     spriteRef.current.texture.destroy();
//       //   }
//     };
//   }, [videoUrl, app]);

//   // Update the texture in each frame
//   app.ticker.add((delta) => {
//     if (spriteRef.current && spriteRef.current.texture) {
//       //   console.log("### delta", delta);
//       spriteRef.current.texture.update();
//     }
//   });

//   return (
//     spriteRef.current && spriteRef.current.texture && <Sprite ref={spriteRef} />
//   );
// };
const VideoBackground = ({ videoUrl, width, height }) => {
  const pixiContainer = useRef(null);
  const pixiApp = useRef(null);
  const videoElement = useRef(null);

  useEffect(() => {
    // Initialize PIXI Application
    //   pixiApp.current = new PIXI.Application({
    //     width: width,
    //     height: height,
    //     backgroundColor: 0x000000,
    //   });
    //   pixiContainer.current.appendChild(pixiApp.current.view);

    // Create and configure the video element
    const video = document.createElement("video");
    video.src = videoUrl;
    video.loop = true;
    video.muted = true;
    video.autoplay = true;
    videoElement.current = video;

    // Create texture from the video
    const texture = Texture.from(video);
    const sprite = new Sprite(texture);
    sprite.width = width;
    sprite.height = height;
    pixiApp.current.stage.addChild(sprite);

    // Update the texture on each frame
    pixiApp.current.ticker.add(() => {
      if (texture) texture.update();
    });

    return () => {
      // Cleanup
      video.pause();
      pixiApp.current.destroy(true, true);
    };
  }, [videoUrl, width, height]);

  return <div ref={pixiContainer} />;
};
export default VideoBackground;
