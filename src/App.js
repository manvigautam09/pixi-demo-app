import { BlurFilter } from "pixi.js";
import { Stage, Container, Sprite, Text, useTick } from "@pixi/react";
import React, { Fragment, useMemo, useReducer, useRef, useState } from "react";

const BunnyAnimation = () => {
  const reducer = (_, { data }) => data;
  const blurFilter = useMemo(() => new BlurFilter(4), []);
  const [motion, update] = useReducer(reducer);
  const iter = useRef(0);
  // Listen for animate update

  useTick((delta) => {
    const i = (iter.current += 0.05 * delta);

    update({
      type: "update",
      data: {
        x: 390 + Math.sin(i) * 100,
        // x: 390,
        y: 270 + Math.sin(i / 1.5) * 100,
        // y: 270,
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

  const [videoDuration, setVideoDuration] = useState(5);
  const [framePerSecond, setFramePerSecond] = useState(24);
  const [recordingVideo, setRecordingVideo] = useState(false);
  const [showMakeVideo, setShowMakeVideo] = useState(false);

  const handleOptionChange = (e) => {
    setFramePerSecond(Number(e.target.value));
  };

  const handleInputChange = (e) => {
    setVideoDuration(e.target.value);
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
          framesData.current[secIdx][milliSecondIdx] = frameData;
          console.log(framesData.current, secIdx, milliSecondIdx);
          if (secIdx === videoDuration && milliSecondIdx === framePerSecond) {
            setRecordingVideo(false);
            setShowMakeVideo(true);
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

  const makeVideo = async () => {
    const testApi = await fetch("http://localhost:3005/upload-frame", {
      method: "POST",
      body: JSON.stringify({ framesData }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
  };

  // This is your image data URL
  // Send this data to the server or process as needed

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
          min={5}
          max={30}
          value={videoDuration}
          disabled={recordingVideo}
          onChange={handleInputChange}
          style={{ height: 18, margin: 10, paddingLeft: 10, paddingRight: 10 }}
        />
        <button style={{ height: 36, margin: 10 }} onClick={recordVideo}>
          Record video
        </button>
      </div>

      <Stage ref={stageRef} options={{ backgroundColor: "#1099bb" }}>
        <BunnyAnimation />
      </Stage>
      {showMakeVideo && (
        <div style={{ display: "flex", flexDirection: "column", width: 500 }}>
          <button style={{ height: 36, margin: 10 }} onClick={makeVideo}>
            Make video
          </button>
        </div>
      )}
    </Fragment>
  );
};

export default App;
