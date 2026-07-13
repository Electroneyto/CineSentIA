import Script from "next/script";

const examples = [
  "No está nada mal: la historia tarda en arrancar, pero el final es brillante y la actuación excelente.",
  "La fotografía es preciosa, aunque el guion es predecible y el ritmo resulta insoportablemente lento.",
  "Qué obra maestra: logré dormir durante toda la película.",
];

export default function Home() {
  return (
    <main id="inicio">
      <nav className="nav shell" aria-label="Navegación principal">
        <a className="brand" href="#inicio" aria-label="CineSentIA, inicio">
          <span className="brand-mark">C</span>
          <span>CineSentIA</span>
        </a>
        <div className="nav-links">
          <a href="#analizador">Analizador</a>
          <a href="#metodologia">Cómo funciona</a>
          <a href="#resultados">Resultados</a>
        </div>
        <a className="nav-cta" href="./CineSentIA_Proyecto_Final_Colab.ipynb" download>
          Ver notebook <span aria-hidden="true">↗</span>
        </a>
      </nav>

      <header className="hero shell">
        <div className="hero-copy">
          <div className="eyebrow"><span className="live-dot" /> Proyecto final de PLN · UCB 2026</div>
          <h1>¿Qué dice realmente una crítica de cine?</h1>
          <p className="hero-lede">
            CineSentIA transforma una reseña en español en una lectura clara de su
            sentimiento, recomendación y opinión sobre cada aspecto de la película.
          </p>
          <div className="hero-facts" aria-label="Datos destacados">
            <div><strong>49.599</strong><span>reseñas válidas</span></div>
            <div><strong>87,04 %</strong><span>exactitud en prueba</span></div>
            <div><strong>100 %</strong><span>en tu navegador</span></div>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orb orb-a" />
          <div className="orb orb-b" />
          <div className="poster-card poster-back"><span>NEGATIVO</span><b>0.13</b></div>
          <div className="poster-card poster-front"><span>POSITIVO</span><b>0.87</b><i>Una historia que emociona</i></div>
          <div className="film-line">CINESENTIA · NLP · 2026 · CINESENTIA · NLP</div>
        </div>
      </header>

      <section className="analyzer-wrap" id="analizador" aria-labelledby="analyzer-title">
        <div className="shell">
          <div className="section-kicker">Analizador en vivo</div>
          <div className="section-heading compact">
            <h2 id="analyzer-title">Pon a prueba el modelo.</h2>
            <p>Escribe una opinión real o elige uno de los ejemplos del proyecto.</p>
          </div>

          <div className="analyzer-grid">
            <article className="input-panel panel">
              <div className="panel-top"><span>01</span><h3>Escribe una crítica</h3><b id="char-count">0 caracteres</b></div>
              <label className="sr-only" htmlFor="review-input">Crítica de película o serie</label>
              <textarea id="review-input" rows={8} defaultValue={examples[0]} placeholder="Ejemplo: La actuación fue excelente, pero el guion resultó predecible…" />
              <div className="examples" aria-label="Ejemplos para probar">
                {examples.map((example, index) => (
                  <button key={index} type="button" className="example-chip" data-example={example}>Ejemplo {index + 1}</button>
                ))}
              </div>
              <button id="analyze-button" type="button" className="analyze-button" disabled>
                <span id="button-label">Cargando modelo…</span><span aria-hidden="true">→</span>
              </button>
              <p className="privacy-note"><span aria-hidden="true">◉</span> Tu texto no sale de este dispositivo.</p>
            </article>

            <article className="result-panel panel" aria-live="polite">
              <div className="panel-top"><span>02</span><h3>Resultado</h3><b>TF‑IDF + Naive Bayes</b></div>
              <div id="result-empty" className="result-empty">
                <div className="loader-ring" />
                <p id="model-status">Preparando el modelo del proyecto…</p>
              </div>
              <div id="result-content" className="result-content" hidden>
                <div className="sentiment-row">
                  <div><span className="micro-label">Sentimiento general</span><strong id="sentiment-label">—</strong></div>
                  <div className="score-dial" id="score-dial"><span id="score-value">—</span><small>positiva</small></div>
                </div>
                <div className="probability-track"><i id="probability-fill" /></div>
                <div className="result-facts">
                  <div><span>Confianza</span><strong id="confidence-value">—</strong></div>
                  <div><span>Recomendación</span><strong id="recommendation-value">—</strong></div>
                </div>
                <div className="topic-card"><span className="micro-label">Tema predominante</span><strong id="topic-label">—</strong><p id="topic-terms">—</p></div>
              </div>
            </article>
          </div>

          <article className="aspects-panel panel">
            <div className="panel-top"><span>03</span><h3>Opinión por aspectos</h3><b>Evidencia extraída de la crítica</b></div>
            <div className="aspects-table" role="table" aria-label="Análisis por aspectos">
              <div className="aspect-row aspect-header" role="row"><span>Aspecto</span><span>Sentimiento</span><span>Prob. positiva</span><span>Evidencia</span></div>
              <div id="aspects-body"><div className="aspects-placeholder">El análisis por aspectos aparecerá aquí.</div></div>
            </div>
          </article>
        </div>
      </section>

      <section className="story-section shell" id="metodologia">
        <div className="section-kicker">Del texto a la decisión</div>
        <div className="section-heading">
          <h2>Un pipeline legible,<br />auditable y reproducible.</h2>
          <p>El notebook compara un modelo clásico con una red neuronal. El modelo final se eligió por rendimiento medido sobre datos nunca vistos durante el entrenamiento.</p>
        </div>
        <div className="pipeline" aria-label="Etapas del procesamiento">
          <article><span>01</span><i>⌁</i><h3>Limpiar</h3><p>Normaliza HTML, URLs y números; conserva negaciones como “no” y “nunca”.</p></article>
          <article><span>02</span><i>▦</i><h3>Representar</h3><p>Convierte palabras y pares de palabras en 40.000 señales ponderadas con TF‑IDF.</p></article>
          <article><span>03</span><i>≈</i><h3>Clasificar</h3><p>Naive Bayes estima la probabilidad de que la crítica sea positiva o negativa.</p></article>
          <article><span>04</span><i>◎</i><h3>Explicar</h3><p>Resume confianza, tema y evidencia de guion, actuación, dirección y otros aspectos.</p></article>
        </div>
      </section>

      <section className="results-section" id="resultados">
        <div className="shell">
          <div className="section-kicker light">Evaluación en 7.440 reseñas de prueba</div>
          <div className="results-grid">
            <div>
              <h2>Dos enfoques.<br /><em>Un ganador medible.</em></h2>
              <p>TF‑IDF + Naive Bayes logró el F1 más alto y además fue más rápido. Por eso es el modelo activo de esta experiencia.</p>
              <div className="model-badge">Modelo seleccionado <strong>TF‑IDF + Naive Bayes</strong></div>
            </div>
            <div className="metric-card">
              <div className="metric-row"><span>Exactitud</span><b>87,04 %</b><i style={{"--value":"87.04%"} as React.CSSProperties} /></div>
              <div className="metric-row"><span>F1</span><b>87,26 %</b><i style={{"--value":"87.26%"} as React.CSSProperties} /></div>
              <div className="metric-row"><span>ROC AUC</span><b>94,20 %</b><i style={{"--value":"94.2%"} as React.CSSProperties} /></div>
              <div className="comparison">
                <div><span>TF‑IDF + NB</span><strong>0,8726</strong><small>F1</small></div>
                <div><span>BiLSTM</span><strong>0,8620</strong><small>F1</small></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="data-section shell">
        <div className="data-copy">
          <div className="section-kicker">De dónde viene</div>
          <h2>50 mil críticas de IMDb traducidas al español.</h2>
          <p>Después de eliminar 401 duplicados, el proyecto trabaja con 49.599 reseñas: 24.886 positivas y 24.713 negativas. La división estratificada usa 70 % para entrenamiento, 15 % para validación y 15 % para prueba.</p>
          <a className="text-link" href="./CineSentIA_Proyecto_Final_Colab.ipynb" download>Descargar el notebook completo <span>↗</span></a>
        </div>
        <div className="data-viz" aria-label="Balance del dataset">
          <div className="donut"><div><strong>49.599</strong><span>reseñas válidas</span></div></div>
          <div className="legend"><p><i className="positive-dot" /><span>Positivas</span><strong>24.886</strong></p><p><i className="negative-dot" /><span>Negativas</span><strong>24.713</strong></p></div>
        </div>
      </section>

      <section className="limits-section shell">
        <div className="section-kicker">Uso responsable</div>
        <div className="section-heading compact"><h2>Lo que el modelo no sabe.</h2><p>Una predicción probabilística ayuda a explorar opiniones; no sustituye una lectura humana.</p></div>
        <div className="limits-grid">
          <article><b>Ironía y sarcasmo</b><p>“Una obra maestra: me dormí” puede confundir al modelo porque las palabras positivas contradicen la intención.</p></article>
          <article><b>Contexto cultural</b><p>Modismos, nombres propios o referencias recientes fuera del corpus pueden reducir la confianza.</p></article>
          <article><b>Neutralidad aproximada</b><p>“Neutral / incierto” no fue una clase entrenada: se muestra cuando la probabilidad queda cerca de 50 %.</p></article>
        </div>
      </section>

      <footer>
        <div className="shell footer-inner"><div><a className="brand" href="#inicio"><span className="brand-mark">C</span><span>CineSentIA</span></a><p>Procesamiento de Lenguaje Natural aplicado al cine.</p></div><div><span>Proyecto y desarrollo</span><strong>Miguel Angel Lozada Torrico</strong><small>Universidad Católica Boliviana “San Pablo” · 2026</small></div></div>
      </footer>
      <Script src="./cinesentia.js" strategy="afterInteractive" />
    </main>
  );
}
