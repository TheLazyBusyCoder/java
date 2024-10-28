const data = {};

function addCode(id) {
  document.getElementById(id).textContent = data[id];
}

for (k in data) {
  addCode(k);
}
