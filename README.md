# CineSentIA

Analizador de críticas de cine y series en español desarrollado como proyecto final de Procesamiento de Lenguaje Natural en la Universidad Católica Boliviana “San Pablo”.

## Sitio público

[electroneyto.github.io/CineSentIA](https://electroneyto.github.io/CineSentIA/)

La aplicación ejecuta en el navegador un modelo **TF‑IDF + Multinomial Naive Bayes** exportado desde el notebook del proyecto. No envía las reseñas a ningún servidor.

## Qué incluye

- clasificación de sentimiento positivo, negativo o incierto;
- probabilidad positiva, confianza y recomendación;
- tema predominante aproximado a partir de los tópicos LDA;
- evidencia de sentimiento por guion, actuación, dirección, ritmo, sonido y visuales;
- explicación del pipeline, dataset, métricas y limitaciones;
- notebook original descargable.

## Resultados del notebook

| Modelo | Accuracy | F1 | ROC AUC |
| --- | ---: | ---: | ---: |
| TF‑IDF + Naive Bayes | 0,8704 | 0,8726 | 0,9420 |
| Embeddings + BiLSTM | 0,8616 | 0,8620 | 0,9357 |

El corpus parte de 50.000 reseñas. Después de eliminar 401 duplicados quedan 49.599 observaciones válidas y balanceadas. El CSV original no se publica en este repositorio porque pesa 137 MB; el artefacto compacto del modelo sí está incluido.

## Desarrollo local

Requiere Node.js 22.13 o superior.

```bash
npm install
npm run dev
```

Validación para el despliegue:

```bash
npm run build
npm run build:pages
```

GitHub Actions publica automáticamente la carpeta estática generada en GitHub Pages.
