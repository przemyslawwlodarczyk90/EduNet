import { RealSocketLabView } from "./components/RealSocketLabView";

export function RealSocketLabPage() {
  return (
    <div className="fundamentals-page real-socket-lab-page">
      <section>
        <h2>Real-socket-lab: prawdziwe usługi sieciowe w kontenerach (opcjonalnie)</h2>
        <p>
          W przeciwieństwie do wszystkich poprzednich modułów (czysta symulacja), ta sekcja uruchamia
          NAPRAWDĘ działający serwer Telnet, FTP lub SMTP w osobnym, izolowanym kontenerze Docker — i łączy
          Cię z nim przez wbudowany terminal. Możesz wpisywać prawdziwe polecenia protokołu i widzieć
          prawdziwe odpowiedzi serwera.
        </p>
        <p>
          <strong>Bezpieczeństwo:</strong> każdy kontener laboratorium działa w sieci Docker bez dostępu do
          internetu (potwierdzone: kontener nie jest w stanie nawiązać żadnego połączenia wychodzącego poza
          swoją izolowaną sieć), z limitem pamięci/CPU i automatycznie kończy się po 5 minutach. Kliknij
          "Zakończ sesję" albo po prostu zamknij tę stronę — kontener i tak zostanie posprzątany.
        </p>
        <RealSocketLabView />
      </section>
    </div>
  );
}
