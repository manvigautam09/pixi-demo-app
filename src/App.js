import Lottie from "react-lottie";
import { v4 as uuidv4 } from "uuid";
import { BlurFilter } from "pixi.js";
import { useLocation } from "react-router-dom";
import { Stage, Container, Sprite, Text, useTick } from "@pixi/react";
import React, { Fragment, useMemo, useReducer, useRef, useState } from "react";

import { base64ToBlob } from "./utils/helpers";
import animationData from "./utils/animation.json";

const BunnyAnimation = () => {
  const reducer = (_, { data }) => data;
  const blurFilter = useMemo(() => new BlurFilter(4), []);
  const [motion, update] = useReducer(reducer);
  const iter = useRef(0);

  useTick((delta) => {
    const i = (iter.current += 0.05 * delta);

    update({
      type: "update",
      data: {
        x: 390 + Math.sin(i) * 100,
        y: 270 + Math.sin(i / 1.5) * 100,
        // rotation: Math.sin(i) * Math.PI,
        // anchor: Math.sin(i / 2),
      },
    });
  });

  return (
    <>
      <Sprite image="https://pixijs.io/pixi-react/img/bunny.png" {...motion} />

      <Container x={400} y={330}>
        <Text
          text="Hello World"
          anchor={{ x: 0.5, y: 0.5 }}
          filters={[blurFilter]}
        />
      </Container>
    </>
  );
};

const App = () => {
  const stageRef = useRef();
  const framesData = useRef({});
  const durationRef = useRef(1);
  const durationInsideSecondRef = useRef(1);
  const location = useLocation();

  const [videoDuration, setVideoDuration] = useState(
    location.search.split("?").length > 1
      ? location.search.split("?")[1].split("=")[1]
      : 2
  );
  const [framePerSecond, setFramePerSecond] = useState(
    location.search.split("?").length > 1
      ? location.search.split("?")[1].split("=")[1]
      : 24
  );
  const [recordingVideo, setRecordingVideo] = useState(false);
  const [showMakeVideo, setShowMakeVideo] = useState(false);

  const handleOptionChange = (e) => {
    setFramePerSecond(Number(e.target.value));
  };

  const handleInputChange = (e) => {
    setVideoDuration(Number(e.target.value));
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const makeVideoFromFfmpeg = async (videoDuration, framePerSecond) => {
    try {
      const res = await fetch("http://localhost:3005/make-video", {
        method: "POST",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          videoDuration,
          framePerSecond,
          framesData: framesData.current,
        }),
      });
      console.log("### res", res);
    } catch (error) {
      console.log("### error", error);
    }
  };

  const recordVideo = () => {
    setRecordingVideo(true);
    if (stageRef.current) {
      const app = stageRef.current.app; // Access the Pixi Application
      const renderer = app.renderer; // Access the renderer

      const captureFrameForSec = (secIdx) => {
        const captureFrame = (milliSecondIdx) => {
          renderer.render(app.stage); // Render the current state to the renderer
          const frameData = renderer.view.toDataURL(); // Capture the frame as an image
          const blob = base64ToBlob(
            frameData,
            `image-${framePerSecond * (secIdx - 1) + milliSecondIdx}/png`
          );

          framesData.current[secIdx][milliSecondIdx] = blob;
          console.log(framesData.current, secIdx, milliSecondIdx);
          console.log("### videoDuration", videoDuration);
          console.log("### framePerSecond", framePerSecond);

          if (secIdx === videoDuration && milliSecondIdx === framePerSecond) {
            setRecordingVideo(false);
            setShowMakeVideo(true);
            makeVideoFromFfmpeg(videoDuration, framePerSecond);
          }

          if (durationInsideSecondRef.current > framePerSecond - 1) {
            clearInterval(frameIntervalId);
            durationInsideSecondRef.current = 0;
          }
        };

        framesData.current[secIdx] = {};

        const frameIntervalId = setInterval(() => {
          captureFrame(durationInsideSecondRef.current);
          durationInsideSecondRef.current++;
        }, 1000 / framePerSecond);

        if (durationRef.current > videoDuration - 1) {
          clearInterval(secIntervalId);
        }
      };

      // Example: Capture a frame every second
      const secIntervalId = setInterval(() => {
        captureFrameForSec(durationRef.current);
        durationRef.current++;
      }, 1000);
    }
  };

  const recordVideoFromPuppeteer = async () => {
    try {
      const res = await fetch("http://localhost:3005/record-video", {
        headers: { "Content-type": "application/json; charset=UTF-8" },
        method: "POST",
        body: JSON.stringify({ id: uuidv4(), videoDuration, framePerSecond }),
      });
      console.log("### res", res);
    } catch (error) {
      console.log("### error", error);
    }
  };

  return (
    <Fragment>
      <div style={{ display: "flex", flexDirection: "column", width: 500 }}>
        <select
          value={framePerSecond}
          onChange={handleOptionChange}
          style={{ height: 36, margin: 10, paddingLeft: 10, paddingRight: 10 }}
          disabled={recordingVideo}
        >
          <option value="24">Select frames per second (24)</option>
          <option value="30">30</option>
          <option value="48">48</option>
          <option value="60">60</option>
        </select>

        <input
          type="number"
          min={2}
          max={30}
          value={videoDuration}
          disabled={recordingVideo}
          onChange={handleInputChange}
          style={{ height: 18, margin: 10, paddingLeft: 10, paddingRight: 10 }}
        />
        <button
          style={{ height: 36, margin: 10 }}
          onClick={recordVideo}
          id="record-video-button"
        >
          Record video
        </button>

        <button
          style={{ height: 36, margin: 10 }}
          onClick={recordVideoFromPuppeteer}
        >
          Download
        </button>
      </div>
      {/* <div ref={framesData} style={{ display: "none" }}></div> */}
      {/* <input
        style={{ display: "none" }}
        value={framesData.current}
        id="frames-data"
      /> */}

      <Stage ref={stageRef} options={{ backgroundColor: "#1099bb" }}>
        <BunnyAnimation />
      </Stage>

      {showMakeVideo && (
        <div style={{ display: "flex", flexDirection: "column", width: 500 }}>
          <button
            style={{ height: 36, margin: 10 }}
            onClick={recordVideoFromPuppeteer}
          >
            Save Files
          </button>
        </div>
      )}
      <Lottie options={defaultOptions} height={400} width={400} />
      {/* <Stage width={800} height={600}>
        <VideoBackground videoUrl={"videos/V1reel.mp4"} />
      </Stage> */}
      {/* <video
        src="videos/V1reel.mp4"
        width={300}
        height={300}
        controls
        autoPlay
        muted
        loop
      ></video> */}
    </Fragment>
  );
};

export default App;
// const wait = () =>
// new Promise((resolve) => {
//   setTimeout(() => {
//     resolve("resolved");
//   }, 100);
// });

// const makeVideo = async () => {
//   const a1 = Object.keys(framesData.current);

//   for (let i = 0; i < a1.length; i++) {
//     const secIdx = a1[i];
//     const a2 = Object.keys(framesData.current[secIdx]);

//     for (let j = 0; j < a2.length; j++) {
//       const milliSecondIdx = a2[j];

//       saveFile(
//         framesData.current[secIdx][milliSecondIdx],
//         `image-${
//           framePerSecond * (Number(secIdx) - 1) + Number(milliSecondIdx)
//         }.png`
//       );

//       await wait();
//     }
//   }
// };
