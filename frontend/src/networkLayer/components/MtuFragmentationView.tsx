export function MtuFragmentationView() {
  return (
    <div className="mtu-fragmentation-view">
      <p>
        Każde łącze ma maksymalny rozmiar jednostki danych, jaką może przenieść jednorazowo — <strong>MTU</strong> (Maximum
        Transmission Unit), zwykle 1500 bajtów dla Ethernetu.
      </p>
      <div className="mtu-diagram">
        <div className="mtu-packet-large">Pakiet 1500 B</div>
        <div className="mtu-arrow">→</div>
        <div className="mtu-link-small">Łącze MTU 1400 B</div>
        <div className="mtu-arrow">→</div>
        <div className="mtu-fragments">
          <div className="mtu-fragment">Fragment 1</div>
          <div className="mtu-fragment">Fragment 2</div>
        </div>
      </div>
      <p>
        Gdy pakiet jest większy niż MTU łącza, router dzieli go na mniejsze fragmenty, które odbiorca składa z powrotem
        w całość.
      </p>
    </div>
  );
}
