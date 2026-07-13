(() => {
  const $ = (selector) => document.querySelector(selector);
  const input = $("#review-input");
  const button = $("#analyze-button");
  const buttonLabel = $("#button-label");
  const charCount = $("#char-count");
  let model = null;
  let featureMap = null;
  let stopwords = null;

  const ASPECTS = {
    "Guion / historia": ["guion", "historia", "trama", "argumento", "narrativa", "dialogo", "final"],
    "Actuación": ["actuacion", "actor", "actriz", "reparto", "interpretacion"],
    "Dirección": ["direccion", "director", "directora", "realizacion"],
    "Ritmo / duración": ["ritmo", "lenta", "lento", "rapida", "rapido", "duracion", "aburrida", "aburrido"],
    "Música / sonido": ["musica", "banda sonora", "sonido", "audio", "cancion"],
    "Visuales / efectos": ["fotografia", "visual", "efectos", "animacion", "camara"],
  };

  const stripAccents = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  function preprocess(value) {
    const cleaned = String(value)
      .normalize("NFKC")
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/https?:\/\/\S+|www\.\S+/gi, " URL ")
      .replace(/\S+@\S+/g, " EMAIL ")
      .replace(/\d+/g, " NUM ")
      .toLowerCase();
    return (cleaned.match(/[a-záéíóúüñ]+/gi) || [])
      .filter((token) => !stopwords.has(token))
      .join(" ");
  }

  function termsFor(value) {
    const tokens = stripAccents(preprocess(value)).split(/\s+/).filter((token) => token.length >= 2);
    return tokens.concat(tokens.slice(0, -1).map((token, index) => `${token} ${tokens[index + 1]}`));
  }

  function probability(value) {
    const counts = new Map();
    for (const term of termsFor(value)) counts.set(term, (counts.get(term) || 0) + 1);
    const active = [];
    let normSquared = 0;
    for (const [term, count] of counts) {
      const feature = featureMap.get(term);
      if (!feature) continue;
      const weight = (1 + Math.log(count)) * feature[0];
      active.push([weight, feature[1], feature[2]]);
      normSquared += weight * weight;
    }
    if (!active.length) return 0.5;
    const norm = Math.sqrt(normSquared);
    let score0 = model.classLogPrior[0];
    let score1 = model.classLogPrior[1];
    for (const [weight, log0, log1] of active) {
      score0 += (weight / norm) * log0;
      score1 += (weight / norm) * log1;
    }
    const max = Math.max(score0, score1);
    const exp0 = Math.exp(score0 - max);
    const exp1 = Math.exp(score1 - max);
    return exp1 / (exp0 + exp1);
  }

  function labelFor(value) {
    if (Math.abs(value - 0.5) <= 0.08) return "Neutral / incierto";
    return value > 0.5 ? "Positivo" : "Negativo";
  }

  function topicFor(value) {
    const categories = [
      ["Guion e historia", ["guion", "historia", "trama", "argumento", "narrativa", "dialogo", "final", "personaje"]],
      ["Actuación y reparto", ["actuacion", "actor", "actriz", "reparto", "interpretacion", "protagonista"]],
      ["Dirección y estilo", ["direccion", "director", "directora", "realizacion", "escena", "montaje"]],
      ["Ritmo y duración", ["ritmo", "lenta", "lento", "rapida", "rapido", "duracion", "aburrida", "aburrido"]],
      ["Música y sonido", ["musica", "banda sonora", "sonido", "audio", "cancion"]],
      ["Fotografía y efectos", ["fotografia", "visual", "visuales", "efectos", "animacion", "camara", "imagen"]],
      ["Comedia y entretenimiento", ["comedia", "divertida", "divertido", "risa", "humor", "entretenida", "entretenido"]],
      ["Terror y suspenso", ["terror", "horror", "miedo", "suspenso", "tension", "monstruo", "asesino"]],
    ];
    const normalized = stripAccents(preprocess(value));
    const scored = categories.map(([label, keys]) => ({
      label,
      matches: keys.filter((key) => normalized.includes(key)),
      score: keys.reduce((sum, key) => sum + (normalized.split(key).length - 1), 0),
    })).sort((a, b) => b.score - a.score);
    if (!scored[0].score) return { label: "Valoración general", terms: "Opinión global sobre la película o serie" };
    return {
      label: scored[0].label,
      terms: `Señales detectadas: ${scored[0].matches.join(" · ")}`,
    };
  }

  function aspectRows(value) {
    const sentences = String(value).split(/(?<=[.!?;])\s+|\n+/).map((part) => part.trim()).filter(Boolean);
    return Object.entries(ASPECTS).map(([aspect, keys]) => {
      const evidence = sentences.filter((sentence) => {
        const normalized = stripAccents(sentence.toLowerCase());
        return keys.some((key) => normalized.includes(key));
      });
      if (!evidence.length) return { aspect, label: "No mencionado", probability: null, evidence: "—" };
      const score = evidence.reduce((sum, sentence) => sum + probability(sentence), 0) / evidence.length;
      return { aspect, label: labelFor(score), probability: score, evidence: evidence[0] };
    });
  }

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character]);

  function renderAspects(rows) {
    $("#aspects-body").innerHTML = rows.map((row) => {
      const type = row.label === "Positivo" ? "positive" : row.label === "Negativo" ? "negative" : row.label.startsWith("Neutral") ? "neutral" : "missing";
      const score = row.probability == null ? "—" : `${(row.probability * 100).toFixed(1).replace(".", ",")} %`;
      return `<div class="aspect-row" role="row"><strong>${escapeHtml(row.aspect)}</strong><span class="aspect-pill ${type}">${escapeHtml(row.label)}</span><span>${score}</span><span class="evidence" title="${escapeHtml(row.evidence)}">${escapeHtml(row.evidence)}</span></div>`;
    }).join("");
  }

  function analyze() {
    const value = input.value.trim();
    if (value.length < 10) {
      input.focus();
      input.setAttribute("aria-invalid", "true");
      buttonLabel.textContent = "Escribe al menos 10 caracteres";
      return;
    }
    input.removeAttribute("aria-invalid");
    const score = probability(value);
    const label = labelFor(score);
    const confidence = Math.max(score, 1 - score);
    const topic = topicFor(value);
    const recommendation = label === "Positivo" ? "Sí, recomendada" : label === "Negativo" ? "No recomendada" : "Opinión mixta";
    const percentage = `${(score * 100).toFixed(1).replace(".", ",")} %`;
    $("#sentiment-label").textContent = label;
    $("#sentiment-label").style.color = label === "Positivo" ? "#6dd1ad" : label === "Negativo" ? "#ef917f" : "#e2bf76";
    $("#score-value").textContent = percentage;
    $("#score-dial").style.setProperty("--score", `${score * 100}%`);
    $("#probability-fill").style.width = `${score * 100}%`;
    $("#confidence-value").textContent = `${(confidence * 100).toFixed(1).replace(".", ",")} %`;
    $("#recommendation-value").textContent = recommendation;
    $("#topic-label").textContent = topic.label;
    $("#topic-terms").textContent = topic.terms;
    renderAspects(aspectRows(value));
    buttonLabel.textContent = "Analizar crítica";
  }

  function updateCount() {
    charCount.textContent = `${input.value.length} caracteres`;
  }

  input.addEventListener("input", updateCount);
  input.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter" && model) analyze();
  });
  button.addEventListener("click", analyze);
  document.querySelectorAll("[data-example]").forEach((exampleButton) => {
    exampleButton.addEventListener("click", () => {
      input.value = exampleButton.dataset.example;
      updateCount();
      if (model) analyze();
    });
  });
  updateCount();

  fetch(new URL("model/cinesentia-model.json", document.baseURI))
    .then((response) => {
      if (!response.ok) throw new Error("No se pudo cargar el modelo");
      return response.json();
    })
    .then((payload) => {
      model = payload;
      stopwords = new Set(model.stopwords);
      featureMap = new Map(model.features.map(([term, idf, log0, log1]) => [term, [idf, log0, log1]]));
      button.disabled = false;
      buttonLabel.textContent = "Analizar crítica";
      analyze();
    })
    .catch(() => {
      buttonLabel.textContent = "Modelo no disponible";
    });
})();
