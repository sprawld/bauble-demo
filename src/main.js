import "./style.css";
import Bauble from "./lib/player";
import source from "./janet/dna.bauble";

const clamp = (a, min, max) => Math.min(max, Math.max(min, a));

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth * window.devicePixelRatio;
canvas.height = window.innerHeight * window.devicePixelRatio;

const bauble = new Bauble(canvas, source);

bauble.set({
  pos: [0, 0, 0],
  rotation: [0, 0],
  zoom: 1,
});

let pos = [0, 0, 0];
let rotation = [0, 0];

let ax = 0;
let ay = 0;
let az = 0;

let vx = 0;
let vy = 0;
let vz = 0;
let zoom = 1;

play();

function play() {
  vx = (vx + ax * 0.5) * 0.99;
  vy = (vy + ay * 0.5) * 0.99;
  vz = (vz + az * 0.5) * 0.99;

  pos = [pos[0] + vx, pos[1] + vy, pos[2] + vz];
  bauble.set({ pos, zoom, rotation });
  requestAnimationFrame(play);
}

canvas.addEventListener("wheel", (e) => {
  zoom += e.deltaY * 0.001;
});

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    ax = -1;
  } else if (e.key === "ArrowLeft") {
    ax = 1;
  } else if (e.key === "ArrowUp") {
    ay = -1;
  } else if (e.key === "ArrowDown") {
    ay = 1;
  } else if (e.key === "w") {
    az = 1;
  } else if (e.key === "s") {
    az = -1;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    ax = 0;
  } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    ay = 0;
  } else if (e.key === "w" || e.key === "s") {
    az = 0;
  }
});

let canvasPointerAt = [0, 0];
let interactionPointer = null;
canvas.addEventListener("pointerdown", (e) => {
  if (interactionPointer != null) {
    return;
  }
  e.preventDefault();
  canvas.focus();
  canvasPointerAt = [e.offsetX, e.offsetY];
  canvas.setPointerCapture(e.pointerId);
  interactionPointer = e.pointerId;
});
canvas.addEventListener("pointerup", (e) => {
  e.preventDefault();
  if (e.pointerId === interactionPointer) {
    interactionPointer = null;
  }
});
canvas.addEventListener("pointermove", (e) => {
  if (e.pointerId !== interactionPointer) {
    return;
  }
  e.preventDefault();
  const pointerWasAt = canvasPointerAt;
  canvasPointerAt = [e.offsetX, e.offsetY];
  console.log(
    canvas.offsetWidth,
    canvas.clientWidth,
    canvas.offsetWidth / canvas.clientWidth
  );
  const deltaX =
    (canvasPointerAt[0] - pointerWasAt[0]) *
    (canvas.offsetWidth / canvas.clientWidth);
  const deltaY =
    (canvasPointerAt[1] - pointerWasAt[1]) *
    (canvas.offsetHeight / canvas.clientHeight);
  const cameraRotateSpeed = 1 / 512;
  rotation = [
    rotation[0] - deltaX * cameraRotateSpeed,
    //   rotation[1] + deltaY * cameraRotateSpeed,
    clamp(rotation[1] + deltaY * cameraRotateSpeed, -Math.PI / 2, Math.PI / 2),
  ];

  console.log(
    `rotate ${rotation.join()} ${deltaX}, ${deltaY} ${canvasPointerAt[1]} ${
      pointerWasAt[1]
    }`
  );
});
