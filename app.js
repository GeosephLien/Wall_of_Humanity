// �A��b /images/ �̪��Ϥ��ɦW�M��
//�]�]�� GitHub Pages �«e�ݵL�k��������Ƨ��^
const IMAGES = [
  "001.png",
  "002.png",
  "003.png",
  "004.png"
  // ...�ۦ�W�[
].map(name => `./images/${name}`);


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
  // ��Ϥ����׳]���������ת��@�Ӥ�ҡ]���� header �P padding�^
  const headerH = document.querySelector(".bar").offsetHeight;
  const target = Math.max(80, Math.min(600, window.innerHeight - headerH - 60));
  h.value = target;
  setCSSVars();
});

function makeImg(src){
  const img = new Image();
  img.loading = "lazy";
  img.decoding = "async";
  img.src = src;
  img.alt = src.split("/").pop();
  img.onerror = () => {
    img.remove();
    console.warn("Failed to load:", src);
  };
  return img;
}

function render(){
  strip.innerHTML = "";
  for (const src of IMAGES){
    strip.appendChild(makeImg(src));
  }
}

setCSSVars();
render();
