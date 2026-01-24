const strip = document.getElementById("strip");

// UI
const h = document.getElementById("h");
const hVal = document.getElementById("hVal");
const gap = document.getElementById("gap");
const gapVal = document.getElementById("gapVal");
const fitBtn = document.getElementById("fit");

function setCSSVars(){
  document.documentElement.style.setProperty("--imgH", `${h.value}px`);
  document.documentElement.style.setProperty("--gap", `${gap.value}px`);
  hVal.textContent = h.value;
  gapVal.textContent = gap.value;
}

h.addEventListener("input", setCSSVars);
gap.addEventListener("input", setCSSVars);

fitBtn.addEventListener("click", () => {
  const headerH = document.querySelector(".bar").offsetHeight;
  const target = Math.max(80, Math.min(600, window.innerHeight - headerH - 60));
  h.value = target;
  setCSSVars();
});

function makeImg(src, name){
  const img = new Image();
  img.loading = "lazy";
  img.decoding = "async";
  img.src = src;
  img.alt = name || "";
  img.onerror = () => {
    img.remove();
    console.warn("Failed to load:", src);
  };
  return img;
}

async function loadList(){
  const res = await fetch("./images.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`images.json load failed: ${res.status}`);
  return res.json();
}

async function render(){
  strip.innerHTML = "";

  let data;
  try {
    data = await loadList();
  } catch (e) {
    strip.innerHTML = `
      <div style="padding:14px; opacity:.9;">
        找不到 <b>images.json</b><br/>
        你有先執行 <code>npm run build:list</code> 嗎？
      </div>`;
    console.error(e);
    return;
  }

  for (const it of data.images){
    strip.appendChild(makeImg(`./${it.src}`, it.name));
  }
}

setCSSVars();
render();
