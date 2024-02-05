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
  const [framePerSecond, setFramePerSecond] = useState(24);
  const [videoDuration, setVideoDuration] = useState(5);

  const [recordingVideo, setRecordingVideo] = useState(false);

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

      const captureFrame = async (next) => {
        renderer.render(app.stage); // Render the current state to the renderer
        const frameData = renderer.view.toDataURL(); // Capture the frame as an image
        // console.log(frameData);

        // const testApi = await fetch("http://localhost:3005/upload-frame", {
        //   method: "POST",
        //   body: JSON.stringify({ frameId: next }),
        //   headers: {
        //     "Content-type": "application/json; charset=UTF-8",
        //   },
        // });
        // This is your image data URL
        // Send this data to the server or process as needed
      };

      // Example: Capture a frame every second
      // const intervalId = setInterval(() => {
      //   // console.log("outside", next);
      //   setFrameIdx((prev) => {
      //     let next = prev + 1;
      //     console.log("inside", next);
      //     captureFrame(next);
      //     return next;
      //   });
      // }, 1000);

      // setAnimationId(intervalId);
    }
  };

  // useEffect(() => {
  //   return () => clearInterval(animationId); // Clean up the interval on unmount
  // }, [animationId]);

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
    </Fragment>
  );
};

export default App;
