# Módulo 5 · Análisis de Datos con IA — TopLearning

Dashboard interactivo de **presión arterial** para 59 pacientes: edad, altura, peso, presión sistólica y clasificación clínica de riesgo.

## 📊 Dashboard

Panel construido en **HTML, CSS y JS puros** (sin frameworks), con gráficos vía [Chart.js](https://www.chartjs.org/).

| Vista | Contenido |
|---|---|
| KPIs | Total de pacientes, presión promedio, % en Muy Alta/Crisis, % en Normal |
| Distribución | Barras por clasificación de presión |
| Dispersión | Edad vs. presión sistólica, coloreada por clasificación |
| Serie por paciente | Presión sistólica de cada paciente, ordenada por ID |
| Tabla | Detalle completo, filtrable por clasificación y género |

**Código de color** (semántico, por severidad clínica):

| Clasificación | Color |
|---|---|
| Normal | 🔵 Azul |
| Normal Alta | 🟢 Verde |
| Alta | 🟠 Ámbar |
| Muy Alta | 🔴 Rojo |
| Crisis Hipertensiva | 🔴 Rojo oscuro |

### Cómo verlo

Abre [`dashboard/index.html`](dashboard/index.html) directamente en el navegador — no requiere servidor ni instalación.

```
dashboard/
├── index.html   # Estructura de la página
├── style.css    # Estilos, tema claro/oscuro
├── script.js    # Lógica: filtros, KPIs y gráficos
└── data.js      # Dataset embebido como arreglo JS
```

## 📁 Dataset

[`dataset/dataset.csv`](dataset/dataset.csv) contiene los registros originales con las columnas:

`ID · Edad · Presion_Sistolica · Altura · Peso · Clasificacion_Presion · Genero`

## 🪪 Licencia

MIT — ver [LICENSE](LICENSE).
