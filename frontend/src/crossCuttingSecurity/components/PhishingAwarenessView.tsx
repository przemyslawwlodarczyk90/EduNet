import { useEffect, useState } from "react";
import { fetchPhishingExample } from "../api";
import type { PhishingExample } from "../types";

export function PhishingAwarenessView() {
  const [example, setExample] = useState<PhishingExample | null>(null);

  useEffect(() => {
    fetchPhishingExample().then(setExample);
  }, []);

  if (!example) return null;

  return (
    <div className="phishing-awareness-view">
      <p className="phishing-disclaimer">
        Poniżej statyczny, w pełni fikcyjny przykład (bez działających linków) ilustrujący typowe cechy wiadomości
        phishingowej. Żaden adres, domena ani instytucja nie są prawdziwe.
      </p>
      <div className="phishing-email-preview">
        <dl>
          <dt>Od:</dt>
          <dd>
            {example.senderDisplayName} &lt;no-reply@{example.senderEmailDomain}&gt;
          </dd>
          <dt>Temat:</dt>
          <dd>{example.subject}</dd>
        </dl>
        <pre className="phishing-email-body">{example.body}</pre>
      </div>
      <h4>Rozpoznane cechy ostrzegawcze</h4>
      <ul className="phishing-red-flags">
        {example.redFlags.map((flag) => (
          <li key={flag.label}>
            <strong>{flag.label}:</strong> <span className="phishing-excerpt">{flag.excerpt}</span>
            <p>{flag.explanation}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
