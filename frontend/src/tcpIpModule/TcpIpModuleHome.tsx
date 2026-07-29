import { useEffect, useState } from "react";
import { fetchTcpIpLayers } from "./api";
import type { TcpIpLayerInfo } from "./types";
import { TopologyDiagram } from "../physicalDataLink/components/TopologyDiagram";
import { ArpExchangeView } from "../physicalDataLink/components/ArpExchangeView";
import { SwitchMacTable } from "../physicalDataLink/components/SwitchMacTable";
import { SubnetCalculatorWidget } from "../networkLayer/components/SubnetCalculatorWidget";
import { RoutingSimulationSection } from "../networkLayer/components/RoutingSimulationSection";
import { NatTranslationView } from "../networkLayer/components/NatTranslationView";
import { ComparisonView } from "../transportLayer/components/ComparisonView";
import { TcpIpApplicationLayerView } from "./components/TcpIpApplicationLayerView";
import { TcpIpRouterConfigDetective } from "./components/TcpIpRouterConfigDetective";
import { OsiToTcpIpMatchQuiz } from "./components/OsiToTcpIpMatchQuiz";
import { WhyOneLayerQuiz } from "./components/WhyOneLayerQuiz";
import type { TcpIpLayer } from "../simulation/types";

function useLayerDescription(layers: TcpIpLayerInfo[], layer: TcpIpLayer): TcpIpLayerInfo | undefined {
  return layers.find((info) => info.layer === layer);
}

export function TcpIpModuleHome() {
  const [layers, setLayers] = useState<TcpIpLayerInfo[]>([]);

  useEffect(() => {
    fetchTcpIpLayers().then(setLayers);
  }, []);

  const networkAccess = useLayerDescription(layers, "NETWORK_ACCESS");
  const internet = useLayerDescription(layers, "INTERNET");
  const transport = useLayerDescription(layers, "TRANSPORT");
  const application = useLayerDescription(layers, "APPLICATION");

  return (
    <div className="fundamentals-page tcpip-module-home">
      <section>
        <h2>Model TCP/IP: 4 warstwy zamiast 7</h2>
        <p>
          Model TCP/IP grupuje te same mechanizmy sieciowe co OSI, ale w czterech, a nie siedmiu warstwach.
          Poniżej te same symulacje i widoki, które poznałeś/aś w modelu OSI — pogrupowane inaczej, zgodnie
          z podziałem TCP/IP.
        </p>
      </section>

      <section>
        <h2>1. Warstwa dostępu do sieci</h2>
        {networkAccess && <p className="layer-description">{networkAccess.description}</p>}
        <TopologyDiagram />
        <ArpExchangeView />
        <SwitchMacTable />
      </section>

      <section>
        <h2>2. Warstwa internetowa</h2>
        {internet && <p className="layer-description">{internet.description}</p>}
        <SubnetCalculatorWidget />
        <RoutingSimulationSection />
        <NatTranslationView />
        <TcpIpRouterConfigDetective />
      </section>

      <section>
        <h2>3. Warstwa transportowa</h2>
        {transport && <p className="layer-description">{transport.description}</p>}
        <ComparisonView />
      </section>

      <section>
        <h2>4. Warstwa aplikacji</h2>
        {application && <p className="layer-description">{application.description}</p>}
        <TcpIpApplicationLayerView />
      </section>

      <section className="quizzes">
        <OsiToTcpIpMatchQuiz />
        <WhyOneLayerQuiz />
      </section>
    </div>
  );
}
