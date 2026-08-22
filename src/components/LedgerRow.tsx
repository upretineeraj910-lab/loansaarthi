import React from "react";

export default function LedgerRow({
  label,
  value,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div className="ledger-row">
      <span className="label">{label}</span>
      <span className="dash" />
      <span className="value">{value}</span>
    </div>
  );
}
