import { useEffect, useState } from "react";
import { addDnsRecord, fetchDnsZone, queryDnsZone, removeDnsRecord } from "../api";
import type { DnsRecord, DnsRecordType, DnsZoneQueryResult } from "../types";

const RECORD_TYPES: DnsRecordType[] = ["A", "AAAA", "CNAME", "MX", "TXT"];

export function DnsZoneEditor() {
  const [records, setRecords] = useState<DnsRecord[]>([]);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<DnsRecordType>("A");
  const [newValue, setNewValue] = useState("");

  const [queryName, setQueryName] = useState("przyklad.com");
  const [queryType, setQueryType] = useState<DnsRecordType>("A");
  const [queryResult, setQueryResult] = useState<DnsZoneQueryResult | null>(null);

  const reloadZone = () => fetchDnsZone().then(setRecords);

  useEffect(() => {
    reloadZone();
  }, []);

  const handleAdd = async () => {
    if (!newName || !newValue) return;
    await addDnsRecord({ name: newName, type: newType, value: newValue });
    setNewName("");
    setNewValue("");
    reloadZone();
  };

  const handleRemove = async (name: string, type: DnsRecordType) => {
    await removeDnsRecord(name, type);
    reloadZone();
  };

  const handleQuery = async () => {
    const result = await queryDnsZone(queryName, queryType);
    setQueryResult(result);
  };

  return (
    <div className="dns-zone-editor">
      <table className="headers-table">
        <thead>
          <tr>
            <th>Nazwa</th>
            <th>Typ</th>
            <th>Wartość</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={`${record.name}-${record.type}-${record.value}`}>
              <td>{record.name}</td>
              <td>{record.type}</td>
              <td>{record.value}</td>
              <td>
                <button onClick={() => handleRemove(record.name, record.type)}>Usuń</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="dns-zone-add-form">
        <input placeholder="nazwa (np. sub.przyklad.com)" value={newName} onChange={(e) => setNewName(e.target.value)} />
        <select aria-label="Typ nowego rekordu" value={newType} onChange={(e) => setNewType(e.target.value as DnsRecordType)}>
          {RECORD_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <input placeholder="wartość" value={newValue} onChange={(e) => setNewValue(e.target.value)} />
        <button onClick={handleAdd}>Dodaj rekord</button>
      </div>

      <div className="dns-zone-query-form">
        <h4>Wypróbuj zapytanie</h4>
        <input aria-label="Nazwa domeny do zapytania" value={queryName} onChange={(e) => setQueryName(e.target.value)} />
        <select aria-label="Typ rekordu do zapytania" value={queryType} onChange={(e) => setQueryType(e.target.value as DnsRecordType)}>
          {RECORD_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button onClick={handleQuery}>Zapytaj</button>
        {queryResult && (
          <p>
            {queryResult.found
              ? `${queryResult.name} ${queryResult.type} → ${queryResult.values.join(", ")}`
              : `Brak rekordu ${queryResult.type} dla ${queryResult.name}`}
          </p>
        )}
      </div>
    </div>
  );
}
