import { useEffect, useState } from "react";
import * as PIXI from "pixi.js";
import lottie from "lottie-web";
import { AnimatedSprite, Container, Stage, Text } from "@pixi/react";

import animationData from "../../utils/animation.json";

const LottieAnimationWithPixi = () => {
  const [textures, setTextures] = useState([]);

  function renderLottieFramesToTextures() {
    const frames = [];
    const offScreenCanvas = document.createElement("canvas");
    const context = offScreenCanvas.getContext("2d");
    const animation = lottie.loadAnimation({
      container: offScreenCanvas,
      renderer: "canvas",
      loop: false,
      autoplay: false,
      path: "http://localhost:3005/json-data",
      // animationData: animationData,
    });

    console.log("### animation: ", animation);
    animation.addEventListener("DOMLoaded", () => {
      console.log("### enters here: ");
      const numFrames = animation.totalFrames;
      console.log("### enters numFrames: ", numFrames);

      for (let i = 0; i < numFrames; i++) {
        animation.goToAndStop(i, true);
        const dataURL = offScreenCanvas.toDataURL();
        console.log("### dataURL", dataURL);
        frames.push(PIXI.Texture.from(dataURL));
      }
      console.log("### frames: ", frames);

      // onTexturesReady(frames);
      setTextures(frames);
    });
  }

  // async function renderLottieFramesToTextures() {
  //   const onScreenCanvas = document.getElementById("lottie-canvas");
  //   onScreenCanvas.width = 800; // Adjust as needed
  //   onScreenCanvas.height = 600; // Adjust as needed

  //   const animation = await lottie.loadAnimation({
  //     container: onScreenCanvas,
  //     renderer: "canvas",
  //     loop: true,
  //     autoplay: true,
  //     path: "http://localhost:3005/json-data", // URL or path to your Lottie JSON
  //   });
  //   console.log("### animation", animation);
  // }

  useEffect(() => {
    renderLottieFramesToTextures();
  }, []);

  return (
    <div>
      <canvas id="lottie-canvas"></canvas>
      {/* <Stage width={600} height={600} options={{ backgroundColor: 0xeef1f5 }}>
        <Container position={[150, 150]}>
          {textures.length > 0 ? (
            <AnimatedSprite
              anchor={0.5}
              textures={textures}
              // isPlaying={true}
              initialFrame={0}
              // animationSpeed={0.1}
            />
          ) : (
            <Text text="Loading.." />
          )}
        </Container>
      </Stage> */}
    </div>
  );
};

export default LottieAnimationWithPixi;
