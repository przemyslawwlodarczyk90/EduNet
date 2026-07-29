import { DetectiveCaseMode, type DetectiveCase } from "../../networkLayer/components/NetworkDetectiveMode";

const ROUTER_ADMIN_CASES: DetectiveCase[] = [
  {
    hostA: { ip: "192.168.10.1", mask: "255.255.255.0" },
    hostB: { ip: "192.168.10.130", mask: "255.255.255.128" },
    symptom:
      "Jesteś administratorem konfigurującym router. Interfejs LAN routera ma adres 192.168.10.1/24, ale jeden z komputerów w biurze (192.168.10.130/25) nie może się z nim skomunikować.",
    options: [
      "Router ma uszkodzony port fizyczny",
      "Komputer ma skonfigurowaną inną maskę podsieci (/25) niż router (/24), więc widzi router jako spoza swojej sieci",
      "Adres IP komputera jest adresem rozgłoszeniowym",
      "Router i komputer mają identyczny adres IP",
    ],
    correctIndex: 1,
    explanation:
      "Niespójna maska podsieci na jednym z hostów to klasyczny błąd konfiguracji — komputer z maską /25 dzieli sieć na dwie połowy i nie uznaje routera (.1) za lokalnego sąsiada.",
  },
  {
    hostA: { ip: "10.10.0.1", mask: "255.255.255.0" },
    hostB: { ip: "10.10.1.5", mask: "255.255.255.0" },
    symptom:
      "Konfigurujesz nowy router brzegowy z interfejsem LAN 10.10.0.1/24. Dział księgowości w innym skrzydle budynku (10.10.1.5/24) zgłasza brak dostępu do serwera podłączonego do tego routera.",
    options: [
      "Dział księgowości jest w zupełnie innej sieci (10.10.1.0/24) niż interfejs routera (10.10.0.0/24) — potrzebny jest wpis routingu między tymi sieciami",
      "Trzeba zmienić maskę podsieci na routerze",
      "Adres 10.10.0.1 jest nieprawidłowym adresem prywatnym",
      "Serwer ma uszkodzoną kartę sieciową",
    ],
    correctIndex: 0,
    explanation:
      "To dwie odrębne podsieci — bez odpowiedniego wpisu w tabeli routingu (lub trasy domyślnej) ruch między nimi nie przejdzie, niezależnie od tego, że oba interfejsy mają maskę /24.",
  },
];

export function TcpIpRouterConfigDetective() {
  return (
    <DetectiveCaseMode
      title="Tryb detektywa: jesteś administratorem konfigurującym router"
      hostALabel="Interfejs routera"
      hostBLabel="Host w sieci"
      cases={ROUTER_ADMIN_CASES}
    />
  );
}
