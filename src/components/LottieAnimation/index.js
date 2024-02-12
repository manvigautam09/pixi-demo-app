import { useEffect, useRef } from "react";
import lottie from "lottie-web";

const LottieAnimation = ({ lottieJsonUrl }) => {
  const lottieRef = useRef(null);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: lottieRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: lottieJsonUrl,
    });

    return () => anim.destroy(); // Optional clean up for unmounting
  }, [lottieJsonUrl]);

  return (
    <div ref={lottieRef} style={{ position: "absolute", top: 0, left: 0 }} />
  );
};

export default LottieAnimation;
