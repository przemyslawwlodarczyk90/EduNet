import { useEffect, useState } from "react";
import { fetchNetworkDevices } from "../api";
import type { NetworkDevice } from "../types";
import { OSI_LAYER_LABELS, OSI_LAYER_ORDER } from "../../simulation/layerModel";
import type { OsiLayer } from "../../simulation/types";
import { log } from "../../lib/logger";

interface Question {
  device: NetworkDevice;
  correctLayer: OsiLayer;
  options: OsiLayer[];
}

function buildQuestion(devices: NetworkDevice[]): Question {
  const device = devices[Math.floor(Math.random() * devices.length)];
  const correctLayer = [...device.osiLayers].sort()[0];
  const distractors = OSI_LAYER_ORDER.filter((layer) => !device.osiLayers.includes(layer))
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const options = [correctLayer, ...distractors].sort(() => Math.random() - 0.5);
  return { device, correctLayer, options };
}

export function DeviceLayerMatchQuiz() {
  const [devices, setDevices] = useState<NetworkDevice[]>([]);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<OsiLayer | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    fetchNetworkDevices().then((data) => {
      setDevices(data);
      setQuestion(buildQuestion(data));
    });
  }, []);

  if (!question) return null;

  const handleAnswer = (layer: OsiLayer) => {
    if (selected) return;
    log("quiz", `DeviceLayerMatchQuiz: ${layer === question.correctLayer ? "poprawna" : "błędna"} odpowiedź (${layer})`);
    setSelected(layer);
    setScore((s) => ({ correct: s.correct + (layer === question.correctLayer ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => {
    setSelected(null);
    setQuestion(buildQuestion(devices));
  };

  return (
    <div className="quiz">
      <h4>Quiz: dopasuj urządzenie do warstwy OSI</h4>
      <p>
        Na której warstwie OSI działa: <strong>{question.device.name}</strong>?
      </p>
      <div className="quiz-options">
        {question.options.map((layer) => {
          const isSelected = selected === layer;
          const isCorrect = layer === question.correctLayer;
          const className = selected ? (isCorrect ? "correct" : isSelected ? "incorrect" : "") : "";
          return (
            <button key={layer} className={className} onClick={() => handleAnswer(layer)} disabled={!!selected}>
              {OSI_LAYER_LABELS[layer]}
            </button>
          );
        })}
      </div>
      {selected && (
        <div className="quiz-feedback">
          <p>
            {selected === question.correctLayer
              ? "Poprawnie!"
              : `Niepoprawnie — poprawna odpowiedź to ${OSI_LAYER_LABELS[question.correctLayer]}.`}
          </p>
          <button onClick={next}>Następne pytanie</button>
        </div>
      )}
      <p className="quiz-score">
        Wynik: {score.correct} / {score.total}
      </p>
    </div>
  );
}
