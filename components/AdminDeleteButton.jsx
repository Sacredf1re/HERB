"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDeleteButton({ url, confirmText = "Delete this?" }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!window.confirm(confirmText)) return;
    setBusy(true);
    const res = await fetch(url, { method: "DELETE" });
    setBusy(false);
    if (res.ok) router.refresh();
  }

  return (
    <button onClick={handleDelete} disabled={busy} className="text-clay-dark hover:underline text-sm">
      {busy ? "Deleting…" : "Delete"}
    </button>
  );
}
