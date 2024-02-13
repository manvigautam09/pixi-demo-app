import React from "react";
import { Player, Controls } from "@lottiefiles/react-lottie-player";

const LottieReact = () => {
  return (
    <Player
      autoplay
      loop
      src="https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json"
      style={{ height: "300px", width: "300px" }}
    >
      <Controls visible={true} buttons={["play", "repeat", "frame", "debug"]} />
    </Player>
  );
};

export default LottieReact;
