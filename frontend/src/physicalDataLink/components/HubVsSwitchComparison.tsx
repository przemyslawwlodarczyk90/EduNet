import { DeviceBehaviorAnimation } from "../../fundamentals/components/DeviceBehaviorAnimation";

export function HubVsSwitchComparison() {
  return (
    <div className="hub-vs-switch-comparison">
      <div className="hub-vs-switch-column">
        <h4>Hub</h4>
        <p>Otrzymaną ramkę powiela na wszystkie porty, niezależnie od adresata.</p>
        <DeviceBehaviorAnimation behavior="REPEAT_SIGNAL" />
      </div>
      <div className="hub-vs-switch-column">
        <h4>Switch</h4>
        <p>Sprawdza tablicę adresów MAC i wysyła ramkę tylko do właściwego portu.</p>
        <DeviceBehaviorAnimation behavior="SELECTIVE_FORWARD" />
      </div>
    </div>
  );
}
