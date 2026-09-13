// Orden de severidad y colores por clasificación de presión
const CLASIFICACIONES = ["Normal", "Normal Alta", "Alta", "Muy Alta", "Crisis Hipertensiva"];

const COLORES = {
  "Normal": "#2f6fed",              // azul - presión normal / baja
  "Normal Alta": "#2fa66b",         // verde
  "Alta": "#e6a012",                // ámbar
  "Muy Alta": "#e2402c",            // rojo - hipertensión muy alta
  "Crisis Hipertensiva": "#b0221a", // rojo oscuro - crisis hipertensiva
};

const GENERO_LABEL = { M: "Mujer", H: "Hombre" };

let estado = { clasificacion: "todas", genero: "todos" };
let charts = {};

function datosFiltrados() {
  return DATASET.filter((d) => {
    const okClas = estado.clasificacion === "todas" || d.clasificacion === estado.clasificacion;
    const okGenero = estado.genero === "todos" || d.genero === estado.genero;
    return okClas && okGenero;
  });
}

function poblarFiltroClasificacion() {
  const select = document.getElementById("filter-clasificacion");
  CLASIFICACIONES.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    select.appendChild(opt);
  });
}

function actualizarKPIs(datos) {
  const total = datos.length;
  const promedio = total ? datos.reduce((s, d) => s + d.presion, 0) / total : 0;
  const altas = datos.filter((d) => d.clasificacion === "Muy Alta" || d.clasificacion === "Crisis Hipertensiva").length;
  const normales = datos.filter((d) => d.clasificacion === "Normal").length;

  document.getElementById("kpi-total").textContent = total;
  document.getElementById("kpi-avg").textContent = total ? `${promedio.toFixed(1)} mmHg` : "—";
  document.getElementById("kpi-high").textContent = total ? `${altas} (${((altas / total) * 100).toFixed(0)}%)` : "0";
  document.getElementById("kpi-low").textContent = total ? `${normales} (${((normales / total) * 100).toFixed(0)}%)` : "0";
}

function construirLeyenda(el, clasificaciones) {
  el.innerHTML = "";
  clasificaciones.forEach((c) => {
    const li = document.createElement("li");
    const swatch = document.createElement("span");
    swatch.className = "swatch";
    swatch.style.background = COLORES[c];
    li.appendChild(swatch);
    li.appendChild(document.createTextNode(c));
    el.appendChild(li);
  });
}

function renderDistribucion(datos) {
  const ctx = document.getElementById("chart-distribucion");
  const conteos = CLASIFICACIONES.map((c) => datos.filter((d) => d.clasificacion === c).length);

  if (charts.distribucion) charts.distribucion.destroy();
  charts.distribucion = new Chart(ctx, {
    type: "bar",
    data: {
      labels: CLASIFICACIONES,
      datasets: [
        {
          data: conteos,
          backgroundColor: CLASIFICACIONES.map((c) => COLORES[c]),
          borderRadius: 4,
          maxBarThickness: 40,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.parsed.y} paciente(s)`,
          },
        },
      },
      scales: {
        x: { ticks: { autoSkip: false, maxRotation: 20, minRotation: 0 }, grid: { display: false } },
        y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: "rgba(128,128,128,0.15)" } },
      },
    },
  });

  construirLeyenda(document.getElementById("legend-distribucion"), CLASIFICACIONES);
}

function renderScatter(datos) {
  const ctx = document.getElementById("chart-scatter");

  const datasets = CLASIFICACIONES.map((c) => ({
    label: c,
    data: datos
      .filter((d) => d.clasificacion === c)
      .map((d) => ({ x: d.edad, y: d.presion, id: d.id })),
    backgroundColor: COLORES[c],
    pointRadius: 5,
    pointHoverRadius: 7,
  }));

  if (charts.scatter) charts.scatter.destroy();
  charts.scatter = new Chart(ctx, {
    type: "scatter",
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) =>
              `Paciente #${ctx.raw.id} · Edad ${ctx.raw.x} · Presión ${ctx.raw.y} mmHg (${ctx.dataset.label})`,
          },
        },
      },
      scales: {
        x: { title: { display: true, text: "Edad (años)" }, grid: { color: "rgba(128,128,128,0.15)" } },
        y: { title: { display: true, text: "Presión sistólica (mmHg)" }, grid: { color: "rgba(128,128,128,0.15)" } },
      },
    },
  });

  construirLeyenda(document.getElementById("legend-scatter"), CLASIFICACIONES);
}

function renderBarras(datos) {
  const ctx = document.getElementById("chart-barras");
  const ordenados = [...datos].sort((a, b) => a.id - b.id);

  if (charts.barras) charts.barras.destroy();
  charts.barras = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ordenados.map((d) => `#${d.id}`),
      datasets: [
        {
          label: "Presión sistólica",
          data: ordenados.map((d) => d.presion),
          backgroundColor: ordenados.map((d) => COLORES[d.clasificacion]),
          borderRadius: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const d = ordenados[ctx.dataIndex];
              return `Paciente #${d.id} · ${d.presion} mmHg · ${d.clasificacion} · ${GENERO_LABEL[d.genero]}, ${d.edad} años`;
            },
          },
        },
      },
      scales: {
        x: { ticks: { autoSkip: true, maxTicksLimit: 20 }, grid: { display: false } },
        y: {
          beginAtZero: false,
          title: { display: true, text: "mmHg" },
          grid: { color: "rgba(128,128,128,0.15)" },
        },
      },
    },
  });
}

function renderTabla(datos) {
  const body = document.getElementById("tabla-body");
  body.innerHTML = "";
  const ordenados = [...datos].sort((a, b) => a.id - b.id);

  ordenados.forEach((d) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${d.id}</td>
      <td>${d.edad}</td>
      <td>${GENERO_LABEL[d.genero]}</td>
      <td>${d.altura.toFixed(2)}</td>
      <td>${d.peso}</td>
      <td>${d.presion} mmHg</td>
      <td>
        <span class="tag" style="background:${COLORES[d.clasificacion]}22; color:${COLORES[d.clasificacion]}">
          <span class="dot" style="background:${COLORES[d.clasificacion]}"></span>${d.clasificacion}
        </span>
      </td>
    `;
    body.appendChild(tr);
  });
}

function renderTodo() {
  const datos = datosFiltrados();
  actualizarKPIs(datos);
  renderDistribucion(datos);
  renderScatter(datos);
  renderBarras(datos);
  renderTabla(datos);
}

function init() {
  poblarFiltroClasificacion();

  document.getElementById("filter-clasificacion").addEventListener("change", (e) => {
    estado.clasificacion = e.target.value;
    renderTodo();
  });

  document.getElementById("filter-genero").addEventListener("change", (e) => {
    estado.genero = e.target.value;
    renderTodo();
  });

  renderTodo();
}

document.addEventListener("DOMContentLoaded", init);
