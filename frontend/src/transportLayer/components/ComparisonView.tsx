const FACTS: { aspect: string; tcp: string; udp: string }[] = [
  { aspect: "Połączenie", tcp: "połączeniowy (handshake przed transmisją)", udp: "bezpołączeniowy" },
  { aspect: "Niezawodność", tcp: "gwarantowane dostarczenie, retransmisje", udp: "brak gwarancji — dane mogą zginąć" },
  { aspect: "Kolejność", tcp: "zachowana kolejność segmentów", udp: "brak gwarancji kolejności" },
  { aspect: "Narzut", tcp: "większy (nagłówki, potwierdzenia, kontrola przepływu)", udp: "minimalny narzut" },
  { aspect: "Typowe zastosowanie", tcp: "strony WWW, e-mail, transfer plików", udp: "streaming, gry online, DNS" },
];

export function ComparisonView() {
  return (
    <div className="comparison-view">
      <table className="headers-table">
        <thead>
          <tr>
            <th />
            <th>TCP</th>
            <th>UDP</th>
          </tr>
        </thead>
        <tbody>
          {FACTS.map((fact) => (
            <tr key={fact.aspect}>
              <td>{fact.aspect}</td>
              <td>{fact.tcp}</td>
              <td>{fact.udp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
