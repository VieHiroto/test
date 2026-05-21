"use client";

import { useMemo, useState } from "react";
import { parseTasks } from "@/lib/taskParser";
import { organizeTasks } from "@/lib/taskClassifier";
import { proposalToICS } from "@/lib/ics";

const sample = `見積書作成、今週中、最終納期は金曜17時、2時間\nLP修正、いつでも、最終納期は来週火曜、3時間くらい\n請求書送付、今日中、最終納期は明日午前中、15分\n山田さんの件、また確認\nデスク整理、いつでも、30分`;

export default function HomePage() {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState("");

  const organized = useMemo(() => organizeTasks(parseTasks(submitted)), [submitted]);

  const grouped = useMemo(() => ({
    today: organized.filter((x) => x.category === "today"),
    this_week: organized.filter((x) => x.category === "this_week"),
    anytime: organized.filter((x) => x.category === "anytime"),
    pending: organized.filter((x) => x.category === "pending"),
  }), [organized]);

  return <main className="container">
    <h1>朝のタスク整理アシスタント（MVP）</h1>
    <div className="card">
      <h2>入力欄</h2>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="1行1タスクで入力" />
      <div style={{marginTop:12}}>
        <button onClick={() => setInput(sample)}>サンプル入力</button>
        <button onClick={() => setSubmitted(input)}>解析する</button>
      </div>
    </div>
    <h2>分類結果</h2>
    <div className="grid">
      {Object.entries(grouped).map(([k, items]) => <div className="card" key={k}><h3>{k}</h3>{items.map((x)=><div key={x.task.id}><strong>{x.task.title}</strong><br/><small>{x.reason}</small></div>)}</div>)}
    </div>
    <h2>カレンダー登録案</h2>
    {organized.filter(x=>x.scheduleProposal).map((x) => {
      const p = x.scheduleProposal!;
      const ics = proposalToICS(p);
      return <div className="card" key={p.sourceTaskId}><strong>{p.title}</strong><div>{p.startDateTime} - {p.endDateTime} ({p.durationMinutes}分)</div><details><summary>ICS</summary><pre>{ics}</pre></details></div>;
    })}
  </main>;
}
