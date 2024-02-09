import React, { useMemo, useReducer, useRef } from "react";
import { BlurFilter } from "pixi.js";
import { Container, Sprite, Text, useTick } from "@pixi/react";

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

export default BunnyAnimation;
