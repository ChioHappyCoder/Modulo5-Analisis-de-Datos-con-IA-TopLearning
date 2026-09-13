# Dashboard de Presión Arterial — Jupyter / Google Colab

Versión en notebook del dashboard: mismos datos, mismos KPIs y el mismo código de color por severidad clínica, pero ejecutado con **pandas + Plotly + ipywidgets**.

## Ejecutar en Jupyter local (con el venv de esta carpeta)

```bash
cd jupyter-colab
python -m venv venv

# Windows
.\venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python -m ipykernel install --user --name jupyter-colab-venv --display-name "Python (jupyter-colab venv)"

jupyter notebook dashboard_presion_arterial.ipynb
```

Al abrir el notebook, selecciona el kernel **"Python (jupyter-colab venv)"** (Kernel → Change kernel, o el selector de kernel arriba a la derecha en VS Code) y ejecuta todas las celdas (Kernel → Restart & Run All).

> ⚠️ Si ves `ModuleNotFoundError: No module named 'pandas'`, es porque el notebook está corriendo con otro kernel (el Python global, no el del venv). Cambia el kernel a **"Python (jupyter-colab venv)"** — la celda 1 del notebook también instala automáticamente cualquier dependencia faltante como respaldo.

## Ejecutar en Google Colab

1. Sube `dashboard_presion_arterial.ipynb` a Colab (Archivo → Subir cuaderno).
2. Ejecuta la primera celda de código — instala `pandas`, `plotly` e `ipywidgets` automáticamente cuando detecta que corre en Colab.
3. Si no clonas el repo dentro de Colab, la celda de carga de datos te pedirá subir `dataset/dataset.csv` manualmente.
4. Ejecuta el resto de celdas en orden (Entorno de ejecución → Ejecutar todas).

## Contenido

- Instalación condicional de dependencias (Colab vs. venv local)
- Carga de `dataset/dataset.csv`
- KPIs: total de pacientes, presión promedio, % Muy Alta/Crisis, % Normal
- Gráfico de barras: distribución por clasificación
- Dispersión: edad vs. presión sistólica
- Barras: presión sistólica por paciente
- Filtros interactivos (`ipywidgets`) por clasificación y género, con tabla resaltada por color

## Dependencias

Ver [`requirements.txt`](requirements.txt) (generado con `pip freeze` desde el venv). Paquetes principales: `jupyter`, `notebook`, `pandas`, `matplotlib`, `plotly`, `ipywidgets`.
