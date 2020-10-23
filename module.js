console.clear();

/**
 * @param {string} s
 * @returns {Element}
 */
const $ = (s) => document.querySelector(s);

const output = $("output");
const opacity = $("#opacity");
const result = $("#result div");
const fg = $("#fg");
const bg = $("#bg");
const img = $("img");
/** @type {HTMLCanvasElement} */
const canvas = $("canvas");
canvas.width = 1;
canvas.height = 1;
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");
const root = document.documentElement;

root.addEventListener(
  "input",
  (event) => {
    const node = event.target;
    if (node.nodeName === "INPUT") {
      if (node.type === "color") {
        updateColour(node);
      } else {
        update(node);
      }
    }
  },
  false
);

opacity.addEventListener("input", (event) => {
  output.textContent = event.target.value;
});

const pixel = (rgb) =>
  `47 49 46 38 39 61 01 00 01 00 80 01 00 ${rgb.join(
    " "
  )} 00 00 00 2C 00 00 00 00 01 00 01 00 00 02 02 44 01 00 3B`;

/**
 * @param {HTMLInputElement} node
 */
function updateColour(node) {
  const input = node.previousElementSibling;
  input.value = node.value;
  update(input);
}

/**
 * @param {HTMLInputElement} node
 */
function update(node) {
  const colour = node.nextElementSibling;
  colour.style.backgroundColor = node.value;
  colour.value = node.value;
  try {
    calc();
  } catch (e) {
    console.log(e);
  }
}

function calc() {
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = bg.value;
  ctx.fillRect(0, 0, width, height);
  // console.log(ctx.globalAlpha, parseInt(opacity.value, 10) / 100);

  ctx.globalAlpha = parseInt(opacity.value, 10) / 100;

  ctx.fillStyle = fg.value;
  ctx.fillRect(0, 0, width, height);

  ctx.globalAlpha = 1;

  const imageData = ctx.getImageData(0, 0, 1, 1);
  const [r, g, b, a] = imageData.data;
  // return { r, g, b };

  result.innerHTML = `
  <p>#${[r, g, b].map((_) => _.toString(16).padStart(2, "0")).join("")}</p>
  <p>rgb(${[r, g, b].join(", ")})</p>
  `;

  img.src = canvas.toDataURL();
}

update(bg);
update(fg);
