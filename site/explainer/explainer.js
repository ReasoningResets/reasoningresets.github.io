const stage = document.querySelector('[data-stage]');
const steps = [...document.querySelectorAll('[data-step]')];
const sceneLabel = document.querySelector('[data-scene-label]');
const progress = [...document.querySelectorAll('.scene-progress i')];

const sceneLabels = [
  'Conventional RL · no resets',
  'The reset as an intervention',
  'On-policy visitation',
  'The improvable set 𝒢',
  'Random-reset dilution',
  'Credit-oracle conditioning',
  'The square-law in estimation',
  'The two gains in Theorem 1',
];

function setScene(index) {
  if (!stage || !steps[index]) return;
  stage.dataset.scene = String(index);
  sceneLabel.textContent = sceneLabels[index];
  steps.forEach((step, stepIndex) => step.classList.toggle('active', stepIndex === index));
  progress.forEach((item, itemIndex) => item.classList.toggle('active', itemIndex === index));
}

if ('IntersectionObserver' in window) {
  const stepObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible) setScene(Number(visible.target.dataset.step));
  }, {
    threshold: [0.25, 0.45, 0.65],
    rootMargin: '-22% 0px -38% 0px',
  });

  steps.forEach((step) => stepObserver.observe(step));
} else {
  steps.forEach((step) => step.classList.add('active'));
}

setScene(0);

const beta = document.querySelector('[data-beta]');
const gamma = document.querySelector('[data-gamma]');
const betaOutput = document.querySelector('[data-beta-output]');
const gammaOutput = document.querySelector('[data-gamma-output]');
const signalValue = document.querySelector('[data-signal-value]');
const signalBar = document.querySelector('[data-signal-bar]');
const recallValue = document.querySelector('[data-recall-value]');
const recallBar = document.querySelector('[data-recall-bar]');
const qualityValue = document.querySelector('[data-quality-value]');
const qualityBar = document.querySelector('[data-quality-bar]');
const qualityNote = document.querySelector('[data-quality-note]');

function updateQuality() {
  const falseDiscovery = Number(beta.value);
  const recall = Number(gamma.value);
  const precision = 1 - falseDiscovery;
  const quality = precision * recall;
  const randomBoundary = 0.1;

  betaOutput.value = `β = ${falseDiscovery.toFixed(2)}`;
  gammaOutput.value = `γ = ${recall.toFixed(2)}`;
  signalValue.textContent = `${precision.toFixed(2)}τ`;
  signalBar.style.width = `${precision * 100}%`;
  recallValue.textContent = `${Math.round(recall * 100)}%`;
  recallBar.style.width = `${recall * 100}%`;
  qualityValue.textContent = `${Math.round(quality * 100)}%`;
  qualityBar.style.width = `${quality * 100}%`;

  const comparison = quality >= randomBoundary ? 'Above' : 'Below';
  qualityNote.innerHTML = `${comparison} the random-reset boundary for p<sub>π</sub> = 0.1.`;
  qualityNote.dataset.comparison = comparison.toLowerCase();
}

beta?.addEventListener('input', updateQuality);
gamma?.addEventListener('input', updateQuality);
if (beta && gamma) updateQuality();
