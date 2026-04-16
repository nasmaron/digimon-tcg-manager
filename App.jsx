import { useState, useEffect, useRef } from "react";

const THEMES = {
  red: {
    label:"赤",
    bg:"#0f0a0a", card:"#1c1010", border:"#3d1a1a",
    accent:"#ff4d6d", accentDim:"#cc2244",
    win:"#00e676", lose:"#ff8800", draw:"#ffaa00",
    first:"#ffd700", second:"#a78bfa",
    text:"#ffe8e8", muted:"#996666", surface:"#1a0f0f",
  },
  blue: {
    label:"青",
    bg:"#0a0e1a", card:"#111827", border:"#1e2d4a",
    accent:"#00d4ff", accentDim:"#0099bb",
    win:"#00e676", lose:"#ff4444", draw:"#ffaa00",
    first:"#ffd700", second:"#a78bfa",
    text:"#e8f4ff", muted:"#6b8aaa", surface:"#161f30",
  },
  yellow: {
    label:"黄",
    bg:"#0f0e08", card:"#1c1a0e", border:"#3d3510",
    accent:"#facc15", accentDim:"#ca9a04",
    win:"#00e676", lose:"#ff4444", draw:"#fb923c",
    first:"#f97316", second:"#a78bfa",
    text:"#fffbe8", muted:"#998844", surface:"#1a180a",
  },
  green: {
    label:"緑",
    bg:"#080f0a", card:"#0f1c12", border:"#1a3d20",
    accent:"#00e676", accentDim:"#00b359",
    win:"#69ff47", lose:"#ff4444", draw:"#ffaa00",
    first:"#ffd700", second:"#a78bfa",
    text:"#e8ffe8", muted:"#5a8a6a", surface:"#0c1a0e",
  },
  black: {
    label:"黒",
    bg:"#080808", card:"#111111", border:"#2a2a2a",
    accent:"#aaaaaa", accentDim:"#777777",
    win:"#00e676", lose:"#ff4444", draw:"#ffaa00",
    first:"#ffd700", second:"#a78bfa",
    text:"#e0e0e0", muted:"#555555", surface:"#1a1a1a",
  },
  purple: {
    label:"紫",
    bg:"#0d0a18", card:"#160f2a", border:"#2e1a5a",
    accent:"#a78bfa", accentDim:"#7c55d4",
    win:"#00e676", lose:"#ff4444", draw:"#ffaa00",
    first:"#ffd700", second:"#f472b6",
    text:"#ede8ff", muted:"#7a6a99", surface:"#130e22",
  },
  white: {
    label:"白",
    bg:"#f0f4f8", card:"#ffffff", border:"#d1dce8",
    accent:"#0077cc", accentDim:"#005fa3",
    win:"#16a34a", lose:"#dc2626", draw:"#d97706",
    first:"#b45309", second:"#7c3aed",
    text:"#1e293b", muted:"#64748b", surface:"#e2eaf2",
  },
};

function getTheme(themeId) {
  return THEMES[themeId] || THEMES.blue;
}

// Global theme object — mutated by App on each render
const globalC = {...THEMES.blue};
const C = globalC;

const DECK_COLORS = [
  { id:"red",     label:"赤", hex:"#ef4444" },
  { id:"blue",    label:"青", hex:"#3b82f6" },
  { id:"green",   label:"緑", hex:"#22c55e" },
  { id:"yellow",  label:"黄", hex:"#eab308" },
  { id:"purple",  label:"紫", hex:"#a855f7" },
  { id:"black",   label:"黒", hex:"#6b7280" },
  { id:"white",   label:"白", hex:"#e5e7eb" },
  { id:"rainbow", label:"虹", hex:null },
];

const STORAGE_KEY = "digimon_tcg_v2";
const DEFAULT_MATCH_TYPES = ["テイマーバトル","エボリューションカップ","アルティメットカップ","超テイマーバトル","店舗予選","フリー"];

const FORM_FIELDS = [
  { key:"date",           label:"日付" },
  { key:"matchType",      label:"対戦種類" },
  { key:"deck",           label:"使用デッキ" },
  { key:"opponent",       label:"相手デッキ" },
  { key:"opponentPerson", label:"対戦相手" },
  { key:"turn",           label:"先攻後攻" },
  { key:"result",         label:"勝敗" },
  { key:"endTurn",        label:"終了ターン" },
  { key:"lucky",          label:"運・不運" },
  { key:"notes",          label:"メモ" },
  { key:"deckUrl",        label:"デッキURL" },
  { key:"deckImage",      label:"デッキ画像" },
  { key:"image",          label:"対戦画像" },
];
const BATTLE_FORM_FIELDS = [
  { key:"date",           label:"日付" },
  { key:"matchType",      label:"対戦種類" },
  { key:"deck",           label:"使用デッキ" },
  { key:"opponent",       label:"相手デッキ" },
  { key:"opponentPerson", label:"対戦相手" },
  { key:"turn",           label:"先攻後攻" },
  { key:"result",         label:"勝敗" },
  { key:"endTurn",        label:"終了ターン" },
  { key:"lucky",          label:"運・不運" },
  { key:"notes",          label:"メモ" },
  { key:"deckUrl",        label:"デッキURL" },
  { key:"deckImage",      label:"デッキ画像" },
  { key:"image",          label:"対戦画像" },
];

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      decks: d.decks || [],
      matches: d.matches || [],
      opponentNames: d.opponentNames || [],
      matchTypes: d.matchTypes || [...DEFAULT_MATCH_TYPES],
      prefs: d.prefs || {},
      theme: d.theme || 'blue',
      formFields: d.formFields || {},
      battleFormFields: d.battleFormFields || {},
      opponents: d.opponents || [],
    };
  } catch { return { decks:[], matches:[], opponentNames:[], matchTypes:[...DEFAULT_MATCH_TYPES], prefs:{}, theme:'blue', formFields:{}, battleFormFields:{}, opponents:[] }; }
}
function save(d) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch {} }
function serializeData(st) {
  const stripped = {
    ...st,
    decks: (st.decks||[]).map(d => { const r={...d}; delete r.image; return r; }),
    matches: (st.matches||[]).map(m => { const r={...m}; delete r.image; delete r.deckImage; return r; }),
  };
  return JSON.stringify(stripped);
}
function parseData(text) {
  const d = JSON.parse(text);
  if (d && d.matches && d.decks) return d;
  return null;
}

// ── helpers ──────────────────────────────────────────────
function firstHex(colors) {
  if (!colors?.length) return C.muted;
  if (colors.includes("rainbow")) return null;
  return DECK_COLORS.find(c => c.id === colors[0])?.hex || C.muted;
}

function DeckDot({ colors, size=12 }) {
  const s = { width:size, height:size, borderRadius:"50%", flexShrink:0 };
  if (!colors?.length) return <div style={{...s, background:C.muted}} />;
  if (colors.includes("rainbow")) return <div style={{...s, background:"linear-gradient(135deg,#ef4444,#eab308,#22c55e,#3b82f6,#a855f7)"}} />;
  if (colors.length===1) { const c=DECK_COLORS.find(x=>x.id===colors[0]); return <div style={{...s, background:c?.hex||C.muted, border:colors[0]==="white"?"1px solid #555":"none"}} />; }
  const hexes=colors.slice(0,4).reverse().map(id=>DECK_COLORS.find(c=>c.id===id)?.hex||C.muted);
  const step=360/hexes.length;
  return <div style={{...s, background:`conic-gradient(${hexes.map((h,i)=>`${h} ${i*step}deg ${(i+1)*step}deg`).join(",")})`}} />;
}

function WinBadge({result}) {
  const m={win:["勝",C.win],lose:["敗",C.lose],draw:["分",C.draw]};
  const [l,col]=m[result]||m.draw;
  return <span style={{background:col+"22",color:col,border:`1px solid ${col}55`,borderRadius:6,padding:"2px 10px",fontWeight:800,fontSize:12,fontFamily:"monospace"}}>{l}</span>;
}
function TurnBadge({turn}) {
  if (!turn) return null;
  const col=turn==="first"?C.first:C.second;
  return <span style={{background:col+"22",color:col,border:`1px solid ${col}55`,borderRadius:6,padding:"2px 7px",fontWeight:700,fontSize:11}}>{turn==="first"?"先攻":"後攻"}</span>;
}

// compact toggle row
function ToggleRow({ options, value, onChange, size="md" }) {
  const pad = size==="sm" ? "6px 0" : "8px 0";
  const fs  = size==="sm" ? 12 : 13;
  return (
    <div style={{display:"flex", gap:6}}>
      {options.map(([v,label,col])=>{
        const sel=value===v;
        const bc=col||(sel?C.accent:C.border);
        return (
          <button key={v} onClick={()=>onChange(sel?"":v)} style={{
            flex:1, padding:pad, borderRadius:8, border:`2px solid ${sel?bc:C.border}`,
            background:sel?bc+"22":"transparent", color:sel?bc:C.muted,
            fontWeight:sel?700:400, cursor:"pointer", fontSize:fs,
          }}>{label}</button>
        );
      })}
    </div>
  );
}

// compact chip picker (for match types)
function ChipPicker({ options, value, onChange, onAdd, onDelete }) {
  const [adding, setAdding] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState("");
  const handleAdd = () => {
    const t = draft.trim();
    if (!t || options.includes(t)) return;
    onAdd(t); onChange(t); setDraft(""); setAdding(false);
  };
  return (
    <div>
      <div style={{display:"flex", flexWrap:"wrap", gap:5, alignItems:"center"}}>
        {options.map(o=>{
          const sel = value === o;
          const isDef = DEFAULT_MATCH_TYPES.includes(o);
          if (editMode && !isDef) {
            // delete mode: show chip as plain label + standalone × button
            return (
              <div key={o} style={{display:"inline-flex",alignItems:"center",gap:3,
                border:`1.5px solid #ff6b6b44`,borderRadius:20,
                background:"#ff6b6b11",padding:"4px 6px 4px 10px"}}>
                <span style={{fontSize:12,color:C.muted}}>{o}</span>
                <button onClick={()=>{ if(onDelete){onDelete(o);} if(value===o) onChange(""); }}
                  style={{display:"flex",alignItems:"center",justifyContent:"center",
                    width:18,height:18,borderRadius:"50%",border:"none",
                    background:"#ff6b6b",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:900,padding:0,lineHeight:1}}>×</button>
              </div>
            );
          }
          return (
            <button key={o} onClick={()=>onChange(sel?"":o)} style={{
              padding:"4px 10px", borderRadius:20, fontSize:12, cursor:"pointer",
              border:`1.5px solid ${sel?C.accent:C.border}`,
              background:sel?C.accent+"22":"transparent",
              color:sel?C.accent:C.muted, fontWeight:sel?700:400,
            }}>{o}</button>
          );
        })}
        {onAdd && !adding && (
          <button onClick={()=>setAdding(true)} style={{padding:"4px 10px",borderRadius:20,fontSize:12,cursor:"pointer",border:`1.5px dashed ${C.border}`,background:"transparent",color:C.muted}}>＋</button>
        )}
        {onDelete && (
          <button onClick={()=>setEditMode(e=>!e)} style={{padding:"4px 10px",borderRadius:20,fontSize:12,cursor:"pointer",
            border:`1.5px dashed ${editMode?"#ff6b6b":C.border}`,
            background:editMode?"#ff6b6b22":"transparent",
            color:editMode?"#ff6b6b":C.muted}}>−</button>
        )}
      </div>
      {adding && (
        <div style={{display:"flex",gap:4,width:"100%",marginTop:8}}>
          <input value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAdd()}
            placeholder="種類名" autoFocus
            style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,color:C.text,padding:"5px 10px",fontSize:16,outline:"none"}} />
          <button onClick={handleAdd} style={{background:C.accent,color:"#000",border:"none",borderRadius:6,padding:"5px 12px",fontWeight:800,cursor:"pointer",fontSize:12}}>登録</button>
          <button onClick={()=>{setAdding(false);setDraft("");}} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:6,padding:"5px 10px",color:C.muted,cursor:"pointer",fontSize:12}}>✕</button>
        </div>
      )}
    </div>
  );
}

// Shared deck picker: list (chips) or free text input — used for both my deck and opponent
// names: array of {id, name} for list mode (uses id as value when useId=true, name otherwise)
// extras: additional name strings to show in list (past opponents etc.)
function DeckPicker({ value, onChange, names, placeholder="デッキ名", useId=false }) {
  const [mode, setMode] = useState(() => names.some(n=>(useId?n.id:n.name)===value) ? "list" : "text");
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(() => {
    if (!value) return "";
    if (useId) { const f=names.find(n=>n.id===value); return f?f.name:""; }
    return value;
  });
  const [focused, setFocused] = useState(false);
  const ref = useRef(null);

  const selectedName = useId
    ? (names.find(n=>n.id===value)?.name || "")
    : (value || "");

  const textSuggestions = text.trim().length > 0
    ? names.filter(n=>n.name.toLowerCase().includes(text.toLowerCase())&&n.name!==text)
    : [];

  const selectItem = item => {
    onChange(useId ? item.id : item.name);
    setText(item.name);
    setOpen(false);
    setFocused(false);
    ref.current?.blur();
  };

  return (
    <div style={{position:"relative"}}>
      {/* mode toggle */}
      <div style={{display:"flex",gap:5,marginBottom:7}}>
        {[["list","リストから"],["text","直接入力"]].map(([m,l])=>(
          <button key={m} onClick={()=>{setMode(m);setOpen(false);}} style={{
            flex:1, padding:"5px 0", borderRadius:6, fontSize:11, cursor:"pointer",
            border:`1.5px solid ${mode===m?C.accent:C.border}`,
            background:mode===m?C.accent+"22":"transparent",
            color:mode===m?C.accent:C.muted, fontWeight:mode===m?700:400,
          }}>{l}</button>
        ))}
      </div>

      {mode==="list" ? (
        <>
          {/* collapsed trigger — always 1 row */}
          <div onClick={()=>setOpen(o=>!o)} style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"8px 12px", borderRadius:8, cursor:"pointer",
            border:`1px solid ${open?C.accent:C.border}`,
            background:C.surface, minHeight:38,
          }}>
            <span style={{fontSize:15, color:selectedName?C.text:C.muted}}>
              {selectedName || placeholder}
            </span>
            <span style={{color:C.muted,fontSize:12,marginLeft:8}}>{open?"▲":"▼"}</span>
          </div>
          {/* dropdown list — absolute so it doesn't push layout */}
          {open && (
            <div style={{position:"absolute",top:"100%",left:0,right:0,background:C.card,border:`1px solid ${C.accent}`,borderRadius:8,zIndex:300,maxHeight:220,overflowY:"auto",marginTop:3,boxShadow:"0 8px 24px #000a"}}>
              {names.length===0 ? (
                <div style={{padding:"12px 14px",fontSize:13,color:C.muted}}>登録がありません</div>
              ) : names.map(n=>{
                const v=useId?n.id:n.name;
                const sel=value===v;
                return (
                  <div key={v} onMouseDown={()=>selectItem(n)} style={{
                    padding:"11px 14px", cursor:"pointer", fontSize:15,
                    color:sel?C.accent:C.text,
                    background:sel?C.accent+"18":"transparent",
                    borderBottom:`1px solid ${C.border}`,
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                  }}>
                    <span>{n.name}</span>
                    {sel&&<span style={{color:C.accent,fontSize:13,fontWeight:800}}>✓</span>}
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div style={{position:"relative"}}>
          <input
            ref={ref}
            value={text}
            onChange={e=>{setText(e.target.value);onChange(useId?"":e.target.value);setFocused(true);}}
            onFocus={()=>setFocused(true)}
            onBlur={()=>setTimeout(()=>setFocused(false),200)}
            placeholder={placeholder}
            style={{width:"100%",background:C.bg,border:`1px solid ${focused?C.accent:C.border}`,borderRadius:8,color:C.text,padding:"8px 12px",fontSize:16,outline:"none",boxSizing:"border-box",transition:"border-color 0.15s"}}
          />
          {focused && textSuggestions.length>0&&(
            <div style={{position:"absolute",top:"100%",left:0,right:0,background:C.card,border:`1px solid ${C.accent}`,borderRadius:8,zIndex:300,maxHeight:200,overflowY:"auto",boxShadow:"0 8px 24px #000a",marginTop:3}}>
              {textSuggestions.map(n=>(
                <div key={n.name}
                  onTouchStart={()=>selectItem(n)}
                  onMouseDown={()=>selectItem(n)}
                  style={{padding:"11px 14px",cursor:"pointer",fontSize:15,color:C.text,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span>{n.name}</span>
                  <span style={{fontSize:11,color:C.accent}}>選択</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Match type picker (dropdown list + add/delete) ──────
function MatchTypePicker({ value, onChange, matchTypes, onAdd, onDelete }) {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const handleAdd = () => {
    const t = draft.trim();
    if (!t || matchTypes.includes(t)) return;
    onAdd(t); onChange(t); setDraft(""); setAdding(false); setOpen(false);
  };

  return (
    <div style={{position:"relative"}}>
      {/* collapsed trigger */}
      <div onClick={()=>{setOpen(o=>!o); setAdding(false);}} style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"8px 12px", borderRadius:8, cursor:"pointer",
        border:`1px solid ${open?C.accent:C.border}`,
        background:C.surface, minHeight:38,
      }}>
        <span style={{fontSize:15, color:value?C.text:C.muted}}>{value||"選択してください"}</span>
        <span style={{color:C.muted,fontSize:12,marginLeft:8}}>{open?"▲":"▼"}</span>
      </div>

      {/* dropdown */}
      {open&&(
        <div style={{position:"absolute",top:"100%",left:0,right:0,background:C.card,border:`1px solid ${C.accent}`,borderRadius:8,zIndex:300,boxShadow:"0 8px 24px #000a",marginTop:3,overflow:"hidden"}}>
          {/* clear selection */}
          {value&&(
            <div onClick={()=>{onChange("");setOpen(false);}} style={{padding:"10px 14px",cursor:"pointer",fontSize:14,color:C.muted,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span>（なし）</span>
            </div>
          )}
          {/* options */}
          <div style={{maxHeight:200,overflowY:"auto"}}>
            {matchTypes.map(t=>{
              const sel=value===t;
              const isDef=DEFAULT_MATCH_TYPES.includes(t);
              return (
                <div key={t} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",cursor:"pointer",fontSize:14,color:sel?C.accent:C.text,background:sel?C.accent+"18":"transparent",borderBottom:`1px solid ${C.border}`}}>
                  <span style={{flex:1}} onClick={()=>{onChange(sel?"":t);setOpen(false);}}>{t}</span>
                  {sel&&<span style={{color:C.accent,fontWeight:800,fontSize:13,marginRight:8}}>✓</span>}
                  {!isDef&&(
                    <span onClick={e=>{e.stopPropagation();onDelete(t);if(value===t)onChange("");}} style={{color:"#ff6b6b",cursor:"pointer",fontSize:16,fontWeight:900,padding:"0 4px",lineHeight:1}}>×</span>
                  )}
                </div>
              );
            })}
          </div>
          {/* add new */}
          {!adding?(
            <div onClick={()=>setAdding(true)} style={{padding:"10px 14px",cursor:"pointer",fontSize:13,color:C.muted,borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:16}}>＋</span> 新しい種類を追加
            </div>
          ):(
            <div style={{padding:"8px 10px",borderTop:`1px solid ${C.border}`,display:"flex",gap:6}}>
              <input value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAdd()}
                placeholder="種類名" autoFocus
                style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,color:C.text,padding:"6px 10px",fontSize:16,outline:"none"}}/>
              <button onClick={handleAdd} style={{background:C.accent,color:"#000",border:"none",borderRadius:6,padding:"6px 12px",fontWeight:800,cursor:"pointer",fontSize:12}}>登録</button>
              <button onClick={()=>{setAdding(false);setDraft("");}} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:6,padding:"6px 10px",color:C.muted,cursor:"pointer",fontSize:12}}>✕</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── compact inline field row ─────────────────────────────
function Row({ label, children, fieldKey, battleMode, battleFormFields, onToggleBattleField }) {
  const minimized = fieldKey && (battleFormFields||{})[fieldKey] === false;
  if (fieldKey && onToggleBattleField) {
    if (minimized) {
      return (
        <div style={{display:"flex",alignItems:"center",paddingBottom:6,borderBottom:`1px solid ${C.border}`,opacity:0.45}}>
          <span style={{fontSize:10,color:C.muted,letterSpacing:0.3,flex:1}}>{label}</span>
          <span onClick={()=>onToggleBattleField(fieldKey)} style={{fontSize:13,cursor:"pointer",color:C.accent,padding:"2px 8px",lineHeight:1,fontWeight:700}}>＋</span>
        </div>
      );
    }
    return (
      <div style={{paddingBottom:10,borderBottom:`1px solid ${C.border}`}}>
        <div style={{display:"flex",alignItems:"center",marginBottom:6}}>
          <span style={{fontSize:11,color:C.muted,letterSpacing:0.3,flex:1}}>{label}</span>
          <span onClick={()=>onToggleBattleField(fieldKey)} style={{fontSize:13,cursor:"pointer",color:C.muted,padding:"2px 8px",lineHeight:1}}>－</span>
        </div>
        <div>{children}</div>
      </div>
    );
  }
  return (
    <div style={{display:"grid",gridTemplateColumns:"64px 1fr",gap:8,alignItems:"start",paddingBottom:10,borderBottom:`1px solid ${C.border}`}}>
      <span style={{fontSize:11,color:C.muted,paddingTop:8,letterSpacing:0.3}}>{label}</span>
      <div>{children}</div>
    </div>
  );
}

// ── Entry screen (full page, not modal) ──────────────────
function MatchEntry({ initial, onSave, onCancel, decks, opponentNames, opponents, matchTypes, onAddMatchType, onDeleteMatchType, isEdit, onDelete, formFields={}, carryOver, onToggleCarryOver, battleMode=false, battleCount=0, onToggleBattleMode, onToggleBattleField, onToggleField }) {
  const [form, setForm] = useState(initial);
  const set = patch => setForm(f=>({...f,...patch}));
  const show = key => formFields[key] !== false;
  const canSave = form.deckId && form.opponent.trim();


  const inputStyle = {
    background:C.bg, border:`1px solid ${C.border}`, borderRadius:8,
    color:C.text, padding:"8px 12px", fontSize:16, outline:"none",
    width:"100%", boxSizing:"border-box",
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"Noto Sans JP,Hiragino Sans,sans-serif",display:"flex",flexDirection:"column"}}>
      {/* header */}
      <div style={{background:battleMode?"linear-gradient(180deg,#1a0f00 0%,#120a00 100%)":`linear-gradient(180deg,#0d1525 0%,${C.bg} 100%)`,borderBottom:`1px solid ${battleMode?"#ff9800":C.border}`,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <button onClick={onCancel} style={{background:C.surface,border:`1px solid ${C.border}`,color:C.text,cursor:"pointer",fontSize:16,fontWeight:700,padding:"8px 16px",borderRadius:8}}>← 戻る</button>
        <div style={{textAlign:"center"}}>
          <div style={{fontWeight:800,fontSize:15}}>{isEdit?"対戦を編集":"対戦を記録"}</div>
          {battleMode&&<div style={{fontSize:11,color:"#ff9800",fontWeight:700}}>⚔️ 連戦モード · {battleCount+1}戦目</div>}
        </div>
        <button onClick={()=>canSave&&onSave(form)} style={{
          background:canSave?battleMode?"linear-gradient(135deg,#ff9800,#cc7000)":`linear-gradient(135deg,${C.accent},${C.accentDim})`:"#1e2d4a",
          color:canSave?"#000":C.muted, border:"none", borderRadius:8,
          padding:"7px 18px", fontWeight:800, fontSize:13, cursor:canSave?"pointer":"default",
        }}>保存</button>
      </div>

      {/* form body */}
      <div style={{flex:1,overflowY:"auto",padding:"12px 16px",maxWidth:600,margin:"0 auto",width:"100%",boxSizing:"border-box"}}>
        {!isEdit&&(
          <div>
            {!battleMode&&(
              <div onClick={()=>{
                const next = !carryOver;
                onToggleCarryOver(next);
                if (next) { setForm(initial); }
                else { setForm(f=>({...f, deckId:"", opponent:"", matchType:"", opponentPerson:""})); }
              }} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:10,marginBottom:8,cursor:"pointer",background:C.surface,border:`1px solid ${carryOver?C.accent:C.border}`}}>
                <div style={{width:20,height:20,borderRadius:4,border:`2px solid ${carryOver?C.accent:C.muted}`,background:carryOver?C.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {carryOver&&<span style={{color:"#000",fontSize:13,fontWeight:900}}>✓</span>}
                </div>
                <span style={{fontSize:13,color:carryOver?C.text:C.muted}}>前回の入力を引き継ぐ</span>
              </div>
            )}
            {!battleMode&&(
              <button onClick={onToggleBattleMode} style={{width:"100%",padding:"10px 0",borderRadius:10,border:"1.5px solid #ff9800",background:"transparent",color:"#ff9800",fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:10}}>⚔️ 連戦モードで記録する</button>
            )}
            {battleMode&&(
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                <div style={{flex:1,padding:"10px 14px",borderRadius:10,background:"#ff980022",border:"1.5px solid #ff9800",fontSize:13,fontWeight:700,color:"#ff9800",textAlign:"center"}}>⚔️ 連戦モード · {battleCount+1}戦目</div>
                <button onClick={onToggleBattleMode} style={{padding:"10px 14px",borderRadius:10,border:"1px solid #ff6666",background:"transparent",color:"#ff6666",fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>連戦終了</button>
              </div>
            )}
          </div>
        )}
        <div style={{display:"flex",flexDirection:"column",gap:0}}>

          <Row label="日付" fieldKey="date" battleMode={battleMode} battleFormFields={formFields} onToggleBattleField={battleMode?onToggleBattleField:onToggleField}>
            <input type="date" value={form.date} onChange={e=>set({date:e.target.value})} style={inputStyle} />
          </Row>

          {<Row label="対戦種類" fieldKey="matchType" battleMode={battleMode} battleFormFields={formFields} onToggleBattleField={battleMode?onToggleBattleField:onToggleField}>
            <MatchTypePicker value={form.matchType||""} onChange={v=>set({matchType:v})} matchTypes={matchTypes} onAdd={onAddMatchType} onDelete={onDeleteMatchType} />
          </Row>}

          <Row label="使用デッキ" fieldKey="deck" battleMode={battleMode} battleFormFields={formFields} onToggleBattleField={battleMode?onToggleBattleField:onToggleField}>
            <DeckPicker
              value={form.deckId}
              onChange={v=>set({deckId:v})}
              names={decks}
              placeholder="デッキ名を入力"
              useId={true}
            />
          </Row>

          <Row label="相手デッキ" fieldKey="opponent" battleMode={battleMode} battleFormFields={formFields} onToggleBattleField={battleMode?onToggleBattleField:onToggleField}>
            <DeckPicker
              value={form.opponent}
              onChange={v=>set({opponent:v})}
              names={Array.from(new Set([...decks.map(d=>d.name),...opponentNames])).sort().map(n=>({id:n,name:n}))}
              placeholder="相手のデッキ名"
              useId={false}
            />
          </Row>

          <Row label="対戦相手" fieldKey="opponentPerson" battleMode={battleMode} battleFormFields={formFields} onToggleBattleField={battleMode?onToggleBattleField:onToggleField}>
            <DeckPicker
              value={form.opponentPerson||""}
              onChange={v=>set({opponentPerson:v})}
              names={(opponents||[]).map(n=>({id:n,name:n}))}
              placeholder="対戦相手の名前"
              useId={false}
            />
          </Row>

          <Row label="先攻後攻" fieldKey="turn" battleMode={battleMode} battleFormFields={formFields} onToggleBattleField={battleMode?onToggleBattleField:onToggleField}>
            <ToggleRow options={[["first","⚡ 先攻",C.first],["second","🌙 後攻",C.second]]} value={form.turn} onChange={v=>set({turn:v})} />
          </Row>

          <Row label="勝敗" fieldKey="result" battleMode={battleMode} battleFormFields={formFields} onToggleBattleField={battleMode?onToggleBattleField:onToggleField}>
            <ToggleRow options={[["win","🏆 勝",C.win],["lose","💀 敗",C.lose],["draw","🤝 分",C.draw]]} value={form.result} onChange={v=>set({result:v||"win"})} />
          </Row>

          {<Row label="終了ターン" fieldKey="endTurn" battleMode={battleMode} battleFormFields={formFields} onToggleBattleField={battleMode?onToggleBattleField:onToggleField}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <button onClick={()=>set({endTurn: form.endTurn!=null ? Math.max(1, form.endTurn-1) : null})}
                disabled={!form.endTurn}
                style={{width:36,height:36,borderRadius:8,border:`1px solid ${C.border}`,background:form.endTurn?C.surface:"transparent",color:form.endTurn?C.text:C.border,fontSize:20,cursor:form.endTurn?"pointer":"default",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
              <span style={{fontSize:22,fontWeight:800,color:form.endTurn?C.text:C.muted,minWidth:32,textAlign:"center"}}>{form.endTurn??"-"}</span>
              <button onClick={()=>set({endTurn: form.endTurn!=null ? form.endTurn+1 : 1})}
                style={{width:36,height:36,borderRadius:8,border:`1px solid ${C.border}`,background:C.surface,color:C.text,fontSize:20,cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>＋</button>
              <span style={{fontSize:12,color:C.muted}}>ターン</span>
              {form.endTurn!=null&&<button onClick={()=>set({endTurn:null})} style={{marginLeft:4,background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:13,padding:"2px 4px"}}>✕</button>}
            </div>
          </Row>}

          {<Row label="運" fieldKey="lucky" battleMode={battleMode} battleFormFields={formFields} onToggleBattleField={battleMode?onToggleBattleField:onToggleField}>
            <div style={{display:"flex",gap:8}}>
              {[["lucky","🍀 運あり","#22c55e"],["unlucky","💀 不運あり","#f87171"]].map(([k,label,col])=>{
                const sel = form[k]||false;
                return (
                  <button key={k} onClick={()=>set({[k]:!sel})} style={{
                    flex:1, padding:"7px 0", borderRadius:8, fontSize:13, cursor:"pointer",
                    border:`2px solid ${sel?col:C.border}`,
                    background:sel?col+"22":"transparent",
                    color:sel?col:C.muted, fontWeight:sel?700:400,
                  }}>{label}</button>
                );
              })}
            </div>
          </Row>}

          {<Row label="メモ" fieldKey="notes" battleMode={battleMode} battleFormFields={formFields} onToggleBattleField={battleMode?onToggleBattleField:onToggleField}>
            <textarea value={form.notes} onChange={e=>set({notes:e.target.value})} placeholder="（任意）"
              style={{...inputStyle,resize:"vertical",minHeight:52}} />
          </Row>}

          {<Row label="デッキURL" fieldKey="deckUrl" battleMode={battleMode} battleFormFields={formFields} onToggleBattleField={battleMode?onToggleBattleField:onToggleField}>
            {!form.deckUrl&&decks.find(d=>d.id===form.deckId)?.url&&(
              <div style={{marginBottom:6,fontSize:12,color:C.muted,padding:"6px 8px",background:C.surface,borderRadius:6}}>
                登録済み: <span style={{color:C.accent}}>{decks.find(d=>d.id===form.deckId).url}</span>
              </div>
            )}
            <input placeholder="https://..." value={form.deckUrl||""} onChange={e=>set({deckUrl:e.target.value})} style={inputStyle}/>
            {form.deckUrl&&<div style={{marginTop:4,fontSize:11,color:C.muted}}>保存するとデッキのURLとしても登録されます</div>}
          </Row>}

          {<Row label="デッキ画像" fieldKey="deckImage" battleMode={battleMode} battleFormFields={formFields} onToggleBattleField={battleMode?onToggleBattleField:onToggleField}>
            {!form.deckImage&&decks.find(d=>d.id===form.deckId)?.image&&(
              <div style={{marginBottom:8,borderRadius:8,overflow:"hidden",border:`1px solid ${C.accent}44`,background:C.surface,padding:8,display:"flex",alignItems:"center",gap:8}}>
                <img src={decks.find(d=>d.id===form.deckId).image} alt="" style={{width:44,height:44,objectFit:"cover",borderRadius:6,flexShrink:0}}/>
                <span style={{fontSize:12,color:C.muted}}>デッキに登録済みの画像があります</span>
              </div>
            )}
            <div style={{fontSize:11,color:C.muted,marginBottom:6}}>保存するとデッキの画像としても登録されます</div>
            <label style={{display:"flex",alignItems:"center",justifyContent:"center",borderRadius:8,border:`1px dashed ${form.deckImage?C.accent:C.border}`,cursor:"pointer",overflow:"hidden",minHeight:60,background:C.surface}}>
              {form.deckImage
                ? <img src={form.deckImage} alt="" style={{width:"100%",maxHeight:160,objectFit:"contain"}}/>
                : <span style={{color:C.muted,fontSize:13,padding:16}}>📷 タップして新しいデッキ画像を設定</span>
              }
              <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
                const file=e.target.files[0]; if(!file) return;
                const reader=new FileReader();
                reader.onload=ev=>set({deckImage:ev.target.result});
                reader.readAsDataURL(file);
              }}/>
            </label>
            {form.deckImage&&<button onClick={()=>set({deckImage:""})} style={{marginTop:6,background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:12}}>✕ 画像を削除</button>}
          </Row>}

          {<Row label="対戦画像" fieldKey="image" battleMode={battleMode} battleFormFields={formFields} onToggleBattleField={battleMode?onToggleBattleField:onToggleField}>
            <label style={{display:"flex",alignItems:"center",justifyContent:"center",borderRadius:8,border:`1px dashed ${C.border}`,cursor:"pointer",overflow:"hidden",minHeight:60,background:C.surface}}>
              {form.image
                ? <img src={form.image} alt="" style={{width:"100%",maxHeight:160,objectFit:"contain"}}/>
                : <span style={{color:C.muted,fontSize:13,padding:16}}>📷 タップして画像を追加</span>
              }
              <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
                const file=e.target.files[0]; if(!file) return;
                const reader=new FileReader();
                reader.onload=ev=>set({image:ev.target.result});
                reader.readAsDataURL(file);
              }}/>
            </label>
            {form.image&&<button onClick={()=>set({image:""})} style={{marginTop:6,background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:12}}>✕ 画像を削除</button>}
          </Row>}

        </div>
        {isEdit&&(
          <div style={{padding:"0 16px 20px"}}>
            <button onClick={onDelete} style={{width:"100%",padding:"13px 0",borderRadius:10,border:"none",background:"#ff4444",color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer"}}>この記録を削除</button>
          </div>
        )}
      </div>
    </div>
  );
}


// ── Match Detail Modal ───────────────────────────────────
function MatchDetailModal({ match, deck, onClose, onEdit, formFields={} }) {
  const show = key => formFields[key] !== false;
  const hex = deck ? firstHex(deck.colors) : null;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div style={{position:"fixed",inset:0,background:"#000b",display:"flex",alignItems:"flex-end",zIndex:200,overflow:"hidden",touchAction:"none"}}>
      <div style={{background:C.card,borderRadius:"16px 16px 0 0",width:"100%",maxWidth:600,margin:"0 auto",maxHeight:"92vh",overflowY:"auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 18px",borderBottom:`1px solid ${C.border}`}}>
          <button onClick={onClose} style={{background:C.surface,border:`1px solid ${C.border}`,color:C.text,cursor:"pointer",fontSize:16,fontWeight:700,padding:"8px 16px",borderRadius:8}}>← 戻る</button>
          <span style={{fontWeight:800,fontSize:15}}>vs {match.opponent}</span>
          <button onClick={onEdit} style={{background:"transparent",border:`1px solid ${C.accent}`,color:C.accent,cursor:"pointer",fontSize:13,padding:"7px 14px",borderRadius:8,fontWeight:700}}>編集</button>
        </div>
        <div style={{padding:18,display:"flex",flexDirection:"column",gap:14}}>
          <div style={{background:C.surface,borderRadius:10,padding:14,display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
              <span style={{color:C.muted}}>日付</span>
              <span style={{color:C.text}}>{match.date}</span>
            </div>
            {show("matchType")&&match.matchType&&<div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
              <span style={{color:C.muted}}>対戦種類</span>
              <span style={{color:C.text}}>{match.matchType}</span>
            </div>}
            {deck&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:13}}>
              <span style={{color:C.muted}}>使用デッキ</span>
              <span style={{display:"flex",alignItems:"center",gap:5,color:hex||C.text,fontWeight:700}}><DeckDot colors={deck.colors} size={12}/>{deck.name}</span>
            </div>}
            {match.opponentPerson&&<div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
              <span style={{color:C.muted}}>対戦相手</span>
              <span style={{color:C.text,fontWeight:700}}>👤 {match.opponentPerson}</span>
            </div>}
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <WinBadge result={match.result}/>
              <TurnBadge turn={match.turn}/>
              {show("lucky")&&match.lucky&&<span style={{color:"#22c55e",background:"#22c55e18",border:"1px solid #22c55e44",borderRadius:6,padding:"3px 10px",fontSize:12}}>🍀 運あり</span>}
              {show("lucky")&&match.unlucky&&<span style={{color:"#f87171",background:"#f8717118",border:"1px solid #f8717144",borderRadius:6,padding:"3px 10px",fontSize:12}}>💀 不運あり</span>}
            </div>
            {show("endTurn")&&match.endTurn!=null&&<div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
              <span style={{color:C.muted}}>終了ターン</span>
              <span style={{color:C.text}}>{match.endTurn}ターン</span>
            </div>}
            {show("deckUrl")&&match.deckUrl&&<div style={{display:"flex",justifyContent:"space-between",fontSize:13,gap:8}}>
              <span style={{color:C.muted,flexShrink:0}}>デッキURL</span>
              <a href={match.deckUrl} target="_blank" rel="noreferrer" style={{color:C.accent,fontSize:12,wordBreak:"break-all",textAlign:"right"}}>{match.deckUrl}</a>
            </div>}
          </div>
          {show("notes")&&match.notes&&<div style={{background:C.surface,borderRadius:10,padding:14}}>
            <div style={{fontSize:11,color:C.muted,marginBottom:6}}>メモ</div>
            <div style={{fontSize:13,color:C.text,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{match.notes}</div>
          </div>}
          {show("deckImage")&&(match.deckImage||(deck&&deck.image))&&(
            <div>
              <div style={{fontSize:11,color:C.muted,marginBottom:6}}>使用デッキ画像</div>
              <img src={match.deckImage||(deck&&deck.image)} alt="" style={{width:"100%",borderRadius:10,objectFit:"contain",maxHeight:220,background:C.surface}}/>
            </div>
          )}
          {show("image")&&match.image&&(
            <div>
              <div style={{fontSize:11,color:C.muted,marginBottom:6}}>対戦画像</div>
              <img src={match.image} alt="" style={{width:"100%",borderRadius:10,objectFit:"contain",maxHeight:220,background:C.surface}}/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Stats card ───────────────────────────────────────────
function StatCard({label,value,color}) {
  return (
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 8px",textAlign:"center",flex:1}}>
      <div style={{fontSize:22,fontWeight:900,color:color||C.accent,fontFamily:"monospace"}}>{value}</div>
      <div style={{fontSize:11,color:C.muted,marginTop:3}}>{label}</div>
    </div>
  );
}

// ── Merge modal ──────────────────────────────────────────
function MergeModal({allNames, onMerge, onCancel, initialSelected=[]}) {
  const [selected,setSelected]=useState(initialSelected);
  const [newName,setNewName]=useState("");
  const toggle=n=>setSelected(s=>s.includes(n)?s.filter(x=>x!==n):[...s,n]);
  const canMerge=selected.length>=2&&newName.trim();
  const toggleBulkSelect = (id) => {
    setBulkSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const executeBulkDelete = () => {
    setSt(s => ({...s, matches: s.matches.filter(m => !bulkSelected.includes(m.id))}));
    setBulkMode(false);
    setBulkSelected([]);
  };
  const cancelBulkMode = () => { setBulkMode(false); setBulkSelected([]); };

  const doRestore = () => {
    const d = parseData(restoreText);
    if (d) { setSt(d); setBackupMode(null); setRestoreText(""); }
  };
  const inputStyle={background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,padding:"9px 12px",fontSize:16,outline:"none",width:"100%",boxSizing:"border-box"};
  return (
    <div style={{position:"fixed",inset:0,background:"#000b",display:"flex",alignItems:"flex-end",zIndex:100}}>
      <div style={{background:C.card,borderRadius:"16px 16px 0 0",padding:20,width:"100%",maxWidth:600,margin:"0 auto",maxHeight:"85vh",overflowY:"auto"}}>
        <div style={{fontWeight:800,fontSize:15,marginBottom:4}}>デッキ名をまとめる</div>
        <div style={{fontSize:12,color:C.muted,marginBottom:12}}>2つ以上選んで統一名を入力</div>
        <div style={{marginBottom:12,maxHeight:220,overflowY:"auto"}}>
          {allNames.map(n=>{
            const sel=selected.includes(n);
            return (
              <div key={n} onClick={()=>toggle(n)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:8,marginBottom:5,cursor:"pointer",border:`1px solid ${sel?C.accent:C.border}`,background:sel?C.accent+"11":C.surface}}>
                <div style={{width:17,height:17,borderRadius:4,border:`2px solid ${sel?C.accent:C.muted}`,background:sel?C.accent:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {sel&&<span style={{color:"#000",fontSize:11,fontWeight:900}}>✓</span>}
                </div>
                <span style={{fontSize:13,color:C.text}}>{n}</span>
              </div>
            );
          })}
        </div>
        {selected.length>=2&&<input placeholder="統一後の名前" value={newName} onChange={e=>setNewName(e.target.value)} style={{...inputStyle,marginBottom:10}} />}
        <div style={{display:"flex",gap:8}}>
          <button onClick={onCancel} style={{flex:1,padding:"10px 0",borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer",fontSize:13}}>キャンセル</button>
          <button onClick={()=>canMerge&&onMerge(selected,newName.trim())} style={{flex:2,padding:"10px 0",borderRadius:8,border:"none",background:canMerge?`linear-gradient(135deg,${C.accent},${C.accentDim})`:"#1e2d4a",color:canMerge?"#000":C.muted,fontWeight:800,cursor:canMerge?"pointer":"default",fontSize:13}}>まとめる</button>
        </div>
      </div>
    </div>
  );
}

// ── Color picker (deck registration) ────────────────────
function ColorPicker({colors,onChange}) {
  return (
    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
      {DECK_COLORS.map(c=>{
        const sel=colors.includes(c.id), isRainbow=c.id==="rainbow";
        const toggle=()=>{ if(isRainbow){onChange(sel?[]:["rainbow"]);}else{const w=colors.filter(x=>x!=="rainbow"&&x!==c.id);onChange(sel?w:[...w,c.id]);} };
        return (
          <button key={c.id} onClick={toggle} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:20,border:`2px solid ${sel?"#fff":C.border}`,background:sel?C.surface:"transparent",color:sel?C.text:C.muted,cursor:"pointer",fontSize:12,fontWeight:sel?700:400}}>
            {isRainbow?<div style={{width:11,height:11,borderRadius:"50%",background:"linear-gradient(135deg,#ef4444,#eab308,#22c55e,#3b82f6,#a855f7)",flexShrink:0}}/>:<div style={{width:11,height:11,borderRadius:"50%",background:c.hex,flexShrink:0,border:c.id==="white"?"1px solid #555":"none"}}/>}
            {c.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Opponent Deck List with inline rename ───────────────
function OpponentDeckList({ names, matches, showStats, onRename, inputStyle, checked=[], onToggleCheck }) {
  const [editingName, setEditingName] = useState(null);
  const [draft, setDraft] = useState("");

  const startEdit = (name) => { setEditingName(name); setDraft(name); };
  const cancelEdit = () => setEditingName(null);
  const saveEdit = (oldName) => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== oldName) onRename(oldName, trimmed);
    setEditingName(null);
  };

  return (
    <div>
      {names.map(name=>{
        const ms = matches.filter(m=>m.opponent===name);
        const w  = ms.filter(m=>m.result==="win").length;
        const l  = ms.filter(m=>m.result==="lose").length;
        const dr = ms.filter(m=>m.result==="draw").length;
        const t  = ms.length;
        const wr2 = t>0 ? Math.round(w/t*100) : 0;
        const isEditing = editingName === name;
        return (
          <div key={name} style={{background:C.card,border:`1.5px solid ${checked.includes(name)?C.accent:C.border}`,borderRadius:12,padding:14,marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
              {onToggleCheck&&(
                <div onClick={()=>onToggleCheck(name)} style={{width:20,height:20,borderRadius:4,border:`2px solid ${checked.includes(name)?C.accent:C.muted}`,background:checked.includes(name)?C.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer"}}>
                  {checked.includes(name)&&<span style={{color:"#000",fontSize:11,fontWeight:900}}>✓</span>}
                </div>
              )}
              {isEditing ? (
                <div style={{display:"flex",gap:6,flex:1}}>
                  <input
                    value={draft}
                    onChange={e=>setDraft(e.target.value)}
                    onKeyDown={e=>{ if(e.key==="Enter") saveEdit(name); if(e.key==="Escape") cancelEdit(); }}
                    autoFocus
                    style={{...inputStyle,flex:1,fontSize:16,padding:"6px 10px"}}
                  />
                  <button onClick={()=>saveEdit(name)} style={{background:C.accent,color:"#000",border:"none",borderRadius:6,padding:"6px 12px",fontWeight:800,cursor:"pointer",fontSize:12,whiteSpace:"nowrap"}}>保存</button>
                  <button onClick={cancelEdit} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:6,padding:"6px 10px",color:C.muted,cursor:"pointer",fontSize:12}}>✕</button>
                </div>
              ) : (
                <>
                  <span style={{fontWeight:800,fontSize:15,flex:1}}>{name}</span>
                  <button onClick={()=>startEdit(name)} style={{background:"transparent",border:"none",color:C.accent,cursor:"pointer",fontSize:14,padding:"2px 6px",flexShrink:0}}>✏️</button>
                  {showStats&&<span style={{fontWeight:900,color:wr2>=50?C.win:C.lose,fontSize:15,flexShrink:0}}>{wr2}%</span>}
                </>
              )}
            </div>
            {showStats&&t>0&&!isEditing&&(
              <div>
                <div style={{display:"flex",borderRadius:6,overflow:"hidden",height:10,marginTop:8}}>
                  {w>0&&<div style={{flex:w/t,background:C.win}}/>}
                  {dr>0&&<div style={{flex:dr/t,background:C.draw}}/>}
                  {l>0&&<div style={{flex:l/t,background:C.lose}}/>}
                </div>
                <div style={{display:"flex",gap:12,marginTop:5,fontSize:11,color:C.muted}}>
                  <span>{t}戦</span>
                  <span style={{color:C.win}}>{w}勝</span>
                  <span style={{color:C.lose}}>{l}敗</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Deck Detail Modal (local state, save on confirm) ────
function DeckDetailModal({ deck, deckStats, inputStyle, onClose, onSave, onDelete, allDecks=[] }) {
  const [form, setForm] = useState({
    name:     deck.name     || "",
    colors:   deck.colors   || [],
    url:      deck.url      || "",
    notes:    deck.notes    || "",
    image:    deck.image    || "",
    parentId: deck.parentId || "",
  });
  const set = patch => setForm(f=>({...f,...patch}));
  const ds = deckStats || {};

  return (
    <div style={{position:"fixed",inset:0,background:"#000b",display:"flex",alignItems:"flex-end",zIndex:200,overflow:"hidden",touchAction:"none"}}>
      <div style={{background:C.card,borderRadius:"16px 16px 0 0",width:"100%",maxWidth:600,margin:"0 auto",maxHeight:"92vh",overflowY:"auto"}}>
        {/* header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 18px",borderBottom:`1px solid ${C.border}`}}>
          <button onClick={onClose} style={{background:C.surface,border:`1px solid ${C.border}`,color:C.text,cursor:"pointer",fontSize:16,fontWeight:700,padding:"8px 16px",borderRadius:8}}>← 戻る</button>
          <span style={{fontWeight:800,fontSize:15}}>{deck.name}</span>
          <button onClick={()=>onSave(form)} style={{background:`linear-gradient(135deg,${C.accent},${C.accentDim})`,color:"#000",border:"none",borderRadius:8,padding:"8px 16px",fontWeight:800,fontSize:14,cursor:"pointer"}}>保存する</button>
        </div>
        <div style={{padding:18,display:"flex",flexDirection:"column",gap:14}}>
          {/* image */}
          <label style={{display:"flex",alignItems:"center",justifyContent:"center",borderRadius:12,border:`1px dashed ${C.border}`,overflow:"hidden",cursor:"pointer",textAlign:"center",minHeight:80}}>
            {form.image
              ? <img src={form.image} alt="" style={{width:"100%",maxHeight:200,objectFit:"contain"}}/>
              : <span style={{color:C.muted,fontSize:13,padding:20}}>📷 タップして画像を設定</span>
            }
            <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
              const file=e.target.files[0]; if(!file) return;
              const reader=new FileReader();
              reader.onload=ev=>set({image:ev.target.result});
              reader.readAsDataURL(file);
            }}/>
          </label>
          {/* name */}
          <div>
            <div style={{fontSize:11,color:C.muted,marginBottom:6}}>デッキ名</div>
            <input value={form.name} onChange={e=>set({name:e.target.value})} style={inputStyle}/>
          </div>
          {/* color */}
          <div>
            <div style={{fontSize:11,color:C.muted,marginBottom:6}}>カラー</div>
            <ColorPicker colors={form.colors} onChange={colors=>set({colors})}/>
          </div>
          {/* parent deck */}
          <div>
            <div style={{fontSize:11,color:C.muted,marginBottom:6}}>親デッキ（派生元）</div>
            <select value={form.parentId||""} onChange={e=>set({parentId:e.target.value})} style={{...inputStyle,fontSize:14}}>
              <option value="">なし</option>
              {allDecks.filter(d=>d.id!==deck.id).map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            {form.parentId&&<div style={{marginTop:4,fontSize:11,color:C.muted}}>→ {allDecks.find(d=>d.id===form.parentId)?.name}</div>}
          </div>
          {/* URL */}
          <div>
            <div style={{fontSize:11,color:C.muted,marginBottom:6}}>デッキURL（deck-log等）</div>
            <input placeholder="https://..." value={form.url} onChange={e=>set({url:e.target.value})} style={inputStyle}/>
            {form.url&&<a href={form.url} target="_blank" rel="noreferrer" style={{display:"block",marginTop:6,fontSize:12,color:C.accent,wordBreak:"break-all"}}>{form.url}</a>}
          </div>
          {/* notes */}
          <div>
            <div style={{fontSize:11,color:C.muted,marginBottom:6}}>メモ</div>
            <textarea value={form.notes} onChange={e=>set({notes:e.target.value})} placeholder="（任意）" style={{...inputStyle,resize:"vertical",minHeight:60}}/>
          </div>
          {/* stats */}
          <div style={{background:C.surface,borderRadius:10,padding:12}}>
            <div style={{fontSize:11,color:C.muted,marginBottom:8}}>成績</div>
            <div style={{display:"flex",gap:14,fontSize:13,color:C.muted}}>
              <span>対戦: <strong style={{color:C.text}}>{ds.total||0}</strong></span>
              <span>勝: <strong style={{color:C.win}}>{ds.wins||0}</strong></span>
              <span>負: <strong style={{color:C.lose}}>{ds.loses||0}</strong></span>
              <span>勝率: <strong style={{color:(ds.winRate||0)>=50?C.win:C.lose}}>{ds.winRate||0}%</strong></span>
            </div>
          </div>
          {/* delete button */}
          <button onClick={onDelete} style={{width:"100%",padding:"13px 0",borderRadius:10,border:"none",background:"#ff4444",color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer"}}>削除</button>
        </div>
      </div>
    </div>
  );
}

// ── Inline match type adder ─────────────────────────────
function AddMatchTypeInline({ onAdd, matchTypes, inputStyle }) {
  const [draft, setDraft] = useState("");
  const handleAdd = () => {
    const t = draft.trim();
    if (!t || matchTypes.includes(t)) return;
    onAdd(t);
    setDraft("");
  };
  return (
    <div style={{display:"flex",gap:8,marginTop:10}}>
      <input
        value={draft}
        onChange={e=>setDraft(e.target.value)}
        onKeyDown={e=>e.key==="Enter"&&handleAdd()}
        placeholder="新しい種類名"
        style={{...inputStyle,flex:1,fontSize:16,padding:"8px 12px"}}
      />
      <button onClick={handleAdd} style={{
        background:`linear-gradient(135deg,#00d4ff,#0099bb)`,
        color:"#000",border:"none",borderRadius:8,
        padding:"8px 16px",fontWeight:800,cursor:"pointer",fontSize:13,whiteSpace:"nowrap"
      }}>追加</button>
    </div>
  );
}

// ── Similar name detection ──────────────────────────────
function normalizeKana(str) {
  // カタカナ→ひらがな変換して正規化
  return str.toLowerCase().replace(/[ァ-ン]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));
}
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({length: m+1}, (_, i) => Array.from({length: n+1}, (_, j) => i===0?j:j===0?i:0));
  for (let i=1;i<=m;i++) for (let j=1;j<=n;j++)
    dp[i][j] = a[i-1]===b[j-1] ? dp[i-1][j-1] : 1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
  return dp[m][n];
}
function findSimilarPairs(names) {
  const pairs = [];
  const reasons = [];
  for (let i=0;i<names.length;i++) for (let j=i+1;j<names.length;j++) {
    const a=names[i], b=names[j];
    const na=normalizeKana(a), nb=normalizeKana(b);
    const dist = levenshtein(na, nb);
    const maxLen = Math.max(na.length, nb.length);
    let reason = null;
    // 編集距離
    if (dist <= 2) reason = `差${dist}文字`;
    else if (maxLen >= 5 && dist <= Math.floor(maxLen*0.35)) reason = `差${dist}文字`;
    // 前方一致・部分一致（省略形）
    else if (na.startsWith(nb) || nb.startsWith(na)) reason = "前方一致";
    else if (na.includes(nb) || nb.includes(na)) reason = "部分一致";
    if (reason) pairs.push([a, b, reason]);
  }
  return pairs;
}

// ── Filter bar ───────────────────────────────────────────
function FilterBar({ decks, allOpponentNames, opponents, matchTypes, flt, setF, activeFilters, onReset, inputStyle }) {
  const [open, setOpen] = useState(false);

  // multi-toggle helpers
  const toggleArr = (key, val) => setF({ [key]: flt[key].includes(val) ? flt[key].filter(x=>x!==val) : [...flt[key], val] });

  // list section with dropdown (collapsed to 1 row)
  const [openDeckList,    setOpenDeckList]    = useState(false);
  const [openOppList,     setOpenOppList]     = useState(false);
  const [openPersonList,  setOpenPersonList]  = useState(false);

  const chip = (active) => ({
    padding:"5px 11px", borderRadius:20, fontSize:12, cursor:"pointer",
    border:`1.5px solid ${active?C.accent:C.border}`,
    background:active?C.accent+"22":"transparent",
    color:active?C.accent:C.muted, fontWeight:active?700:400,
  });

  const listRow = (label, active) => ({
    padding:"10px 14px", cursor:"pointer", fontSize:14,
    color:active?C.accent:C.text,
    background:active?C.accent+"18":"transparent",
    borderBottom:`1px solid ${C.border}`,
    display:"flex", alignItems:"center", justifyContent:"space-between",
  });

  // summary labels
  const deckLabel  = flt.decks.length>0     ? decks.filter(d=>flt.decks.includes(d.id)).map(d=>d.name).join("・") : "すべて";
  const oppLabel   = flt.opponents.length>0  ? flt.opponents.join("・") : "すべて";

  return (
    <div style={{marginBottom:12}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:open?10:0}}>
        <button onClick={()=>setOpen(o=>!o)} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 12px",borderRadius:8,border:`1px solid ${activeFilters>0?C.accent:C.border}`,background:activeFilters>0?C.accent+"18":"transparent",color:activeFilters>0?C.accent:C.muted,cursor:"pointer",fontSize:12,fontWeight:activeFilters>0?700:400}}>
          🔍 絞り込み{activeFilters>0&&<span style={{background:C.accent,color:"#000",borderRadius:10,padding:"1px 6px",fontSize:11,fontWeight:800,marginLeft:2}}>{activeFilters}</span>}
          <span style={{fontSize:10,marginLeft:2}}>{open?"▲":"▼"}</span>
        </button>
        {activeFilters>0&&<button onClick={onReset} style={{padding:"7px 12px",borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer",fontSize:12}}>リセット</button>}
      </div>

      {open&&(
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:12,display:"flex",flexDirection:"column",gap:12}}>

          {/* ── 期間プリセット ── */}
          <div>
            <div style={{fontSize:11,color:C.muted,marginBottom:6}}>期間（プリセット）</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {[["all","全期間"],["today","今日"],["week","今週"],["month","今月"],["year","今年"]].map(([v,l])=>(
                <button key={v} onClick={()=>setF({periodPreset:v, dateFrom:"", dateTo:""})} style={chip(flt.periodPreset===v&&!flt.dateFrom&&!flt.dateTo)}>{l}</button>
              ))}
            </div>
          </div>

          {/* ── 期間個別指定 ── */}
          <div>
            <div style={{fontSize:11,color:C.muted,marginBottom:6}}>期間（個別指定）</div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <input type="date" value={flt.dateFrom} onChange={e=>setF({dateFrom:e.target.value,periodPreset:"all"})}
                style={{...inputStyle,flex:1,padding:"7px 10px",fontSize:16}} />
              <span style={{color:C.muted,fontSize:12,flexShrink:0}}>〜</span>
              <input type="date" value={flt.dateTo} onChange={e=>setF({dateTo:e.target.value,periodPreset:"all"})}
                style={{...inputStyle,flex:1,padding:"7px 10px",fontSize:16}} />
              {(flt.dateFrom||flt.dateTo)&&<button onClick={()=>setF({dateFrom:"",dateTo:""})} style={{color:C.muted,background:"transparent",border:"none",cursor:"pointer",fontSize:16,flexShrink:0}}>✕</button>}
            </div>
          </div>

          {/* ── 使用デッキ（複数・ドロップダウン） ── */}
          <div style={{position:"relative"}}>
            <div style={{fontSize:11,color:C.muted,marginBottom:6}}>使用デッキ{flt.decks.length>0&&<span style={{color:C.accent,marginLeft:4}}>（{flt.decks.length}件）</span>}</div>
            <div onClick={()=>setOpenDeckList(o=>!o)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",borderRadius:8,border:`1px solid ${openDeckList?C.accent:C.border}`,background:C.surface,cursor:"pointer",minHeight:38}}>
              <span style={{fontSize:13,color:flt.decks.length>0?C.text:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{deckLabel}</span>
              <span style={{color:C.muted,fontSize:11,marginLeft:6,flexShrink:0}}>{openDeckList?"▲":"▼"}</span>
            </div>
            {openDeckList&&(
              <div style={{position:"absolute",top:"100%",left:0,right:0,background:C.card,border:`1px solid ${C.accent}`,borderRadius:8,zIndex:300,maxHeight:200,overflowY:"auto",boxShadow:"0 8px 24px #000a",marginTop:3}}>
                {decks.length===0?<div style={{padding:"12px 14px",fontSize:13,color:C.muted}}>登録がありません</div>
                :decks.map(d=>{
                  const sel=flt.decks.includes(d.id);
                  return <div key={d.id} onMouseDown={()=>toggleArr("decks",d.id)} style={listRow(d.name,sel)}>
                    <span>{d.name}</span>{sel&&<span style={{color:C.accent,fontWeight:800,fontSize:13}}>✓</span>}
                  </div>;
                })}
              </div>
            )}
          </div>

          {/* ── 相手デッキ（複数・ドロップダウン） ── */}
          <div style={{position:"relative"}}>
            <div style={{fontSize:11,color:C.muted,marginBottom:6}}>相手デッキ{flt.opponents.length>0&&<span style={{color:C.accent,marginLeft:4}}>（{flt.opponents.length}件）</span>}</div>
            <div onClick={()=>setOpenOppList(o=>!o)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",borderRadius:8,border:`1px solid ${openOppList?C.accent:C.border}`,background:C.surface,cursor:"pointer",minHeight:38}}>
              <span style={{fontSize:13,color:flt.opponents.length>0?C.text:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{oppLabel}</span>
              <span style={{color:C.muted,fontSize:11,marginLeft:6,flexShrink:0}}>{openOppList?"▲":"▼"}</span>
            </div>
            {openOppList&&(
              <div style={{position:"absolute",top:"100%",left:0,right:0,background:C.card,border:`1px solid ${C.accent}`,borderRadius:8,zIndex:300,maxHeight:200,overflowY:"auto",boxShadow:"0 8px 24px #000a",marginTop:3}}>
                {allOpponentNames.length===0?<div style={{padding:"12px 14px",fontSize:13,color:C.muted}}>記録がありません</div>
                :allOpponentNames.map(n=>{
                  const sel=flt.opponents.includes(n);
                  return <div key={n} onMouseDown={()=>toggleArr("opponents",n)} style={listRow(n,sel)}>
                    <span>{n}</span>{sel&&<span style={{color:C.accent,fontWeight:800,fontSize:13}}>✓</span>}
                  </div>;
                })}
              </div>
            )}
          </div>

          {/* ── 対戦相手（ドロップダウン） ── */}
          {opponents&&opponents.length>0&&(
            <div style={{position:"relative"}}>
              <div style={{fontSize:11,color:C.muted,marginBottom:6}}>対戦相手{(flt.opponentPersons||[]).length>0&&<span style={{color:C.accent,marginLeft:4}}>（{(flt.opponentPersons||[]).length}件）</span>}</div>
              <div onClick={()=>setOpenPersonList(o=>!o)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",borderRadius:8,border:`1px solid ${openPersonList?C.accent:C.border}`,background:C.surface,cursor:"pointer",minHeight:38}}>
                <span style={{fontSize:13,color:(flt.opponentPersons||[]).length>0?C.text:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{(flt.opponentPersons||[]).length>0?(flt.opponentPersons||[]).join("・"):"すべて"}</span>
                <span style={{color:C.muted,fontSize:11,marginLeft:6,flexShrink:0}}>{openPersonList?"▲":"▼"}</span>
              </div>
              {openPersonList&&(
                <div style={{position:"absolute",top:"100%",left:0,right:0,background:C.card,border:`1px solid ${C.accent}`,borderRadius:8,zIndex:300,maxHeight:200,overflowY:"auto",boxShadow:"0 8px 24px #000a",marginTop:3}}>
                  {opponents.map(op=>{
                    const sel=(flt.opponentPersons||[]).includes(op);
                    return <div key={op} onMouseDown={()=>{ const cur=flt.opponentPersons||[]; setF({opponentPersons:sel?cur.filter(x=>x!==op):[...cur,op]}); }} style={listRow(op,sel)}>
                      <span>{op}</span>{sel&&<span style={{color:C.accent,fontWeight:800,fontSize:13}}>✓</span>}
                    </div>;
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── 対戦種類（複数選択チップ） ── */}
          <div>
            <div style={{fontSize:11,color:C.muted,marginBottom:6}}>対戦種類（複数選択可）</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {matchTypes.map(t=>(
                <button key={t} onClick={()=>toggleArr("matchTypes",t)} style={chip(flt.matchTypes.includes(t))}>{t}</button>
              ))}
            </div>
          </div>

          {/* ── 先攻・後攻 ── */}
          <div>
            <div style={{fontSize:11,color:C.muted,marginBottom:6}}>先攻・後攻</div>
            <div style={{display:"flex",gap:5}}>
              {[["first","⚡ 先攻"],["second","🌙 後攻"],["","未設定"]].map(([v,l])=>(
                <button key={v} onClick={()=>toggleArr("turns",v)} style={chip(flt.turns.includes(v))}>{l}</button>
              ))}
            </div>
          </div>

          {/* ── 勝敗 ── */}
          <div>
            <div style={{fontSize:11,color:C.muted,marginBottom:6}}>勝敗</div>
            <div style={{display:"flex",gap:5}}>
              {[["win","🏆 勝"],["lose","💀 敗"],["draw","🤝 分"]].map(([v,l])=>(
                <button key={v} onClick={()=>toggleArr("results",v)} style={chip(flt.results.includes(v))}>{l}</button>
              ))}
            </div>
          </div>

          {/* ── 運・不運 ── */}
          <div>
            <div style={{fontSize:11,color:C.muted,marginBottom:6}}>フラグ</div>
            <div style={{display:"flex",gap:5}}>
              <button onClick={()=>setF({lucky:!flt.lucky})} style={chip(flt.lucky)}>🍀 運あり</button>
              <button onClick={()=>setF({unlucky:!flt.unlucky})} style={chip(flt.unlucky)}>💀 不運あり</button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────
export default function App() {
  const [st, setSt] = useState(load);
  const [tab, setTab] = useState("matches");
  const [screen, setScreen] = useState(null); // null | { mode:"add"|"edit", match?:... }
  const [showAddDeck, setShowAddDeck] = useState(false);
  const [showMerge, setShowMerge] = useState(false);
  const [checkedOpponents, setCheckedOpponents] = useState([]);
  const [mergeNewName, setMergeNewName] = useState("");
  const [showMergeInline, setShowMergeInline] = useState(false);
  const [newDeck, setNewDeck] = useState({name:"",colors:[],notes:"",url:"",image:"",parentId:""});
  const [flt, setFlt] = useState({ decks:[], opponents:[], opponentPersons:[], matchTypes:[], turns:[], results:[], lucky:false, unlucky:false, periodPreset:"all", dateFrom:"", dateTo:"" });
  const [showDeckStats, setShowDeckStats] = useState(false);
  const [groupByParent, setGroupByParent] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [deckDetail, setDeckDetail] = useState(null);
  const [deckEditForm, setDeckEditForm] = useState(null);
  const [deckView, setDeckView] = useState('mine');
  const [showSimilar, setShowSimilar] = useState(false);
  const [mergeInitial, setMergeInitial] = useState([]);
  const [matchDetail, setMatchDetail] = useState(null);
  const [showNotes, setShowNotes] = useState(true);
  const [carryOver, setCarryOver] = useState(true);
  const [battleMode, setBattleMode] = useState(false);
  const [battleCount, setBattleCount] = useState(0);
  const [battleLastForm, setBattleLastForm] = useState(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [backupMode, setBackupMode] = useState(null);
  const [backupText, setBackupText] = useState("");
  const [restoreText, setRestoreText] = useState("");
  const [bulkSelected, setBulkSelected] = useState([]);

  const setF = patch => setFlt(f=>({...f,...patch}));
  const resetFilters = () => setFlt({ decks:[], opponents:[], opponentPersons:[], matchTypes:[], turns:[], results:[], lucky:false, unlucky:false, periodPreset:"all", dateFrom:"", dateTo:"" });

  useEffect(()=>{ save(st); }, [st]);
  // Mutate global C so all components (defined outside App) pick up theme changes
  const _theme = getTheme(st.theme||'blue');
  if (_theme) Object.keys(_theme).forEach(k => { globalC[k] = _theme[k]; });

  const allOpponentNames = Array.from(new Set([...(st.opponentNames||[]), ...st.matches.map(m=>m.opponent).filter(Boolean)])).sort();
  const matchTypes = st.matchTypes || [...DEFAULT_MATCH_TYPES];

  const makeNewBattle = (lastForm) => ({
    deckId:    lastForm.deckId,
    opponent:  lastForm.opponent,
    matchType: lastForm.matchType,
    opponentPerson: lastForm.opponentPerson,
    turn: "", result: "win", endTurn: null, lucky: false, unlucky: false,
    notes: "", image: "", deckImage: "", deckUrl: "",
    date: new Date().toISOString().slice(0,10),
  });

  const makeNew = () => {
    const base = {
      turn: "", result: "win", endTurn: null, lucky: false, unlucky: false,
      notes: "", image: "", deckImage: "", deckUrl: "", opponentPerson: "",
      date: new Date().toISOString().slice(0,10),
    };
    if (battleMode && battleLastForm) {
      return {
        ...base,
        deckId:    battleLastForm.deckId,
        opponent:  battleLastForm.opponent,
        matchType: battleLastForm.matchType,
        opponentPerson: battleLastForm.opponentPerson,
      };
    }
    return {
      ...base,
      deckId:    carryOver ? (st.prefs.lastDeckId || st.decks[0]?.id || "") : (st.decks[0]?.id || ""),
      opponent:  carryOver ? (st.prefs.lastOpponent || "") : "",
      matchType: carryOver ? (st.prefs.lastMatchType || "") : "",
    };
  };

  const openAdd = () => setScreen({ mode:"add", form: makeNew() });
  const openEdit = match => setScreen({ mode:"edit", form:{
    deckId:match.deckId, opponent:match.opponent, matchType:match.matchType||"",
    turn:match.turn||"", result:match.result, endTurn:match.endTurn??null, lucky:match.lucky||false, unlucky:match.unlucky||false, notes:match.notes||"", image:match.image||"", deckImage:"", deckUrl:"", opponentPerson:match.opponentPerson||"", date:match.date,
    _id: match.id,
  }});

  const saveMatch = form => {
    if (!form.deckId || !form.opponent.trim()) return;
    // Apply deckImage/deckUrl to deck if newer than existing
    const applyDeckData = s => {
      if ((!form.deckImage && !form.deckUrl) || !form.deckId) return s.decks;
      return s.decks.map(d => {
        if (d.id !== form.deckId) return d;
        const newestDate = s.matches
          .filter(m => m.deckId === form.deckId && (m.deckImage || m.deckUrl) && m.id !== form._id)
          .map(m => m.date)
          .sort()
          .reverse()[0] || "";
        if (newestDate && newestDate > form.date) return d;
        const updates = {};
        if (form.deckImage) updates.image = form.deckImage;
        if (form.deckUrl) updates.url = form.deckUrl;
        return {...d, ...updates};
      });
    };
    if (screen.mode==="add") {
      const match = { id:Date.now().toString(), ...form, createdAt:new Date().toISOString() };
      setSt(s=>({
        ...s,
        decks: applyDeckData(s),
        matches:[...s.matches, match],
        opponentNames: Array.from(new Set([...(s.opponentNames||[]), form.opponent])),
        prefs:{ ...s.prefs, lastDeckId:form.deckId, lastOpponent:form.opponent, lastMatchType:form.matchType },
      }));
    } else {
      setSt(s=>({
        ...s,
        decks: applyDeckData(s),
        matches:s.matches.map(m=>m.id===form._id?{...m,...form}:m),
        opponentNames:Array.from(new Set([...(s.opponentNames||[]),form.opponent])),
        prefs:{ ...s.prefs, lastDeckId:form.deckId, lastOpponent:form.opponent, lastMatchType:form.matchType },
      }));
    }
    if (battleMode && screen.mode==="add") {
      setBattleCount(n => n + 1);
      setBattleLastForm(form);
      setScreen({ mode:"add", form: makeNewBattle(form) });
      return;
    }
    setScreen(null);
    setMatchDetail(null);
  };

  const addMatchType = t => setSt(s=>({...s, matchTypes:[...(s.matchTypes||DEFAULT_MATCH_TYPES), t]}));
  const deleteMatchType = t => {
    setSt(s=>({...s, matchTypes:(s.matchTypes||DEFAULT_MATCH_TYPES).filter(x=>x!==t)}));
  };

  const addDeck = () => {
    if (!newDeck.name.trim()) return;
    const deck={id:Date.now().toString(),...newDeck,createdAt:new Date().toISOString()};
    setSt(s=>({...s,decks:[...s.decks,deck]}));
    setNewDeck({name:"",colors:[],notes:"",url:"",image:""});
    setShowAddDeck(false);
  };
  const deleteDeck = id => {
    setSt(s=>({...s,decks:s.decks.filter(x=>x.id!==id),matches:s.matches.filter(m=>m.deckId!==id)}));
  };
  const deleteMatch = id => setSt(s=>({...s,matches:s.matches.filter(m=>m.id!==id)}));
  const handleMerge = (sel,name) => {
    setSt(s=>({...s,
      matches:s.matches.map(m=>sel.includes(m.opponent)?{...m,opponent:name}:m),
      opponentNames:Array.from(new Set([...(s.opponentNames||[]).filter(n=>!sel.includes(n)),name])),
    }));
    setShowMerge(false);
  };

  // ── CSV Import ──
  const importCSV = (text) => {
    const allLines = text.split("\n");
    const lines = allLines.map(l => l.endsWith("\r") ? l.slice(0, -1) : l).filter(l => l.trim());
    if (lines.length < 2) return;

    const headers = lines[0].split(",");
    const idx = (name) => headers.indexOf(name);
    const rows = lines.slice(1);

    let imported = 0, skipped = 0, autoCreated = 0;
    const newOpponents = new Set();
    const newMatches = [];
    const newDecks = [];
    // Track decks created during this import (name -> id)
    const createdDeckMap = {};

    rows.forEach(line => {
      const cols = line.split(",");
      const get = (name) => {
        const i = idx(name);
        if (i < 0 || i >= cols.length) return "";
        return cols[i].trim().replace(/^"|"$/g, "");
      };

      const myDeckName      = get("使用デッキ");
      const opponent        = get("対戦相手デッキ");
      const dateRaw         = get("日付");
      const turnRaw         = get("先攻・後攻");
      const resultRaw       = get("勝敗");
      const tag             = get("タグ");
      const memo            = get("メモ");
      // Extended template columns
      const endTurnRaw      = get("終了ターン");
      const luckyRaw        = get("運");
      const unluckyRaw      = get("不運");
      const opponentPerson  = get("対戦相手");
      const deckUrl         = get("デッキURL");

      if (!myDeckName || !opponent || !dateRaw) { skipped++; return; }

      // Find or auto-create deck
      let deck = st.decks.find(d => d.name === myDeckName);
      if (!deck && createdDeckMap[myDeckName]) {
        // Already created in this import batch
        deck = { id: createdDeckMap[myDeckName] };
      }
      if (!deck) {
        // Auto-create new deck
        const newId = "deck_imp_" + Date.now() + "_" + autoCreated;
        createdDeckMap[myDeckName] = newId;
        newDecks.push({ id: newId, name: myDeckName, colors: [], notes: "", createdAt: dateRaw });
        deck = { id: newId };
        autoCreated++;
      }

      const turn   = turnRaw === "first" ? "first" : turnRaw === "second" ? "second" : "";
      const result = resultRaw === "win" ? "win" : resultRaw === "loss" ? "lose" : resultRaw === "draw" ? "draw" : "lose";
      const date   = dateRaw.slice(0, 10);

      newOpponents.add(opponent);
      newMatches.push({
        id: "imp_" + Date.now() + "_" + imported,
        deckId: deck.id, opponent, turn, result, date,
        matchType: tag || "",
        notes: memo || "",
        endTurn: endTurnRaw ? parseInt(endTurnRaw) : null,
        lucky: luckyRaw === "1" || luckyRaw === "true" || luckyRaw === "○",
        unlucky: unluckyRaw === "1" || unluckyRaw === "true" || unluckyRaw === "○",
        opponentPerson: opponentPerson || "",
        deckUrl: deckUrl || "",
        createdAt: dateRaw,
      });
      imported++;
    });

    setSt(s => ({
      ...s,
      decks: [...s.decks, ...newDecks],
      matches: [...s.matches, ...newMatches],
      opponentNames: Array.from(new Set([...(s.opponentNames || []), ...newOpponents])),
    }));
    setImportResult({ imported, skipped, autoCreated });
  };
  // ── Entry screen ──
  // Sort decks by recent usage frequency (last 30 days weighted higher)
  const sortedDecksForEntry = [...st.decks].sort((a, b) => {
    const now = Date.now();
    const score = (id) => st.matches.reduce((s, m) => {
      if (m.deckId !== id) return s;
      const age = (now - new Date(m.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      return s + (age <= 30 ? 3 : age <= 90 ? 1.5 : 1);
    }, 0);
    return score(b.id) - score(a.id);
  });

  if (screen) {
    return (
      <MatchEntry
        initial={screen.form}
        onSave={saveMatch}
        onCancel={()=>{ setScreen(null); setMatchDetail(null); }}
        decks={sortedDecksForEntry}
        opponentNames={allOpponentNames}
        opponents={st.opponents||[]}
        matchTypes={matchTypes}
        onAddMatchType={addMatchType}
        isEdit={screen.mode==="edit"}
        onDeleteMatchType={deleteMatchType}
        onDelete={screen.mode==="edit" ? ()=>{ deleteMatch(screen.form._id); setScreen(null); setMatchDetail(null); } : undefined}
        formFields={battleMode ? (st.battleFormFields||{}) : (st.formFields||{})}
        carryOver={carryOver}
        onToggleCarryOver={(next)=>setCarryOver(next)}
        battleMode={battleMode}
        battleCount={battleCount}
        onToggleBattleMode={()=>{ setBattleMode(b=>!b); setBattleCount(0); setBattleLastForm(null); }}
        onToggleBattleField={(key)=>setSt(s=>{ const bf=s.battleFormFields||{}; const cur=bf[key]!==false; return {...s,battleFormFields:{...bf,[key]:!cur}}; })}
        onToggleField={(key)=>setSt(s=>{ const ff=s.formFields||{}; const cur=ff[key]!==false; return {...s,formFields:{...ff,[key]:!cur}}; })}
      />
    );
  }

  // ── Shared filter logic ──
  const getDeck=id=>st.decks.find(d=>d.id===id);

  const applyFilters = matches => {
    const now = new Date();
    return matches.filter(m => {
      // decks (multi)
      if (flt.decks.length>0 && !flt.decks.includes(m.deckId)) return false;
      // opponents (multi)
      if (flt.opponents.length>0 && !flt.opponents.includes(m.opponent)) return false;
      // match types (multi)
      if (flt.matchTypes.length>0 && !flt.matchTypes.includes(m.matchType||"")) return false;
      // period preset
      if (flt.periodPreset !== "all") {
        const d = new Date(m.date);
        if (flt.periodPreset==="today" && d.toDateString()!==now.toDateString()) return false;
        if (flt.periodPreset==="week") { const ago=new Date(now); ago.setDate(now.getDate()-7); if(d<ago) return false; }
        if (flt.periodPreset==="month" && (d.getFullYear()!==now.getFullYear()||d.getMonth()!==now.getMonth())) return false;
        if (flt.periodPreset==="year" && d.getFullYear()!==now.getFullYear()) return false;
      }
      // custom date range
      if (flt.dateFrom && m.date < flt.dateFrom) return false;
      if (flt.dateTo   && m.date > flt.dateTo)   return false;
      // opponentPerson
      if (flt.opponentPersons&&flt.opponentPersons.length>0 && !flt.opponentPersons.includes(m.opponentPerson||"")) return false;
      // turn
      if (flt.turns.length>0 && !flt.turns.includes(m.turn||"")) return false;
      // result
      if (flt.results.length>0 && !flt.results.includes(m.result||"")) return false;
      // lucky / unlucky
      if (flt.lucky && !m.lucky) return false;
      if (flt.unlucky && !m.unlucky) return false;
      return true;
    });
  };

  const activeFilters = flt.decks.length+flt.opponents.length+(flt.opponentPersons||[]).length+flt.matchTypes.length+(flt.periodPreset!=="all"?1:0)+(flt.dateFrom||flt.dateTo?1:0);

  const filtered = applyFilters(st.matches);
  const sorted   = [...filtered].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
  const wins=filtered.filter(m=>m.result==="win").length;
  const loses=filtered.filter(m=>m.result==="lose").length;
  const draws=filtered.filter(m=>m.result==="draw").length;
  const total=filtered.length;
  const wr=total>0?Math.round(wins/total*100):0;
  const fm=filtered.filter(m=>m.turn==="first"), sm=filtered.filter(m=>m.turn==="second");
  const fwr=fm.length>0?Math.round(fm.filter(m=>m.result==="win").length/fm.length*100):null;
  const swr=sm.length>0?Math.round(sm.filter(m=>m.result==="win").length/sm.length*100):null;
  const deckStats=st.decks.map(deck=>{
    const ms=filtered.filter(m=>m.deckId===deck.id);
    const w=ms.filter(m=>m.result==="win").length,l=ms.filter(m=>m.result==="lose").length,dr=ms.filter(m=>m.result==="draw").length,t=ms.length;
    return {...deck,total:t,wins:w,loses:l,draws:dr,winRate:t>0?Math.round(w/t*100):0};
  });
  const opponentStats = Array.from(new Set(filtered.map(m=>m.opponent).filter(Boolean))).sort().map(name=>{
    const ms=filtered.filter(m=>m.opponent===name);
    const w=ms.filter(m=>m.result==="win").length,l=ms.filter(m=>m.result==="lose").length,dr=ms.filter(m=>m.result==="draw").length,t=ms.length;
    return {name,total:t,wins:w,loses:l,draws:dr,winRate:t>0?Math.round(w/t*100):0};
  });

  const toggleBulkSelect = (id) => {
    setBulkSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const executeBulkDelete = () => {
    setSt(s => ({...s, matches: s.matches.filter(m => !bulkSelected.includes(m.id))}));
    setBulkMode(false);
    setBulkSelected([]);
  };
  const cancelBulkMode = () => { setBulkMode(false); setBulkSelected([]); };

  const doRestore = () => {
    const d = parseData(restoreText);
    if (d) { setSt(d); setBackupMode(null); setRestoreText(""); }
  };
  const inputStyle={background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,padding:"9px 12px",fontSize:16,outline:"none",width:"100%",boxSizing:"border-box"};
  const btnSec={background:"transparent",color:C.muted,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 16px",fontSize:13,cursor:"pointer"};

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"Noto Sans JP,Hiragino Sans,sans-serif"}}>
      {/* header */}
      <div style={{background:"linear-gradient(180deg,#0d1525 0%,#0a0e1a 100%)",borderBottom:`1px solid ${C.border}`,padding:"14px 20px",display:"flex",alignItems:"center",gap:12}}>
        <div style={{fontSize:22}}>🌐</div>
        <div>
          <div style={{fontWeight:900,fontSize:17,letterSpacing:1,background:`linear-gradient(90deg,${C.accent},#7c6fff)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>DIGIMON TCG</div>
          <div style={{fontSize:10,color:C.muted,letterSpacing:2}}>BATTLE TRACKER</div>
        </div>
      </div>

      {/* tabs */}
      <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,background:C.card}}>
        {[["matches","対戦記録"],["decks","デッキ管理"],["stats","統計"],["settings","設定"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"13px 0",border:"none",background:"transparent",color:tab===k?C.accent:C.muted,borderBottom:tab===k?`2px solid ${C.accent}`:"2px solid transparent",fontWeight:tab===k?800:400,fontSize:13,cursor:"pointer"}}>
            {l}
          </button>
        ))}
      </div>

      <div style={{padding:14,maxWidth:600,margin:"0 auto"}}>

        {/* ── MATCHES ── */}
        {tab==="matches"&&(
          <div>
            {!bulkMode&&(
              <div style={{marginBottom:8}}>
                {battleMode?(
                  <div style={{display:"flex",gap:8,marginBottom:6}}>
                    <button onClick={openAdd} style={{flex:1,background:`linear-gradient(135deg,#ff9800,#cc7000)`,color:"#000",border:"none",borderRadius:8,padding:"12px 0",fontWeight:800,fontSize:15,cursor:"pointer"}}>記録を追加（{battleCount+1}戦目）</button>
                    <button onClick={()=>{ setBattleMode(false); setBattleCount(0); setBattleLastForm(null); }} style={{padding:"12px 14px",borderRadius:8,border:"1px solid #ff6666",background:"transparent",color:"#ff6666",fontSize:13,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>連戦終了</button>
                  </div>
                ):(
                  <button onClick={openAdd} style={{width:"100%",background:`linear-gradient(135deg,${C.accent},${C.accentDim})`,color:"#000",border:"none",borderRadius:8,padding:"12px 0",fontWeight:800,fontSize:15,cursor:"pointer"}}>記録を追加</button>
                )}
              </div>
            )}
            {bulkMode?(
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                <button onClick={executeBulkDelete} style={{flex:1,padding:"10px 0",borderRadius:8,border:"none",background:bulkSelected.length>0?"#ff4444":"#555",color:"#fff",fontWeight:800,fontSize:13,cursor:"pointer"}}>削除（{bulkSelected.length}件）</button>
                <button onClick={cancelBulkMode} style={{flex:1,padding:"10px 0",borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,fontSize:13,cursor:"pointer"}}>キャンセル</button>
              </div>
            ):(
              <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginBottom:8}}>
                <button onClick={()=>setShowNotes(s=>!s)} style={{padding:"6px 12px",borderRadius:8,fontSize:12,cursor:"pointer",border:`1px solid ${showNotes?C.accent:C.border}`,background:showNotes?C.accent+"18":"transparent",color:showNotes?C.accent:C.muted}}>{showNotes?"メモを隠す":"メモを表示"}</button>
                <button onClick={()=>setBulkMode(true)} style={{padding:"6px 12px",borderRadius:8,fontSize:12,cursor:"pointer",border:`1px solid ${C.border}`,background:"transparent",color:C.muted}}>記録をまとめて削除</button>
              </div>
            )}
            <FilterBar decks={st.decks} allOpponentNames={allOpponentNames} opponents={st.opponents||[]} matchTypes={matchTypes} flt={flt} setF={setF} activeFilters={activeFilters} onReset={resetFilters} inputStyle={inputStyle} />



            {sorted.length===0?(
              <div style={{textAlign:"center",color:C.muted,padding:40,fontSize:13}}>対戦記録がありません<br/>「記録を追加」から追加しましょう</div>
            ):sorted.map(match=>{
              const deck=getDeck(match.deckId);
              const hex=deck?firstHex(deck.colors):null;
              const thumbImg = match.deckImage || (deck&&deck.image) || null;
              const handleCardClick = bulkMode ? ()=>toggleBulkSelect(match.id) : ()=>setMatchDetail(match.id);
              return (
                <div key={match.id} onClick={handleCardClick} style={{background:bulkMode&&bulkSelected.includes(match.id)?C.lose+"22":C.card,border:`1.5px solid ${bulkMode&&bulkSelected.includes(match.id)?"#ff4444":C.border}`,borderRadius:12,padding:12,marginBottom:8,cursor:"pointer"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",flex:1}}>
                      <WinBadge result={match.result}/>
                      <TurnBadge turn={match.turn}/>
                      <span style={{fontWeight:700,fontSize:14}}>vs {match.opponent}</span>
                    </div>
                    <div style={{display:"flex",gap:1,flexShrink:0,alignItems:"center"}}>
                      {!bulkMode&&(
                        <button onClick={()=>openEdit(match)} style={{background:"transparent",border:`1px solid ${C.accent}`,color:C.accent,cursor:"pointer",fontSize:12,padding:"4px 10px",borderRadius:6,fontWeight:700}}>編集</button>
                      )}
                      {bulkMode&&(
                        <div style={{width:22,height:22,borderRadius:6,border:`2px solid ${bulkSelected.includes(match.id)?"#ff4444":C.muted}`,background:bulkSelected.includes(match.id)?"#ff4444":"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                          {bulkSelected.includes(match.id)&&<span style={{color:"#fff",fontSize:13,fontWeight:900}}>✓</span>}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{display:"flex",gap:6,fontSize:11,color:C.muted,flexWrap:"wrap"}}>
                    {deck&&<span style={{display:"inline-flex",alignItems:"center",gap:4,color:hex||"#fff",background:(hex||"#fff")+"22",borderRadius:4,padding:"1px 7px"}}><DeckDot colors={deck.colors} size={10}/>{deck.name}</span>}
                    {match.matchType&&<span style={{color:C.accent,background:C.accent+"18",borderRadius:4,padding:"1px 7px"}}>{match.matchType}</span>}
                    {match.endTurn!=null&&<span style={{color:C.muted,background:C.surface,borderRadius:4,padding:"1px 7px"}}>{match.endTurn}T</span>}
                    {match.opponentPerson&&<span style={{color:C.muted,background:C.surface,borderRadius:4,padding:"1px 7px",fontSize:11}}>👤 {match.opponentPerson}</span>}
                    {match.lucky&&<span style={{color:"#22c55e",background:"#22c55e18",borderRadius:4,padding:"1px 7px"}}>🍀</span>}
                    {match.unlucky&&<span style={{color:"#f87171",background:"#f8717118",borderRadius:4,padding:"1px 7px"}}>💀</span>}
                    {match.image&&<span style={{color:C.muted,background:C.surface,borderRadius:4,padding:"1px 7px"}}>📷</span>}
                    <span>{match.date}</span>
                  </div>
                  {showNotes&&match.notes&&<div style={{marginTop:6,fontSize:12,color:C.muted,borderLeft:`2px solid ${C.border}`,paddingLeft:8}}>{match.notes}</div>}
                </div>
              );
            })}

            {matchDetail&&st.matches.find(x=>x.id===matchDetail)&&(
              <MatchDetailModal
                match={st.matches.find(x=>x.id===matchDetail)}
                deck={getDeck(st.matches.find(x=>x.id===matchDetail).deckId)}
                onClose={()=>setMatchDetail(null)}
                onEdit={()=>{ const m=st.matches.find(x=>x.id===matchDetail); setMatchDetail(null); openEdit(m); }}
                formFields={st.formFields||{}}
        carryOver={carryOver}
        onToggleCarryOver={(next)=>setCarryOver(next)}
              />
            )}
          </div>
        )}

        {/* ── DECKS ── */}
        {tab==="decks"&&(
          <div>
            {/* my / opponents toggle */}
            <div style={{display:"flex",borderRadius:10,overflow:"hidden",border:`1px solid ${C.border}`,marginBottom:14}}>
              {[["mine","自分のデッキ"],["opponents","相手のデッキ"]].map(([k,l])=>(
                <button key={k} onClick={()=>setDeckView(k)} style={{
                  flex:1,padding:"10px 0",border:"none",cursor:"pointer",fontSize:13,
                  background:deckView===k?C.accent+"22":"transparent",
                  color:deckView===k?C.accent:C.muted,
                  fontWeight:deckView===k?800:400,
                  borderRight:k==="mine"?`1px solid ${C.border}`:"none",
                }}>{l}</button>
              ))}
            </div>

            {deckView==="mine"&&(
              <div>
                <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginBottom:12}}>
                  <button onClick={()=>setShowDeckStats(s=>!s)} style={{
                    padding:"8px 12px", borderRadius:8, fontSize:12, cursor:"pointer",
                    border:`1px solid ${showDeckStats?C.accent:C.border}`,
                    background:showDeckStats?C.accent+"18":"transparent",
                    color:showDeckStats?C.accent:C.muted,
                  }}>勝敗{showDeckStats?"非表示":"表示"}</button>
                  <button onClick={()=>setShowAddDeck(true)} style={{background:`linear-gradient(135deg,${C.accent},${C.accentDim})`,color:"#000",border:"none",borderRadius:8,padding:"9px 16px",fontWeight:800,fontSize:13,cursor:"pointer"}}>+ デッキ追加</button>
                </div>
                {st.decks.length===0?(
                  <div style={{textAlign:"center",color:C.muted,padding:40,fontSize:13}}>デッキが登録されていません</div>
                ):deckStats.map(deck=>(
                  <div key={deck.id} onClick={()=>setDeckDetail(deck.id)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:8,cursor:"pointer"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <DeckDot colors={deck.colors} size={20}/>
                        <span style={{fontWeight:800,fontSize:15}}>{deck.name}</span>
                        {deck.image&&<span style={{fontSize:10,color:C.muted,background:C.surface,border:`1px solid ${C.border}`,borderRadius:4,padding:"1px 6px"}}>画像あり</span>}
                      </div>
                      <span style={{color:C.muted,fontSize:13}}>›</span>
                    </div>
                    {showDeckStats&&(
                      <div style={{display:"flex",gap:14,marginTop:8,fontSize:12,color:C.muted}}>
                        <span>対戦: <strong style={{color:C.text}}>{deck.total}</strong></span>
                        <span>勝: <strong style={{color:C.win}}>{deck.wins}</strong></span>
                        <span>勝率: <strong style={{color:deck.winRate>=50?C.win:C.lose}}>{deck.winRate}%</strong></span>
                      </div>
                    )}
                    {deck.notes&&<div style={{marginTop:6,fontSize:11,color:C.muted}}>{deck.notes}</div>}
                  </div>
                ))}
              </div>
            )}

            {deckView==="opponents"&&(
              <div>
                <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginBottom:12}}>
                  <button onClick={()=>setShowDeckStats(s=>!s)} style={{padding:"8px 12px",borderRadius:8,fontSize:12,cursor:"pointer",border:`1px solid ${showDeckStats?C.accent:C.border}`,background:showDeckStats?C.accent+"18":"transparent",color:showDeckStats?C.accent:C.muted}}>勝敗{showDeckStats?"非表示":"表示"}</button>
                  {allOpponentNames.length>=2&&<button onClick={()=>setShowSimilar(true)} style={{...btnSec,fontSize:12}}>🔍 類似確認</button>}
                  <button onClick={()=>{ if(checkedOpponents.length<2) return; setMergeNewName(""); setShowMergeInline(true); }} style={{padding:"8px 12px",borderRadius:8,fontSize:12,cursor:checkedOpponents.length>=2?"pointer":"default",border:`1px solid ${checkedOpponents.length>=2?C.accent:C.border}`,background:checkedOpponents.length>=2?C.accent+"18":"transparent",color:checkedOpponents.length>=2?C.accent:C.muted,fontWeight:700,opacity:checkedOpponents.length>=2?1:0.5}}>🔀 統合{checkedOpponents.length>=2?` (${checkedOpponents.length})`:""}  </button>
                </div>
                {showMergeInline&&checkedOpponents.length>=2&&(
                  <div style={{background:C.surface,border:`1px solid ${C.accent}`,borderRadius:12,padding:14,marginBottom:12}}>
                    <div style={{fontWeight:700,fontSize:13,marginBottom:8,color:C.accent}}>以下のデッキを統合します</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
                      {checkedOpponents.map(n=><span key={n} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:"3px 9px",fontSize:12,color:C.text}}>{n}</span>)}
                    </div>
                    <div style={{fontSize:11,color:C.muted,marginBottom:6}}>統合後のデッキ名</div>
                    <input value={mergeNewName} onChange={e=>setMergeNewName(e.target.value)} placeholder="新しいデッキ名を入力..." style={{...inputStyle,marginBottom:10}}/>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={()=>{ setShowMergeInline(false); setCheckedOpponents([]); setMergeNewName(""); }} style={{flex:1,padding:"9px 0",borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer",fontSize:13}}>キャンセル</button>
                      <button onClick={()=>{ if(!mergeNewName.trim()) return; handleMerge(checkedOpponents, mergeNewName.trim()); setShowMergeInline(false); setCheckedOpponents([]); setMergeNewName(""); }} disabled={!mergeNewName.trim()} style={{flex:2,padding:"9px 0",borderRadius:8,border:"none",background:mergeNewName.trim()?`linear-gradient(135deg,${C.accent},${C.accentDim})`:"#333",color:mergeNewName.trim()?"#000":"#666",fontWeight:800,cursor:mergeNewName.trim()?"pointer":"default",fontSize:13}}>統合する</button>
                    </div>
                  </div>
                )}
                {allOpponentNames.length===0?(
                  <div style={{textAlign:"center",color:C.muted,padding:40,fontSize:13}}>相手デッキの記録がありません</div>
                ):<OpponentDeckList names={allOpponentNames} matches={st.matches} showStats={showDeckStats} inputStyle={inputStyle}
                    checked={checkedOpponents}
                    onToggleCheck={name=>setCheckedOpponents(prev=>prev.includes(name)?prev.filter(x=>x!==name):[...prev,name])}
                    onRename={(oldName,newName)=>{
                      setSt(s=>({
                        ...s,
                        matches:s.matches.map(m=>m.opponent===oldName?{...m,opponent:newName}:m),
                        opponentNames:Array.from(new Set([...(s.opponentNames||[]).filter(n=>n!==oldName),newName])),
                      }));
                    }}
                  />}
              </div>
            )}

            {showAddDeck&&(
              <div style={{position:"fixed",inset:0,background:"#000a",display:"flex",alignItems:"flex-end",zIndex:100}}>
                <div style={{background:C.card,borderRadius:"16px 16px 0 0",padding:20,width:"100%",maxWidth:600,margin:"0 auto",maxHeight:"85vh",overflowY:"auto"}}>
                  <div style={{fontWeight:800,fontSize:15,marginBottom:14}}>デッキを追加</div>
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    <input placeholder="デッキ名" value={newDeck.name} onChange={e=>setNewDeck(d=>({...d,name:e.target.value}))} style={inputStyle}/>
                    <div>
                      <div style={{fontSize:11,color:C.muted,marginBottom:7}}>カラー（虹以外は複数選択可）</div>
                      <ColorPicker colors={newDeck.colors} onChange={colors=>setNewDeck(d=>({...d,colors}))}/>
                    </div>
                    <div>
                      <div style={{fontSize:11,color:C.muted,marginBottom:6}}>親デッキ（派生元・任意）</div>
                      <select value={newDeck.parentId||""} onChange={e=>setNewDeck(d=>({...d,parentId:e.target.value}))} style={{...inputStyle,fontSize:14}}>
                        <option value="">なし</option>
                        {st.decks.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>
                    <textarea placeholder="メモ（任意）" value={newDeck.notes} onChange={e=>setNewDeck(d=>({...d,notes:e.target.value}))} style={{...inputStyle,resize:"vertical",minHeight:52}}/>
                    <div>
                      <div style={{fontSize:11,color:C.muted,marginBottom:6}}>デッキURL（deck-log等）</div>
                      <input placeholder="https://..." value={newDeck.url||""} onChange={e=>setNewDeck(d=>({...d,url:e.target.value}))} style={inputStyle}/>
                    </div>
                    <div>
                      <div style={{fontSize:11,color:C.muted,marginBottom:6}}>デッキ画像</div>
                      <label style={{display:"block",padding:"10px",borderRadius:8,border:`1px dashed ${C.border}`,textAlign:"center",cursor:"pointer",color:C.muted,fontSize:13}}>
                        {newDeck.image ? <img src={newDeck.image} alt="" style={{maxHeight:80,borderRadius:6,objectFit:"contain"}}/> : "📷 画像を選択"}
                        <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
                          const file=e.target.files[0]; if(!file) return;
                          const reader=new FileReader();
                          reader.onload=ev=>setNewDeck(d=>({...d,image:ev.target.result}));
                          reader.readAsDataURL(file);
                        }}/>
                      </label>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={()=>setShowAddDeck(false)} style={{...btnSec,flex:1}}>キャンセル</button>
                      <button onClick={addDeck} style={{flex:2,background:`linear-gradient(135deg,${C.accent},${C.accentDim})`,color:"#000",border:"none",borderRadius:8,padding:"10px 0",fontWeight:800,cursor:"pointer",fontSize:13}}>追加する</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showSimilar&&(
              <div style={{position:"fixed",inset:0,background:"#000b",display:"flex",alignItems:"flex-end",zIndex:100}}>
                <div style={{background:C.card,borderRadius:"16px 16px 0 0",padding:20,width:"100%",maxWidth:600,margin:"0 auto",maxHeight:"85vh",overflowY:"auto"}}>
                  <div style={{fontWeight:800,fontSize:15,marginBottom:4}}>似た名前のデッキ</div>
                  <div style={{fontSize:12,color:C.muted,marginBottom:14}}>表記ゆれの可能性があるペアです</div>
                  {(()=>{
                    const pairs = findSimilarPairs(allOpponentNames);
                    return pairs.length===0 ? (
                      <div style={{textAlign:"center",color:C.muted,padding:30,fontSize:13}}>似た名前のペアは見つかりませんでした</div>
                    ) : pairs.map(([a,b,reason],i)=>(
                      <div key={i} style={{background:C.surface,borderRadius:10,padding:12,marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
                        <div style={{flex:1}}>
                          <div style={{fontSize:14,color:C.text,fontWeight:700}}>{a}</div>
                          <div style={{fontSize:11,color:C.muted,margin:"3px 0"}}>↕ {reason}</div>
                          <div style={{fontSize:14,color:C.text,fontWeight:700}}>{b}</div>
                        </div>
                        <button onClick={()=>{setMergeInitial([a,b]);setShowSimilar(false);setShowMerge(true);}} style={{padding:"6px 12px",borderRadius:8,fontSize:12,border:`1px solid ${C.accent}`,background:"transparent",color:C.accent,cursor:"pointer",whiteSpace:"nowrap",fontWeight:700}}>まとめる</button>
                      </div>
                    ));
                  })()}
                  <button onClick={()=>setShowSimilar(false)} style={{width:"100%",marginTop:8,padding:"10px 0",borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer",fontSize:13}}>閉じる</button>
                </div>
              </div>
            )}


            {/* ── Deck Detail / Edit Modal ── */}
            {deckDetail&&st.decks.find(d=>d.id===deckDetail)&&(
              <DeckDetailModal
                deck={st.decks.find(d=>d.id===deckDetail)}
                deckStats={deckStats.find(d=>d.id===deckDetail)||st.decks.find(d=>d.id===deckDetail)}
                inputStyle={inputStyle}
                allDecks={st.decks}
                onClose={()=>setDeckDetail(null)}
                onSave={updated=>{ setSt(s=>({...s,decks:s.decks.map(d=>d.id===deckDetail?{...d,...updated}:d)})); setDeckDetail(null); }}
                onDelete={()=>{ deleteDeck(deckDetail); setDeckDetail(null); }}
              />
            )}

          </div>
        )}

        {/* ── STATS ── */}
        {tab==="stats"&&(
          <div>
            <FilterBar decks={st.decks} allOpponentNames={allOpponentNames} opponents={st.opponents||[]} matchTypes={matchTypes} flt={flt} setF={setF} activeFilters={activeFilters} onReset={resetFilters} inputStyle={inputStyle} />

            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:12}}>
              <div style={{fontWeight:800,marginBottom:10,color:C.accent}}>
                全体成績{activeFilters>0&&<span style={{fontSize:11,color:C.muted,fontWeight:400,marginLeft:8}}>（絞込中）</span>}
              </div>
              <div style={{display:"flex",gap:6,marginBottom:10}}>
                <StatCard label="総対戦" value={total}/>
                <StatCard label="勝率" value={`${wr}%`} color={C.win}/>
              </div>
              {total>0&&(
                <div>
                  <div style={{display:"flex",borderRadius:8,overflow:"hidden",height:22,marginBottom:6}}>
                    {wins>0&&<div style={{flex:wins/total,background:C.win,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#000",fontWeight:800}}>{wins}</div>}
                    {draws>0&&<div style={{flex:draws/total,background:C.draw,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#000",fontWeight:800}}>{draws}</div>}
                    {loses>0&&<div style={{flex:loses/total,background:C.lose,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff",fontWeight:800}}>{loses}</div>}
                  </div>
                  <div style={{display:"flex",gap:10,fontSize:11,color:C.muted}}>
                    <span style={{color:C.win}}>● 勝 {wins}</span><span style={{color:C.draw}}>● 分 {draws}</span><span style={{color:C.lose}}>● 敗 {loses}</span>
                  </div>
                </div>
              )}
            </div>

            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:12}}>
              <div style={{fontWeight:800,marginBottom:10,color:C.accent}}>先攻勝率 / 後攻勝率</div>
              <div style={{display:"flex",gap:8}}>
                {[["first","⚡ 先攻勝率",C.first,fm,fwr],["second","🌙 後攻勝率",C.second,sm,swr]].map(([k,l,col,ms,wr2])=>(
                  <div key={k} style={{flex:1,background:C.surface,borderRadius:10,padding:12,border:`1px solid ${col}33`}}>
                    <div style={{color:col,fontWeight:700,marginBottom:3,fontSize:12}}>{l}</div>
                    <div style={{fontSize:20,fontWeight:900,color:col}}>{ms.length>0?`${wr2}%`:"—"}</div>
                    <div style={{fontSize:11,color:C.muted,marginTop:2}}>{ms.length}戦 / {ms.filter(m=>m.result==="win").length}勝</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
              <div style={{fontWeight:800,color:C.accent}}>使用デッキ別成績</div>
              <button onClick={()=>setGroupByParent(g=>!g)} style={{padding:"5px 10px",borderRadius:8,fontSize:11,cursor:"pointer",border:`1px solid ${groupByParent?C.accent:C.border}`,background:groupByParent?C.accent+"18":"transparent",color:groupByParent?C.accent:C.muted,fontWeight:groupByParent?700:400}}>{groupByParent?"子デッキ分けて表示":"親子まとめて表示"}</button>
            </div>
            {deckStats.filter(d=>d.total>0).length===0?(
              <div style={{textAlign:"center",color:C.muted,padding:20,fontSize:13}}>該当データなし</div>
            ):groupByParent?(
              (() => {
                const parentDecks = st.decks.filter(d=>!d.parentId);
                return parentDecks.map(parent=>{
                  const children = st.decks.filter(d=>d.parentId===parent.id);
                  const allIds = [parent.id, ...children.map(c=>c.id)];
                  const combined = deckStats.filter(d=>allIds.includes(d.id));
                  const total = combined.reduce((s,d)=>s+d.total,0);
                  const wins  = combined.reduce((s,d)=>s+d.wins,0);
                  const loses = combined.reduce((s,d)=>s+d.loses,0);
                  const draws = combined.reduce((s,d)=>s+d.draws,0);
                  const wr    = total>0?Math.round(wins/total*100):0;
                  if (total===0) return null;
                  return (
                    <div key={parent.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:12,marginBottom:8}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                        <div style={{display:"flex",alignItems:"center",gap:7}}><DeckDot colors={parent.colors} size={10}/><span style={{fontWeight:700,fontSize:13}}>{parent.name}{children.length>0&&<span style={{fontSize:10,color:C.muted,marginLeft:4}}>+{children.length}派生</span>}</span></div>
                        <span style={{fontWeight:900,color:wr>=50?C.win:C.lose,fontSize:17}}>{wr}%</span>
                      </div>
                      <div style={{display:"flex",borderRadius:6,overflow:"hidden",height:14}}>
                        {wins>0&&<div style={{flex:wins/total,background:C.win}}/>}
                        {draws>0&&<div style={{flex:draws/total,background:C.draw}}/>}
                        {loses>0&&<div style={{flex:loses/total,background:C.lose}}/>}
                      </div>
                      <div style={{fontSize:11,color:C.muted,marginTop:5}}>{total}戦 / {wins}勝 / {loses}敗</div>
                      {children.length>0&&combined.filter(d=>d.total>0&&d.id!==parent.id).map(child=>(
                        <div key={child.id} style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div style={{display:"flex",alignItems:"center",gap:5}}><span style={{color:C.muted,fontSize:11}}>└</span><DeckDot colors={child.colors} size={8}/><span style={{fontSize:12,color:C.muted}}>{child.name}</span></div>
                          <span style={{fontSize:12,color:child.winRate>=50?C.win:C.lose,fontWeight:700}}>{child.winRate}% <span style={{fontSize:10,color:C.muted}}>({child.total}戦)</span></span>
                        </div>
                      ))}
                    </div>
                  );
                });
              })()
            ):[...deckStats].filter(d=>d.total>0).sort((a,b)=>b.winRate-a.winRate).map(deck=>(
              <div key={deck.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:12,marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:7}}>
                    <DeckDot colors={deck.colors} size={10}/>
                    <span style={{fontWeight:700,fontSize:13}}>
                      {deck.parentId&&st.decks.find(d=>d.id===deck.parentId)&&<span style={{fontSize:10,color:C.muted,marginRight:3}}>{st.decks.find(d=>d.id===deck.parentId).name} › </span>}
                      {deck.name}
                    </span>
                  </div>
                  <span style={{fontWeight:900,color:deck.winRate>=50?C.win:C.lose,fontSize:17}}>{deck.winRate}%</span>
                </div>
                <div style={{display:"flex",borderRadius:6,overflow:"hidden",height:14}}>
                  {deck.wins>0&&<div style={{flex:deck.wins/deck.total,background:C.win}}/>}
                  {deck.draws>0&&<div style={{flex:deck.draws/deck.total,background:C.draw}}/>}
                  {deck.loses>0&&<div style={{flex:deck.loses/deck.total,background:C.lose}}/>}
                </div>
                <div style={{fontSize:11,color:C.muted,marginTop:5}}>{deck.total}戦 / {deck.wins}勝 / {deck.loses}敗</div>
              </div>
            ))}

            <div style={{fontWeight:800,marginBottom:8,marginTop:16,color:C.accent}}>相手デッキ別成績</div>
            {opponentStats.length===0?(
              <div style={{textAlign:"center",color:C.muted,padding:20,fontSize:13}}>該当データなし</div>
            ):[...opponentStats].sort((a,b)=>b.winRate-a.winRate).map(op=>(
              <div key={op.name} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:12,marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <span style={{fontWeight:700,fontSize:13}}>{op.name}</span>
                  <span style={{fontWeight:900,color:op.winRate>=50?C.win:C.lose,fontSize:17}}>{op.winRate}%</span>
                </div>
                <div style={{display:"flex",borderRadius:6,overflow:"hidden",height:14}}>
                  {op.wins>0&&<div style={{flex:op.wins/op.total,background:C.win}}/>}
                  {op.draws>0&&<div style={{flex:op.draws/op.total,background:C.draw}}/>}
                  {op.loses>0&&<div style={{flex:op.loses/op.total,background:C.lose}}/>}
                </div>
                <div style={{fontSize:11,color:C.muted,marginTop:5}}>{op.total}戦 / {op.wins}勝 / {op.loses}敗</div>
              </div>
            ))}
          </div>
        )}

        {/* ── SETTINGS ── */}
        {tab==="settings"&&(
          <div>
            <div style={{fontWeight:800,fontSize:15,color:C.accent,marginBottom:16}}>設定</div>

            {/* Theme */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:12}}>
              <div style={{fontWeight:800,fontSize:14,marginBottom:12}}>テーマ</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {Object.entries(THEMES).map(([id,theme])=>{
                  const active = (st.theme||'blue') === id;
                  return (
                    <div key={id} onClick={()=>setSt(s=>({...s,theme:id}))} style={{
                      display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:10,cursor:"pointer",
                      border:`2px solid ${active?theme.accent:C.border}`,
                      background:active?theme.accent+"18":C.surface,
                    }}>
                      {/* color preview */}
                      <div style={{display:"flex",gap:3,flexShrink:0}}>
                        {[theme.bg,theme.card,theme.accent,theme.win].map((col,i)=>(
                          <div key={i} style={{width:14,height:14,borderRadius:3,background:col,border:"1px solid #0003"}}/>
                        ))}
                      </div>
                      <span style={{fontSize:14,fontWeight:active?800:400,color:active?theme.accent:C.text}}>{theme.label}</span>
                      {active&&<span style={{marginLeft:"auto",fontSize:12,color:theme.accent,fontWeight:800}}>✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CSV Import */}            {/* Form Fields Visibility */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:12}}>
              <div style={{fontWeight:800,fontSize:14,marginBottom:4}}>記録フォームの表示項目</div>
              <div style={{fontSize:12,color:C.muted,marginBottom:12}}>オフにした項目は記録入力画面に表示されません</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {FORM_FIELDS.map(f=>{
                  const on = (st.formFields||{})[f.key] !== false;
                  return (
                    <div key={f.key} onClick={()=>setSt(s=>({...s,formFields:{...(s.formFields||{}),[f.key]:!on}}))} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",borderRadius:10,cursor:"pointer",background:C.surface,border:`1px solid ${on?C.accent:C.border}`}}>
                      <span style={{fontSize:14,color:on?C.text:C.muted}}>{f.label}</span>
                      <div style={{width:40,height:22,borderRadius:11,background:on?C.accent:C.border,position:"relative",transition:"background 0.2s",flexShrink:0}}>
                        <div style={{position:"absolute",top:3,left:on?20:3,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"left 0.2s"}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Battle Form Fields Visibility */}
            <div style={{background:C.card,border:`1px solid #ff980055`,borderRadius:12,padding:16,marginBottom:12}}>
              <div style={{fontWeight:800,fontSize:14,marginBottom:4,color:"#ff9800"}}>⚔️ 連戦モードの表示項目</div>
              <div style={{fontSize:12,color:C.muted,marginBottom:12}}>連戦モード中に表示する項目を設定します</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {BATTLE_FORM_FIELDS.map(f=>{
                  const on = (st.battleFormFields||{})[f.key] !== false;
                  return (
                    <div key={f.key} onClick={()=>setSt(s=>({...s,battleFormFields:{...(s.battleFormFields||{}),[f.key]:!on}}))} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",borderRadius:10,cursor:"pointer",background:C.surface,border:`1px solid ${on?"#ff9800":C.border}`}}>
                      <span style={{fontSize:14,color:on?C.text:C.muted}}>{f.label}</span>
                      <div style={{width:40,height:22,borderRadius:11,background:on?"#ff9800":C.border,position:"relative",transition:"background 0.2s",flexShrink:0}}>
                        <div style={{position:"absolute",top:3,left:on?20:3,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"left 0.2s"}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Opponents Management */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:12}}>
              <div style={{fontWeight:800,fontSize:14,marginBottom:12}}>対戦相手の管理</div>
              <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:8}}>
                {(st.opponents||[]).map(op=>(
                  <div key={op} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 14px"}}>
                    <span style={{fontSize:14,color:C.text}}>{op}</span>
                    <button onClick={()=>setSt(s=>({...s,opponents:(s.opponents||[]).filter(x=>x!==op)}))} style={{background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:14,padding:"2px 6px"}}>✕</button>
                  </div>
                ))}
                {(st.opponents||[]).length===0&&<div style={{fontSize:13,color:C.muted,padding:"8px 0"}}>登録された対戦相手はありません</div>}
              </div>
              <AddMatchTypeInline onAdd={op=>{ if(op&&!(st.opponents||[]).includes(op)) setSt(s=>({...s,opponents:[...(s.opponents||[]),op]})); }} matchTypes={st.opponents||[]} inputStyle={inputStyle} />
            </div>

            {/* Match Type Management */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:12}}>
              <div style={{fontWeight:800,fontSize:14,marginBottom:12}}>対戦種類の管理</div>
              <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:4}}>
                {matchTypes.map(t=>(
                  <div key={t} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 14px"}}>
                    <span style={{fontSize:14,color:C.text}}>{t}</span>
                    {!DEFAULT_MATCH_TYPES.includes(t)
                      ? <button onClick={()=>deleteMatchType(t)} style={{background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:14,padding:"2px 6px"}}>✕</button>
                      : <span style={{fontSize:11,color:C.muted}}>デフォルト</span>
                    }
                  </div>
                ))}
              </div>
              <AddMatchTypeInline onAdd={addMatchType} matchTypes={matchTypes} inputStyle={inputStyle} />
            </div>

            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:12}}>
              <div style={{fontWeight:800,fontSize:14,marginBottom:4}}>CSVインポート</div>
              <div style={{fontSize:12,color:C.muted,marginBottom:14}}>TCGmanagerからエクスポートしたCSVを読み込みます。既存データに追記されます。</div>
              {!importResult ? (
                <div>
                  <div style={{fontSize:12,color:C.muted,marginBottom:10}}>
                    <strong style={{color:C.text}}>対応形式：</strong> TCGmanager CSV<br/>
                    列: 使用デッキ, 対戦相手デッキ, 日付, 先攻・後攻, 勝敗, タグ, メモ<br/><br/>
                    未登録のデッキは自動で新規作成されます。
                  </div>
                  <label style={{display:"block",padding:"14px",borderRadius:10,border:`2px dashed ${C.accent}`,textAlign:"center",cursor:"pointer",color:C.accent,fontSize:14,fontWeight:700,marginBottom:10}}>
                    📂 CSVファイルを選択
                    <input type="file" accept=".csv" style={{display:"none"}} onChange={e=>{
                      const file = e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = ev => importCSV(ev.target.result);
                      reader.readAsText(file, "UTF-8");
                    }}/>
                  </label>
                </div>
              ) : (
                <div>
                  <div style={{background:C.surface,borderRadius:10,padding:14,marginBottom:12}}>
                    <div style={{fontSize:15,fontWeight:800,color:C.win,marginBottom:8}}>✓ インポート完了</div>
                    <div style={{fontSize:13,color:C.text,lineHeight:1.8}}>
                      取込件数: <strong style={{color:C.win}}>{importResult.imported}件</strong><br/>
                      スキップ: <strong style={{color:C.muted}}>{importResult.skipped}件</strong><br/>
                      {importResult.autoCreated>0&&<span>デッキ自動作成: <strong style={{color:C.draw}}>{importResult.autoCreated}件</strong><br/></span>}
                      {importResult.autoCreated>0&&<span style={{fontSize:11,color:C.muted,display:"block",marginTop:4}}>※ 自動作成されたデッキはデッキ管理でカラー等を設定できます</span>}
                    </div>
                  </div>
                  <button onClick={()=>setImportResult(null)} style={{width:"100%",padding:"10px",borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer",fontSize:13}}>続けてインポート</button>
                </div>
              )}
            </div>
          {/* Backup / Restore */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:12}}>
              <div style={{fontWeight:800,fontSize:14,marginBottom:4}}>データのバックアップ・復元</div>
              <div style={{fontSize:12,color:C.muted,marginBottom:12}}>機種変更などの際に全データを移行できます</div>
              <div style={{display:"flex",gap:8,marginBottom:backupMode?12:0}}>
                <button onClick={()=>{ setBackupMode(backupMode==="export"?null:"export"); setBackupText(serializeData(st)); setRestoreText(""); }} style={{flex:1,padding:"10px 0",borderRadius:8,border:`1px solid ${backupMode==="export"?C.accent:C.border}`,background:backupMode==="export"?C.accent+"18":"transparent",color:backupMode==="export"?C.accent:C.muted,cursor:"pointer",fontSize:13,fontWeight:700}}>📤 エクスポート</button>
                <button onClick={()=>{ setBackupMode(backupMode==="import"?null:"import"); setRestoreText(""); setBackupText(""); }} style={{flex:1,padding:"10px 0",borderRadius:8,border:`1px solid ${backupMode==="import"?C.accent:C.border}`,background:backupMode==="import"?C.accent+"18":"transparent",color:backupMode==="import"?C.accent:C.muted,cursor:"pointer",fontSize:13,fontWeight:700}}>📥 インポート</button>
              </div>
              {backupMode==="export"&&(
                <div>
                  <div style={{fontSize:12,color:C.muted,marginBottom:8}}>以下を全選択してコピーし、新しい端末のインポート欄に貼り付けてください。※デッキ画像・対戦画像は含まれません。復元後に再登録してください</div>
                  <textarea readOnly value={backupText} onClick={e=>e.target.select()} style={{width:"100%",height:90,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:11,padding:"8px",boxSizing:"border-box",resize:"none"}}/>
                  <button onClick={()=>navigator.clipboard&&navigator.clipboard.writeText(backupText)} style={{marginTop:8,width:"100%",padding:"10px 0",borderRadius:8,border:`1px solid ${C.accent}`,background:C.accent+"18",color:C.accent,cursor:"pointer",fontSize:13,fontWeight:700}}>コピー</button>
                </div>
              )}
              {backupMode==="import"&&(
                <div>
                  <div style={{fontSize:12,color:C.muted,marginBottom:8}}>エクスポートしたテキストを貼り付けて復元を押してください</div>
                  <textarea value={restoreText} onChange={e=>setRestoreText(e.target.value)} placeholder="ここに貼り付け..." style={{width:"100%",height:90,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:11,padding:"8px",boxSizing:"border-box",resize:"none"}}/>
                  <button onClick={doRestore} disabled={!restoreText.trim()} style={{marginTop:8,width:"100%",padding:"10px 0",borderRadius:8,border:"none",background:restoreText.trim()?"#00e676":"#333",color:restoreText.trim()?"#000":"#666",cursor:restoreText.trim()?"pointer":"default",fontSize:13,fontWeight:800}}>復元する</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
