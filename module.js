/**
 * @param {string} s
 * @returns {Element}
 */
const $ = (s) => document.querySelector(s);

const output = $("output");
const opacity = $("#opacity");
const test = $("#test");
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

function toRGB(value) {
  test.style.backgroundColor = value;

  const rgb = window.getComputedStyle(test).backgroundColor;
  const match = rgb.match(/rgba?\((\d+), (\d+), (\d+)(?:, ([0-9.]+))?\)/);

  if (!match || match.length < 4) return;

  const [, r, g, b] = match.map((_) => parseInt(_, 10));
  return { r, g, b };
}

function toHex({ r, g, b }) {
  return "#" + [r, g, b].map((_) => _.toString(16).padStart(2, "0")).join("");
}

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
  if (node.type === "text") {
    const colour = node.nextElementSibling;
    const rgbColour = toHex(toRGB(node.value));
    colour.style.backgroundColor = rgbColour;
    colour.value = rgbColour;
  } else if (node.type === "range") {
    output.textContent = node.value;
  }

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

  ctx.globalAlpha = parseInt(opacity.value, 10) / 100;

  ctx.fillStyle = fg.value;
  ctx.fillRect(0, 0, width, height);

  ctx.globalAlpha = 1;

  const imageData = ctx.getImageData(0, 0, 1, 1);
  const [r, g, b] = imageData.data;

  result.innerHTML = `
  <p>${toHex({ r, g, b })}</p>
  <p>rgb(${[r, g, b].join(", ")})</p>
  `;

  img.src = canvas.toDataURL();
  const query = new URLSearchParams();
  query.set("fg", fg.value);
  query.set("bg", bg.value);
  query.set("opacity", opacity.value);
  window.history.replaceState(null, null, "?" + query.toString());
}

// try to restore from query
if (window.location.search) {
  const query = new URLSearchParams(window.location.search.substring(1));
  bg.value = query.get("bg");
  fg.value = query.get("fg");
  opacity.value = query.get("opacity");
}

update(opacity);
update(bg);
update(fg);
