import { useEffect, useState } from "react";
import { fetchEncryptionTypes } from "../api";
import type { EncryptionType } from "../types";

function SymmetricDiagram() {
  return (
    <svg viewBox="0 0 240 100" width="240" height="100">
      <circle cx={30} cy={50} r={16} fill="#2c3e50" />
      <text x={30} y={54} textAnchor="middle" fontSize="9" fill="#fff">A</text>
      <circle cx={210} cy={50} r={16} fill="#2c3e50" />
      <text x={210} y={54} textAnchor="middle" fontSize="9" fill="#fff">B</text>
      <text x={120} y={30} textAnchor="middle" fontSize="20">🔑</text>
      <text x={120} y={50} textAnchor="middle" fontSize="10">Ten sam klucz</text>
      <line x1={46} y1={50} x2={194} y2={50} stroke="#95a5a6" strokeWidth={2} strokeDasharray="4 4" />
    </svg>
  );
}

function AsymmetricDiagram() {
  return (
    <svg viewBox="0 0 240 100" width="240" height="100">
      <circle cx={30} cy={50} r={16} fill="#2c3e50" />
      <text x={30} y={54} textAnchor="middle" fontSize="9" fill="#fff">A</text>
      <circle cx={210} cy={50} r={16} fill="#2c3e50" />
      <text x={210} y={54} textAnchor="middle" fontSize="9" fill="#fff">B</text>
      <text x={90} y={30} textAnchor="middle" fontSize="18">🔓</text>
      <text x={90} y={50} textAnchor="middle" fontSize="9">Klucz publiczny B</text>
      <text x={150} y={30} textAnchor="middle" fontSize="18">🔒</text>
      <text x={150} y={50} textAnchor="middle" fontSize="9">Klucz prywatny B</text>
      <line x1={46} y1={50} x2={194} y2={50} stroke="#95a5a6" strokeWidth={2} strokeDasharray="4 4" />
    </svg>
  );
}

export function SymmetricVsAsymmetricView() {
  const [types, setTypes] = useState<EncryptionType[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    fetchEncryptionTypes().then((data) => {
      setTypes(data);
      setSelectedId(data[0]?.id ?? "");
    });
  }, []);

  const selected = types.find((t) => t.id === selectedId);

  return (
    <div className="symmetric-vs-asymmetric-view">
      <div className="mode-toggle">
        {types.map((type) => (
          <button key={type.id} className={type.id === selectedId ? "active" : ""} onClick={() => setSelectedId(type.id)}>
            {type.name}
          </button>
        ))}
      </div>
      {selected && (
        <>
          <p>
            <strong>{selected.keyModel}:</strong> {selected.description}
          </p>
          {selected.id === "symmetric" ? <SymmetricDiagram /> : <AsymmetricDiagram />}
          <p className="encryption-example">Przykład: {selected.example}</p>
        </>
      )}
    </div>
  );
}
