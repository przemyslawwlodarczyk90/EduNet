import { DnsResolutionView } from "./components/DnsResolutionView";
import { DomainNameAnatomyView } from "./components/DomainNameAnatomyView";
import { DnsZoneEditor } from "./components/DnsZoneEditor";
import { DnsRecordMatchQuiz } from "./components/DnsRecordMatchQuiz";
import { DhcpDoraView } from "./components/DhcpDoraView";
import { DhcpOrderQuiz } from "./components/DhcpOrderQuiz";
import { HttpExchangeView } from "./components/HttpExchangeView";
import { HttpVersionComparisonView } from "./components/HttpVersionComparisonView";
import { HttpEvolutionTimeline } from "./components/HttpEvolutionTimeline";
import { HttpVersionMatchQuiz } from "./components/HttpVersionMatchQuiz";
import { DualChannelView } from "./components/DualChannelView";
import { SmtpTransactionView } from "./components/SmtpTransactionView";
import { MailProtocolComparisonView } from "./components/MailProtocolComparisonView";
import { ConceptTopicView } from "./components/ConceptTopicView";
import { ProtocolPortQuiz } from "./components/ProtocolPortQuiz";
import { EncryptionComparisonView } from "../sessionPresentationLayer/components/EncryptionComparisonView";

export function ApplicationLayerPage() {
  return (
    <div className="fundamentals-page">
      <section>
        <h2>DNS: anatomia nazwy domeny</h2>
        <DomainNameAnatomyView />
      </section>

      <section>
        <h2>DNS: rozwiązywanie nazwy krok po kroku</h2>
        <DnsResolutionView />
      </section>

      <section>
        <h2>DNS: edytor strefy</h2>
        <DnsZoneEditor />
      </section>

      <section>
        <h2>DHCP: Discover, Offer, Request, Acknowledge</h2>
        <DhcpDoraView />
      </section>

      <section>
        <h2>HTTP: żądanie i odpowiedź</h2>
        <HttpExchangeView />
      </section>

      <section>
        <h2>Wszystkie wersje HTTP — porównanie</h2>
        <HttpVersionComparisonView />
      </section>

      <section>
        <h2>Ewolucja HTTP</h2>
        <HttpEvolutionTimeline />
      </section>

      <section>
        <h2>FTP: kanał kontrolny i kanał danych</h2>
        <DualChannelView />
      </section>

      <section>
        <h2>SMTP: wysyłka wiadomości e-mail</h2>
        <SmtpTransactionView />
      </section>

      <section>
        <h2>POP3 vs IMAP</h2>
        <MailProtocolComparisonView />
      </section>

      <section>
        <h2>Telnet vs SSH (reużycie z warstwy prezentacji)</h2>
        <EncryptionComparisonView />
      </section>

      <section>
        <h2>SNMP</h2>
        <ConceptTopicView topicId="snmp" />
      </section>

      <section>
        <h2>NTP</h2>
        <ConceptTopicView topicId="ntp" />
      </section>

      <section>
        <h2>WebSocket a HTTP</h2>
        <ConceptTopicView topicId="websocket-vs-http" />
      </section>

      <section>
        <h2>VoIP i SIP</h2>
        <ConceptTopicView topicId="voip-sip" />
      </section>

      <section className="quizzes">
        <DnsRecordMatchQuiz />
        <DhcpOrderQuiz />
      </section>

      <section className="quizzes">
        <HttpVersionMatchQuiz />
        <ProtocolPortQuiz />
      </section>
    </div>
  );
}
