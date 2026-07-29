const EXAMPLE = "www.przyklad.com";

export function DomainNameAnatomyView() {
  return (
    <div className="domain-name-anatomy-view">
      <div className="domain-name-parts">
        <span className="domain-part domain-part-sub">www</span>
        <span className="domain-part-dot">.</span>
        <span className="domain-part domain-part-domain">przyklad</span>
        <span className="domain-part-dot">.</span>
        <span className="domain-part domain-part-tld">com</span>
      </div>
      <div className="domain-name-legend">
        <p>
          <span className="legend-swatch domain-part-sub" /> <strong>Subdomena</strong> ({EXAMPLE.split(".")[0]}) — konkretna
          usługa lub serwer w ramach domeny.
        </p>
        <p>
          <span className="legend-swatch domain-part-domain" /> <strong>Domena drugiego poziomu</strong> — nazwa
          zarejestrowana przez właściciela.
        </p>
        <p>
          <span className="legend-swatch domain-part-tld" /> <strong>TLD (domena najwyższego poziomu)</strong> — np. .com,
          .pl, .org.
        </p>
      </div>
    </div>
  );
}
