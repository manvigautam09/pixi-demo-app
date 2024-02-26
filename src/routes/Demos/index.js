// Test URL ?duration=2?fps=24?videoId=d2d4c589-ee23-4dc5-a218-fe738e52cd6a
import React, { Fragment, useRef, useState } from "react";
// import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Stage, Text } from "@pixi/react";
// import FormData from "form-data";
import { useLocation } from "react-router-dom";

import { base64ToBlob } from "../../utils/helpers";
import BunnyAnimation from "../../components/BunnyAnimation";
import VideoBackground from "../../components/VideoBackground";
import LottieReact from "../../components/LottieReact";
import LottieAnimationWithPixi from "../../components/LottieAnimationWithPixi";
import LottieAnimation from "../../components/LottieAnimation";

const App = () => {
  const stageRef = useRef();
  const framesData = useRef({});
  const durationRef = useRef(1);
  const durationInsideSecondRef = useRef(1);
  const location = useLocation();

  const [videoDuration, setVideoDuration] = useState(
    location.search.split("?").length > 1
      ? Number(location.search.split("?")[1].split("=")[1])
      : 2
  );
  const [framePerSecond, setFramePerSecond] = useState(
    location.search.split("?").length > 1
      ? Number(location.search.split("?")[2].split("=")[1])
      : 24
  );
  const videoId =
    location.search.split("?").length > 1
      ? location.search.split("?")[3].split("=")[1]
      : null;
  const [recordingVideo, setRecordingVideo] = useState(false);
  const [showMakeVideo, setShowMakeVideo] = useState(false);

  const handleOptionChange = (e) => {
    setFramePerSecond(Number(e.target.value));
  };

  const handleInputChange = (e) => {
    setVideoDuration(Number(e.target.value));
  };

  // const defaultOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: animationData,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid slice",
  //   },
  // };

  // const makeVideoFromFfmpeg = async (
  //   videoDuration,
  //   framePerSecond,
  //   videoId
  // ) => {
  //   try {
  //     const formData = new FormData();

  //     Object.keys(framesData.current).forEach((id) => {
  //       Object.keys(framesData.current[id]).forEach((idx) => {
  //         formData.append("files", framesData.current[id][idx]);
  //       });
  //     });

  //     const res = await axios.post(
  //       `http://localhost:3005/make-video?videoDuration=${videoDuration}&framePerSecond=${framePerSecond}&videoId=${videoId}`,
  //       formData
  //     );

  //     console.log("### res", res);
  //   } catch (error) {
  //     console.log("### error", error);
  //   }
  // };

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
          const framesDiv = document.getElementById("frames-list");
          const li = document.createElement("li");
          li.appendChild(document.createTextNode(frameData));
          li.id = `image-${framePerSecond * (secIdx - 1) + milliSecondIdx}.png`;
          framesDiv.appendChild(li);

          if (secIdx === videoDuration && milliSecondIdx === framePerSecond) {
            setRecordingVideo(false);
            setShowMakeVideo(true);
            // makeVideoFromFfmpeg(videoDuration, framePerSecond, videoId);
            const frameRecordedDiv = document.createElement("div");
            frameRecordedDiv.id = `id-${videoId}`;
            frameRecordedDiv.innerHTML = "Video recorded";
            document.body.appendChild(frameRecordedDiv);
            frameRecordedDiv.style.display = "none";
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
      <LottieAnimationWithPixi />
      <div style={{ display: "flex", flexDirection: "column", width: 500 }}>
        <div id="frames-list" style={{ display: "none" }}></div>
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
      <div style={{ position: "relative" }}>
        <Stage ref={stageRef} options={{ backgroundColor: "#1099bb" }}>
          <BunnyAnimation />
          <Text text="Loading.." />
        </Stage>
        <div style={{ height: 30, width: 30 }}>
          {/* lottieJsonUrl="https://assets1.lottiefiles.com/packages/lf20_RkWAMt.json" */}
          <LottieAnimation lottieJsonUrl="http://localhost:3005/json-data" />
        </div>
      </div>

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
      <VideoBackground />
      <LottieReact />
      {/* // LottieAnimation <Lottie options={defaultOptions} height={400} width={400} /> */}
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
