import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

/* ================= CONFIGURAZIONI ================= */
const demolizioni = {
  demolizioneMuratura: { label: "Demolizione muratura", prezzo: 25, usaMqSpecifici: true },
  demolizioneIntonaci: { label: "Demolizione intonaci", prezzo: 12, usaMqSpecifici: true },
  demolizioneImpianti: { label: "Demolizione impianti (a pezzo)", prezzo: 60, aPezzo: true },
  demolizioneInfissi: { label: "Demolizione infissi (a pezzo)", prezzo: 80, aPezzo: true },
};

const lavorazioniBase = {
  muratura: { label: "Muratura", prezzo: 40, usaMqSpecifici: true },
  pittura: { label: "Pittura", prezzo: 15, usaMqSpecifici: true },
  posaPavimento: { label: "Posa pavimento", prezzo: 30, usaMqSpecifici: true },
  posaRivestimenti: { label: "Posa rivestimenti", prezzo: 30, usaMqSpecifici: true },
  massetto: { label: "Massetto", prezzo: 25, usaMqSpecifici: true },
  intonaci: { label: "Intonaci", prezzo: 20, usaMqSpecifici: true },
  caricoScarico: { label: "Carico e scarico al piano", prezzo: 10 },
  impiantoElettrico: { label: "Impianto elettrico", prezzo: 35 },
  impiantoIdraulico: { label: "Impianto idraulico", prezzo: 45 },
  riscaldamento: { label: "Impianto di riscaldamento", prezzo: 50 },
  impiantoGas: { label: "Impianto a gas (a corpo)", prezzo: 500, aCorpo: true, prezzoEditabile: true },
};

const lavorazioniAvanzate = {
  ponteggi: { label: "Ponteggi", prezzo: 8 },
  smaltimento: { label: "Smaltimento macerie", prezzo: 6, usaMc: true },
  trasporti: { label: "Trasporti", prezzo: 4, usaMc: true },
  urgenza: { label: "Lavoro urgente", prezzo: 10 },
};

/* ================= APP ================= */
function App() {
  const [view, setView] = useState("list");
  const [storicoPreventivi, setStoricoPreventivi] = useState([]);
  const [preventivoCorrente, setPreventivoCorrente] = useState(null);

  useEffect(() => {
  if (typeof window === "undefined") return;

  const salvati = localStorage.getItem("storicoPreventivi");
  if (salvati) setStoricoPreventivi(JSON.parse(salvati));
}, []);

  const nuovoPreventivo = () => {
    setPreventivoCorrente(null);
    setView("edit");
  };

  const apriPreventivo = (p) => {
    setPreventivoCorrente(p);
    setView("edit");
  };

  const duplicaPreventivo = (p) => {
    const copia = { ...p, data: null };
    setPreventivoCorrente(copia);
    setView("edit");
  };

  return view === "list" ? (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Preventivi Edili</h1>

      <div className="flex gap-3">
        <Button onClick={nuovoPreventivo}>+ Nuovo preventivo</Button>
        <Button variant="outline" onClick={() => setView('listino')}>Listino impresa</Button>
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">
          <h2 className="text-xl font-semibold">Storico preventivi</h2>
          {storicoPreventivi.length === 0 && <p>Nessun preventivo salvato</p>}
          {storicoPreventivi.map((p, i) => (
            <div key={i} className="flex justify-between items-center border-b py-2">
              <div>
                <strong>{p.cliente}</strong><br />
                <span className="text-sm text-gray-500">{p.data}</span>
              </div>
              <div className="flex gap-3 items-center">
                <span className="font-semibold">€ {p.totale.toLocaleString()}</span>
                <Button size="sm" onClick={() => apriPreventivo(p)}>Apri</Button>
                <Button size="sm" variant="outline" onClick={() => duplicaPreventivo(p)}>Duplica</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  ) : (
    <EditorPreventivo
      storicoPreventivi={storicoPreventivi}
      setStoricoPreventivi={setStoricoPreventivi}
      preventivoCorrente={preventivoCorrente}
      tornaIndietro={() => setView("list")}
    />
  );
}

/* ================= EDITOR PREVENTIVO ================= */
function EditorPreventivo({ storicoPreventivi, setStoricoPreventivi, preventivoCorrente, tornaIndietro }) {
  const [cliente, setCliente] = useState(preventivoCorrente?.cliente || "");
  const [superficieCasa, setSuperficieCasa] = useState(100);
  const [piano, setPiano] = useState(1);
  const [ascensore, setAscensore] = useState(false);
  const [accessoStrada, setAccessoStrada] = useState(true);

  const [selezioni, setSelezioni] = useState<Record<string, boolean>>({});
  const [prezziPersonalizzati, setPrezziPersonalizzati] = useState({});

useEffect(() => {
  if (typeof window === "undefined") return;

  const salvato = window.localStorage.getItem("listinoPrezziImpresa");
  if (salvato) {
    setPrezziPersonalizzati(JSON.parse(salvato));
  }
}, []);
  const [mqLavorazioni, setMqLavorazioni] = useState({});
  const [mcLavorazioni, setMcLavorazioni] = useState({});
  const [prezzoMc, setPrezzoMc] = useState({});

  const toggle = (k) => setSelezioni({ ...selezioni, [k]: !selezioni[k] });
  const cambiaPrezzo = (k, v) => setPrezziPersonalizzati({ ...prezziPersonalizzati, [k]: v });
  const cambiaMq = (k, v) => setMqLavorazioni({ ...mqLavorazioni, [k]: v });
  const cambiaMc = (k, v) => setMcLavorazioni({ ...mcLavorazioni, [k]: v });
  const cambiaPrezzoMc = (k, v) => setPrezzoMc({ ...prezzoMc, [k]: v });

  const calcolaTotale = () => {
    const tutte = { ...demolizioni, ...lavorazioniBase, ...lavorazioniAvanzate };
    let tot = Object.keys(selezioni).reduce((s, k) => {
      if (!selezioni[k]) return s;
      const v = tutte[k];
      let p = prezziPersonalizzati[k] ?? v.prezzo;
      if (v.usaMc) p = prezzoMc[k] ?? p;
      if (v.aCorpo || v.prezzoEditabile) return s + p;
      if (v.aPezzo) return s + p * (mqLavorazioni[k] ?? 0);
      if (v.usaMc) return s + p * (mcLavorazioni[k] ?? 0);
      return s + p * (v.usaMqSpecifici ? mqLavorazioni[k] ?? 0 : superficieCasa);
    }, 0);

    if (!ascensore) tot *= 1.1;
    if (selezioni.caricoScarico) {
      let c = 1 + 0.02 * piano + (!accessoStrada ? 0.2 : 0);
      tot += (lavorazioniBase.caricoScarico.prezzo * superficieCasa * c) - (lavorazioniBase.caricoScarico.prezzo * superficieCasa);
    }
    return tot;
  };

  const salva = () => {
    const nuovo = { cliente, data: new Date().toLocaleString(), totale: calcolaTotale() };
    const agg = [nuovo, ...storicoPreventivi];
    setStoricoPreventivi(agg);
    if (typeof window !== "undefined") {
      localStorage.setItem("storicoPreventivi", JSON.stringify(agg));
    }
    tornaIndietro();
  };

  const exportPDF = async () => {
  if (typeof window === "undefined") return;

  const el = document.getElementById("pdf-root");
  if (!el) return;

  // Import dinamico SOLO lato client (evita crash in build)
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const canvas = await html2canvas(el);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const w = pdf.internal.pageSize.getWidth();
  const h = (canvas.height * w) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, w, h);
  pdf.save(`preventivo-${cliente || "cliente"}.pdf`);
};

  function renderSezione(titolo, lavorazioni) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4 space-y-4">
          <h2 className="text-xl font-semibold">{titolo}</h2>
          {Object.entries(lavorazioni).map(([key, item]) => (
            <div key={key} className="space-y-2 border-b pb-3">
              <div className="flex items-center gap-2">
                <Checkbox checked={!!selezioni[key]} onCheckedChange={() => toggle(key)} />
                <span className="font-medium">{item.label}</span>
              </div>

              {selezioni[key] && (
                <div className="grid grid-cols-3 gap-2 pl-6">
                  {item.usaMqSpecifici && (
                    <div>
                      <label className="text-sm">Mq lavorazione</label>
                      <Input type="number" value={mqLavorazioni[key] ?? 0} onChange={(e) => cambiaMq(key, +e.target.value)} />
                    </div>
                  )}

                  {item.usaMc && (
                    <>
                      <div>
                        <label className="text-sm">Metri cubi</label>
                        <Input type="number" value={mcLavorazioni[key] ?? 0} onChange={(e) => cambiaMc(key, +e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm">Prezzo €/m3</label>
                        <Input type="number" value={prezzoMc[key] ?? item.prezzo} onChange={(e) => cambiaPrezzoMc(key, +e.target.value)} />
                      </div>
                    </>
                  )}

                  {(item.aPezzo || item.prezzoEditabile) && (
                    <>
                      {item.aPezzo && (
                        <div>
                          <label className="text-sm">Quantità</label>
                          <Input type="number" value={mqLavorazioni[key] ?? 0} onChange={(e) => cambiaMq(key, +e.target.value)} />
                        </div>
                      )}
                      <div>
                        <label className="text-sm">Prezzo €</label>
                        <Input type="number" value={prezziPersonalizzati[key] ?? item.prezzo} onChange={(e) => cambiaPrezzo(key, +e.target.value)} />
                      </div>
                    </>
                  )}

                  {!item.aCorpo && !item.aPezzo && !item.usaMc && !item.prezzoEditabile && (
                    <div>
                      <label className="text-sm">Prezzo €/mq</label>
                      <Input type="number" value={prezziPersonalizzati[key] ?? item.prezzo} onChange={(e) => cambiaPrezzo(key, +e.target.value)} />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div id="pdf-root" className="p-6 max-w-4xl mx-auto space-y-6">
      <Button variant="outline" onClick={tornaIndietro}>← Torna allo storico</Button>

      <Card>
        <CardContent className="p-4 space-y-4">
          <h2 className="text-xl font-semibold">Dati immobile</h2>
          <Input placeholder="Nome cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} />
          <Input type="number" placeholder="Superficie mq" value={superficieCasa} onChange={(e) => setSuperficieCasa(+e.target.value)} />
          <Input type="number" placeholder="Piano" value={piano} onChange={(e) => setPiano(+e.target.value)} />
          <div className="flex gap-4">
            <Checkbox checked={ascensore} onCheckedChange={(v) => setAscensore(!!v)} /> Ascensore
            <Checkbox checked={accessoStrada} onCheckedChange={(v) => setAccessoStrada(!!v)} /> Accesso strada
          </div>
        </CardContent>
      </Card>

      {renderSezione("Demolizioni", demolizioni)}
      {renderSezione("Lavorazioni principali", lavorazioniBase)}
      {renderSezione("Voci avanzate", lavorazioniAvanzate)}

      <Card>
        <CardContent className="p-4 flex justify-between items-center">
          <strong>Totale: € {calcolaTotale().toLocaleString()}</strong>
          <div className="flex gap-3">
            <Button variant="outline" onClick={exportPDF}>Esporta PDF</Button>
            <Button onClick={salva}>Salva preventivo</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default dynamic(() => Promise.resolve(App), { ssr: false });
