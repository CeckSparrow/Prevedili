import { useEffect, useMemo, useState } from "react";
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

/* ================= TIPI ================= */
type Lavorazione = {
  label: string;
  prezzo: number;
  usaMqSpecifici?: boolean;
  usaMc?: boolean;
  aPezzo?: boolean;
  aCorpo?: boolean;
  prezzoEditabile?: boolean;
};

type Preventivo = {
  cliente: string;
  data: string;
  totale: number;
  // Volutamente semplice: in futuro possiamo salvare anche dettagli (selezioni, quantità, prezzi...)
};

/* ================= UI HELPERS ================= */
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-slate-600 bg-white">
      {children}
    </span>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="space-y-1">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      {subtitle ? <div className="text-xs text-slate-500">{subtitle}</div> : null}
    </div>
  );
}

/* ================= APP ================= */
function App() {
  const [view, setView] = useState<"list" | "edit" | "listino">("list");
  const [storicoPreventivi, setStoricoPreventivi] = useState<Preventivo[]>([]);
  const [preventivoCorrente, setPreventivoCorrente] = useState<Preventivo | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const salvati = window.localStorage.getItem("storicoPreventivi");
    if (salvati) setStoricoPreventivi(JSON.parse(salvati));
  }, []);

  const nuovoPreventivo = () => {
    setPreventivoCorrente(null);
    setView("edit");
  };

  const apriPreventivo = (p: Preventivo) => {
    setPreventivoCorrente(p);
    setView("edit");
  };

  const duplicaPreventivo = (p: Preventivo) => {
    const copia = { ...p, data: "" };
    setPreventivoCorrente(copia);
    setView("edit");
  };

  // Nota: hai il bottone “Listino impresa” ma qui la vista listino non è implementata.
  // Mantengo la UX senza rompere: mostro un “placeholder” elegante.
  const renderListinoPlaceholder = () => (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
              Listino impresa
            </h1>
            <p className="text-sm text-slate-500">Imposta i prezzi di default (funzione da rifinire).</p>
          </div>
          <Button variant="outline" onClick={() => setView("list")}>
            ← Torna allo storico
          </Button>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-6 space-y-3">
            <div className="text-sm text-slate-700">
              In questa versione stiamo usando i prezzi salvati in <Badge>localStorage</Badge>.
            </div>
            <div className="text-sm text-slate-500">
              Se vuoi, nel prossimo step ti preparo una schermata “Listino impresa” completa e ben fatta, collegata a
              queste stesse lavorazioni.
            </div>
            <div className="pt-2">
              <Button onClick={() => setView("edit")}>Vai a un preventivo</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (view === "listino") return renderListinoPlaceholder();

  return view === "list" ? (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
              Preventivi Edili
            </h1>
            <p className="text-sm text-slate-500">
              Storico, duplicazione e PDF in un flusso semplice.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setView("listino")}>
              Listino impresa
            </Button>
            <Button onClick={nuovoPreventivo}>+ Nuovo preventivo</Button>
          </div>
        </div>

        {/* Storico */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 sm:p-5 border-b bg-white">
              <SectionHeader
                title="Storico preventivi"
                subtitle="Apri un preventivo esistente oppure duplicalo per partire più veloce."
              />
            </div>

            <div className="bg-white">
              {storicoPreventivi.length === 0 ? (
                <div className="p-6 text-sm text-slate-500">
                  Nessun preventivo salvato. Crea il primo con <Badge>Nuovo preventivo</Badge>.
                </div>
              ) : (
                <div className="divide-y">
                  {storicoPreventivi.map((p, i) => (
                    <div key={i} className="p-4 sm:p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-slate-900 truncate">
                            {p.cliente || "Cliente"}
                          </div>
                          <Badge>€ {Number(p.totale || 0).toLocaleString()}</Badge>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {p.data || "—"}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => apriPreventivo(p)}>
                          Apri
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => duplicaPreventivo(p)}>
                          Duplica
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer note */}
        <div className="text-xs text-slate-500">
          Suggerimento: duplica un preventivo simile e modifica solo le lavorazioni che cambiano.
        </div>
      </div>
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
function EditorPreventivo({
  storicoPreventivi,
  setStoricoPreventivi,
  preventivoCorrente,
  tornaIndietro,
}: {
  storicoPreventivi: Preventivo[];
  setStoricoPreventivi: (v: Preventivo[]) => void;
  preventivoCorrente: Preventivo | null;
  tornaIndietro: () => void;
}) {
  const [cliente, setCliente] = useState(preventivoCorrente?.cliente || "");
  const [superficieCasa, setSuperficieCasa] = useState<number>(100);
  const [piano, setPiano] = useState<number>(1);
  const [ascensore, setAscensore] = useState<boolean>(false);
  const [accessoStrada, setAccessoStrada] = useState<boolean>(true);

  const [selezioni, setSelezioni] = useState<Record<string, boolean>>({});
  const [prezziPersonalizzati, setPrezziPersonalizzati] = useState<Record<string, number>>({});
  const [mqLavorazioni, setMqLavorazioni] = useState<Record<string, number>>({});
  const [mcLavorazioni, setMcLavorazioni] = useState<Record<string, number>>({});
  const [prezzoMc, setPrezzoMc] = useState<Record<string, number>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const salvato = window.localStorage.getItem("listinoPrezziImpresa");
    if (salvato) setPrezziPersonalizzati(JSON.parse(salvato));
  }, []);

  const toggle = (k: string) => setSelezioni({ ...selezioni, [k]: !selezioni[k] });
  const cambiaPrezzo = (k: string, v: number) => setPrezziPersonalizzati({ ...prezziPersonalizzati, [k]: v });
  const cambiaMq = (k: string, v: number) => setMqLavorazioni({ ...mqLavorazioni, [k]: v });
  const cambiaMc = (k: string, v: number) => setMcLavorazioni({ ...mcLavorazioni, [k]: v });
  const cambiaPrezzoMc = (k: string, v: number) => setPrezzoMc({ ...prezzoMc, [k]: v });

  const tutte = useMemo(() => ({ ...demolizioni, ...lavorazioniBase, ...lavorazioniAvanzate }), []);

  const calcolaTotale = () => {
    let tot = Object.keys(selezioni).reduce((s, k) => {
      if (!selezioni[k]) return s;
      const v: any = (tutte as any)[k];
      let p = prezziPersonalizzati[k] ?? v.prezzo;
      if (v.usaMc) p = prezzoMc[k] ?? p;
      if (v.aCorpo || v.prezzoEditabile) return s + p;
      if (v.aPezzo) return s + p * (mqLavorazioni[k] ?? 0);
      if (v.usaMc) return s + p * (mcLavorazioni[k] ?? 0);
      return s + p * (v.usaMqSpecifici ? mqLavorazioni[k] ?? 0 : superficieCasa);
    }, 0);

    if (!ascensore) tot *= 1.1;

    // Coefficienti su carico e scarico (solo se selezionato)
    if (selezioni["caricoScarico"]) {
      const c = 1 + 0.02 * piano + (!accessoStrada ? 0.2 : 0);
      tot += (lavorazioniBase.caricoScarico.prezzo * superficieCasa * c) - (lavorazioniBase.caricoScarico.prezzo * superficieCasa);
    }

    return tot;
  };

  const totale = useMemo(() => calcolaTotale(), [selezioni, prezziPersonalizzati, mqLavorazioni, mcLavorazioni, prezzoMc, superficieCasa, piano, ascensore, accessoStrada]);

  const salva = () => {
    const nuovo: Preventivo = {
      cliente,
      data: new Date().toLocaleString(),
      totale,
    };
    const agg = [nuovo, ...storicoPreventivi];
    setStoricoPreventivi(agg);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("storicoPreventivi", JSON.stringify(agg));
    }
    tornaIndietro();
  };

  const exportPDF = async () => {
    if (typeof window === "undefined") return;

    const el = document.getElementById("pdf-root");
    if (!el) return;

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

  function tipoBadge(item: Lavorazione) {
    if (item.aCorpo) return "a corpo";
    if (item.aPezzo) return "a pezzo";
    if (item.usaMc) return "€/m³";
    return "€/m²";
  }

  function renderSezione(titolo: string, lavorazioni: Record<string, Lavorazione>) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 sm:p-5 border-b bg-white flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">{titolo}</div>
            <div className="text-xs text-slate-500">Seleziona le voci necessarie</div>
          </div>

          <div className="p-4 sm:p-5 bg-white space-y-3">
            {Object.entries(lavorazioni).map(([key, item]) => {
              const selected = !!selezioni[key];
              const prezzoMostrato = prezziPersonalizzati[key] ?? item.prezzo;

              return (
                <div key={key} className="rounded-xl border bg-white">
                  {/* Riga principale */}
                  <div className="px-3 sm:px-4 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Checkbox checked={selected} onCheckedChange={() => toggle(key)} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-slate-900 truncate">{item.label}</div>
                          <Badge>{tipoBadge(item)}</Badge>
                        </div>
                        <div className="text-xs text-slate-500">
                          Prezzo di default modificabile per preventivo
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs text-slate-500">Prezzo</div>
                      <div className="font-semibold text-slate-900">€ {Number(prezzoMostrato).toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Dettagli quando selezionato */}
                  {selected && (
                    <div className="px-3 sm:px-4 pb-4 pt-3 border-t bg-slate-50">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {item.usaMqSpecifici && (
                          <div className="space-y-1">
                            <div className="text-xs text-slate-600">Mq lavorazione</div>
                            <Input
                              type="number"
                              value={mqLavorazioni[key] ?? 0}
                              onChange={(e) => cambiaMq(key, Number(e.target.value))}
                            />
                          </div>
                        )}

                        {item.usaMc && (
                          <>
                            <div className="space-y-1">
                              <div className="text-xs text-slate-600">Metri cubi</div>
                              <Input
                                type="number"
                                value={mcLavorazioni[key] ?? 0}
                                onChange={(e) => cambiaMc(key, Number(e.target.value))}
                              />
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs text-slate-600">Prezzo €/m³</div>
                              <Input
                                type="number"
                                value={prezzoMc[key] ?? item.prezzo}
                                onChange={(e) => cambiaPrezzoMc(key, Number(e.target.value))}
                              />
                            </div>
                          </>
                        )}

                        {(item.aPezzo || item.prezzoEditabile) && (
                          <>
                            {item.aPezzo && (
                              <div className="space-y-1">
                                <div className="text-xs text-slate-600">Quantità</div>
                                <Input
                                  type="number"
                                  value={mqLavorazioni[key] ?? 0}
                                  onChange={(e) => cambiaMq(key, Number(e.target.value))}
                                />
                              </div>
                            )}
                            <div className="space-y-1">
                              <div className="text-xs text-slate-600">Prezzo €</div>
                              <Input
                                type="number"
                                value={prezziPersonalizzati[key] ?? item.prezzo}
                                onChange={(e) => cambiaPrezzo(key, Number(e.target.value))}
                              />
                            </div>
                          </>
                        )}

                        {!item.aCorpo && !item.aPezzo && !item.usaMc && !item.prezzoEditabile && (
                          <div className="space-y-1">
                            <div className="text-xs text-slate-600">Prezzo €/m²</div>
                            <Input
                              type="number"
                              value={prezziPersonalizzati[key] ?? item.prezzo}
                              onChange={(e) => cambiaPrezzo(key, Number(e.target.value))}
                            />
                          </div>
                        )}

                        {/* Per le voci a corpo non-editabili, lasciamo comunque un campo prezzo se vuoi */}
                        {item.aCorpo && !item.prezzoEditabile && (
                          <div className="space-y-1">
                            <div className="text-xs text-slate-600">Prezzo €</div>
                            <Input
                              type="number"
                              value={prezziPersonalizzati[key] ?? item.prezzo}
                              onChange={(e) => cambiaPrezzo(key, Number(e.target.value))}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Area PDF */}
      <div id="pdf-root" className="mx-auto max-w-5xl p-4 sm:p-6 pb-28 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">Nuovo preventivo</h1>
            <p className="text-sm text-slate-500">Compila i dati e seleziona le lavorazioni.</p>
          </div>
          <Button variant="outline" onClick={tornaIndietro}>
            ← Torna allo storico
          </Button>
        </div>

        {/* Dati immobile */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 sm:p-5 border-b bg-white">
              <SectionHeader title="Dati immobile" subtitle="Questi dati influenzano quantità e coefficienti." />
            </div>

            <div className="p-4 sm:p-5 bg-white space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="text-xs text-slate-600">Cliente</div>
                  <Input placeholder="Nome cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} />
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-slate-600">Superficie (m²)</div>
                  <Input
                    type="number"
                    placeholder="Superficie mq"
                    value={superficieCasa}
                    onChange={(e) => setSuperficieCasa(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-slate-600">Piano</div>
                  <Input
                    type="number"
                    placeholder="Piano"
                    value={piano}
                    onChange={(e) => setPiano(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-slate-600">Accessibilità</div>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <Checkbox checked={ascensore} onCheckedChange={(v) => setAscensore(!!v)} /> Ascensore
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <Checkbox checked={accessoStrada} onCheckedChange={(v) => setAccessoStrada(!!v)} /> Accesso diretto alla strada
                    </label>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Coefficienti: no ascensore <Badge>+10%</Badge> sul totale, piani e accesso strada su carico/scarico.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sezioni */}
        <div className="space-y-6">
          {renderSezione("Demolizioni", demolizioni as any)}
          {renderSezione("Lavorazioni principali", lavorazioniBase as any)}
          {renderSezione("Voci avanzate", lavorazioniAvanzate as any)}
        </div>
      </div>

      {/* Totale sticky */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-4">
          <div className="rounded-2xl border bg-white shadow-sm p-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs text-slate-500">Totale stimato</div>
              <div className="text-xl sm:text-2xl font-semibold text-slate-900">
                € {Number(totale).toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Il totale è una stima: l’impresa può sempre rivedere il prezzo finale.
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={exportPDF}>
                Esporta PDF
              </Button>
              <Button onClick={salva}>Salva preventivo</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(App), { ssr: false });

