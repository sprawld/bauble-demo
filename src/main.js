import './style.css'
import Bauble from "./lib/player";
import source from "./janet/box.bauble";

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth * window.devicePixelRatio;
canvas.height = window.innerHeight * window.devicePixelRatio;

const bauble = new Bauble(canvas, {
  ...source,
});
