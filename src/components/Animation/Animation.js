import React from "react";
import Confetti from "react-confetti";

export default function Result({ isStart, size, children, numberOfPieces }) {
  const starSize = size ? size : 1;
  const [width, setWidth] = React.useState(null);
  const [height, setHeight] = React.useState(null);

  const confetiRef = React.useRef(null);

  React.useEffect(() => {
    setHeight(confetiRef.current.clientHeight);
    setWidth(confetiRef.current.clientWidth);
  }, []);

  function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    var rot = (Math.PI / 2) * 3;
    var x = cx;
    var y = cy;
    var step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (var i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }

  return (
    <div ref={confetiRef}>
      {children}
      {isStart ? (
        <Confetti
          // friction={1}
          wind={0}
          gravity={0.05}
          opacity={1}
          recycle={true}
          numberOfPieces={numberOfPieces}
          width={width}
          height={height}
          // colors={["yellow"]}
          onConfettiComplete={(e) => {
            console.log("Complete");
          }}
          drawShape={(ctx) => {
            drawStar(ctx, 1, 1, 5, starSize, starSize / 3);
          }}
        />
      ) : (
        <React.Fragment />
      )}
    </div>
  );
}
