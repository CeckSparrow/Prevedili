import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileText, 
  Plus, 
  Download, 
  Save, 
  ArrowLeft, 
  Copy, 
  Trash2,
  Building2,
  Calculator,
  ChevronDown,
  ChevronUp
} from "lucide-react";

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

  const eliminaPreventivo = (index) => {
    const nuovoStorico = storicoPreventivi.filter((_, i) => i !== index);
    setStoricoPreventivi(nuovoStorico);
    if (typeof window !== "undefined") {
      localStorage.setItem("storicoPreventivi", JSON.stringify(nuovoStorico));
    }
  };

  return view === "list" ? (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
              <Building2 className="w-10 h-10 text-blue-600" />
              Preventivi Edili
            </h1>
            <p className="text-slate-600 mt-2">Gestisci i tuoi preventivi in modo semplice e veloce</p>
          </div>
          <Button onClick={nuovoPreventivo} size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-5 h-5" />
            Nuovo preventivo
          </Button>
        </div>

        {/* Storico */}
        <Card className="shadow-lg">
          <CardContent className="p-6 space-y-4">
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <FileText className="w-6 h-6 text-blue-600" />
              Storico preventivi
            </h2>
            {storicoPreventivi.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">Nessun preventivo salvato</p>
                <p className="text-slate-400 text-sm mt-2">Crea il tuo primo preventivo per iniziare</p>
              </div>
            ) : (
              <div className="space-y-3">
                {storicoPreventivi.map((p, i) => (
                  <div 
                    key={i} 
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <strong className="text-lg text-slate-900">{p.cliente || "Cliente senza nome"}</strong>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{p.data}</span>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">€ {p.totale.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button size="sm" onClick={() => apriPreventivo(p)} className="gap-1">
                        <FileText className="w-4 h-4" />
                        Apri
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => duplicaPreventivo(p)} className="gap-1">
                        <Copy className="w-4 h-4" />
                        Duplica
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => eliminaPreventivo(i)}
                        className="gap-1 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
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
function EditorPreventivo({ storicoPreventivi, setStoricoPreventivi, preventivoCorrente, tornaIndietro }) {
  const [cliente, setCliente] = useState(preventivoCorrente?.cliente || "");
  const [superficieCasa, setSuperficieCasa] = useState(100);
  const [piano, setPiano] = useState(1);
  const [ascensore, setAscensore] = useState(false);
  const [accessoStrada, setAccessoStrada] = useState(true);

  const [selezioni, setSelezioni] = useState<Record<string, boolean>>({});
  const [prezziPersonalizzati, setPrezziPersonalizzati] = useState({});
  const [mqLavorazioni, setMqLavorazioni] = useState({});
  const [mcLavorazioni, setMcLavorazioni] = useState({});
  const [prezzoMc, setPrezzoMc] = useState({});

  // Stati per sezioni collassabili
  const [sezioniAperte, setSezioniAperte] = useState({
    demolizioni: true,
    lavorazioni: true,
    avanzate: true
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const salvato = window.localStorage.getItem("listinoPrezziImpresa");
    if (salvato) {
      setPrezziPersonalizzati(JSON.parse(salvato));
    }
  }, []);

  const toggle = (k) => setSelezioni({ ...selezioni, [k]: !selezioni[k] });
  const cambiaPrezzo = (k, v) => setPrezziPersonalizzati({ ...prezziPersonalizzati, [k]: v });
  const cambiaMq = (k, v) => setMqLavorazioni({ ...mqLavorazioni, [k]: v });
  const cambiaMc = (k, v) => setMcLavorazioni({ ...mcLavorazioni, [k]: v });
  const cambiaPrezzoMc = (k, v) => setPrezzoMc({ ...prezzoMc, [k]: v });

  const toggleSezione = (sezione) => {
    setSezioniAperte({ ...sezioniAperte, [sezione]: !sezioniAperte[sezione] });
  };

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
    const nuovo = { cliente, data: new Date().toLocaleString('it-IT'), totale: calcolaTotale() };
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

  type Lavorazione = {
    label: string;
    prezzo: number;
    usaMqSpecifici?: boolean;
    usaMc?: boolean;
    aPezzo?: boolean;
    aCorpo?: boolean;
    prezzoEditabile?: boolean;
  };

  function renderSezione(titolo: string, lavorazioni: Record<string, Lavorazione>, sezioneKey: string) {
    const isAperta = sezioniAperte[sezioneKey];
    const numSelezionate = Object.keys(lavorazioni).filter(k => selezioni[k]).length;

    return (
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          <div 
            className="p-6 cursor-pointer hover:bg-slate-50 transition-colors border-b"
            onClick={() => toggleSezione(sezioneKey)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold">{titolo}</h3>
                {numSelezionate > 0 && (
                  <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                    {numSelezionate} selezionate
                  </span>
                )}
              </div>
              {isAperta ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        
        {isAperta && (
          <div className="p-6 space-y-4">
            {Object.entries(lavorazioni).map(([key, item]) => (
              <div 
                key={key} 
                className={`space-y-3 p-4 rounded-lg border transition-all ${
                  selezioni[key] 
                    ? 'border-blue-300 bg-blue-50/50' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Checkbox 
                    checked={!!selezioni[key]} 
                    onCheckedChange={() => toggle(key)}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <span className="font-medium text-slate-900">{item.label}</span>
                  <span className="text-sm text-slate-500 ml-auto">
                    €{item.prezzo}
                    {item.usaMc ? '/m³' : item.aPezzo ? '/pz' : item.aCorpo ? '' : '/m²'}
                  </span>
                </div>

                {selezioni[key] && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pl-8">
                    {item.usaMqSpecifici && (
                      <div>
                        <label className="text-sm font-medium text-slate-700 block mb-1">
                          Mq lavorazione
                        </label>
                        <Input 
                          type="number" 
                          value={mqLavorazioni[key] ?? 0} 
                          onChange={(e) => cambiaMq(key, +e.target.value)}
                          className="border-slate-300"
                        />
                      </div>
                    )}

                    {item.usaMc && (
                      <>
                        <div>
                          <label className="text-sm font-medium text-slate-700 block mb-1">
                            Metri cubi
                          </label>
                          <Input 
                            type="number" 
                            value={mcLavorazioni[key] ?? 0} 
                            onChange={(e) => cambiaMc(key, +e.target.value)}
                            className="border-slate-300"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700 block mb-1">
                            Prezzo €/m³
                          </label>
                          <Input 
                            type="number" 
                            value={prezzoMc[key] ?? item.prezzo} 
                            onChange={(e) => cambiaPrezzoMc(key, +e.target.value)}
                            className="border-slate-300"
                          />
                        </div>
                      </>
                    )}

                    {(item.aPezzo || item.prezzoEditabile) && (
                      <>
                        {item.aPezzo && (
                          <div>
                            <label className="text-sm font-medium text-slate-700 block mb-1">
                              Quantità
                            </label>
                            <Input 
                              type="number" 
                              value={mqLavorazioni[key] ?? 0} 
                              onChange={(e) => cambiaMq(key, +e.target.value)}
                              className="border-slate-300"
                            />
                          </div>
                        )}
                        <div>
                          <label className="text-sm font-medium text-slate-700 block mb-1">
                            Prezzo €
                          </label>
                          <Input 
                            type="number" 
                            value={prezziPersonalizzati[key] ?? item.prezzo} 
                            onChange={(e) => cambiaPrezzo(key, +e.target.value)}
                            className="border-slate-300"
                          />
                        </div>
                      </>
                    )}

                    {!item.aCorpo && !item.aPezzo && !item.usaMc && !item.prezzoEditabile && (
                      <div>
                        <label className="text-sm font-medium text-slate-700 block mb-1">
                          Prezzo €/mq
                        </label>
                        <Input 
                          type="number" 
                          value={prezziPersonalizzati[key] ?? item.prezzo} 
                          onChange={(e) => cambiaPrezzo(key, +e.target.value)}
                          className="border-slate-300"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div id="pdf-root" className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
        {/* Header con navigazione */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <Button 
            variant="outline" 
            onClick={tornaIndietro}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna allo storico
          </Button>
          
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant="outline" 
              onClick={exportPDF}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Esporta PDF
            </Button>
            <Button 
              onClick={salva}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4" />
              Salva preventivo
            </Button>
          </div>
        </div>

        {/* Dati immobile */}
        <Card className="shadow-lg">
          <CardContent className="p-6 space-y-4">
            <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
              <Building2 className="w-6 h-6 text-blue-600" />
              Dati immobile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  Nome cliente
                </label>
                <Input 
                  placeholder="es. Mario Rossi" 
                  value={cliente} 
                  onChange={(e) => setCliente(e.target.value)}
                  className="border-slate-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  Superficie (mq)
                </label>
                <Input 
                  type="number" 
                  placeholder="100" 
                  value={superficieCasa} 
                  onChange={(e) => setSuperficieCasa(+e.target.value)}
                  className="border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  Piano
                </label>
                <Input 
                  type="number" 
                  placeholder="1" 
                  value={piano} 
                  onChange={(e) => setPiano(+e.target.value)}
                  className="border-slate-300"
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox 
                    checked={ascensore} 
                    onCheckedChange={(v) => setAscensore(!!v)}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <span className="text-sm font-medium text-slate-700">Ascensore presente</span>
                </label>
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox 
                    checked={accessoStrada} 
                    onCheckedChange={(v) => setAccessoStrada(!!v)}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <span className="text-sm font-medium text-slate-700">Accesso strada</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sezioni lavorazioni */}
        {renderSezione("Demolizioni", demolizioni, "demolizioni")}
        {renderSezione("Lavorazioni principali", lavorazioniBase, "lavorazioni")}
        {renderSezione("Voci avanzate", lavorazioniAvanzate, "avanzate")}

        {/* Totale fisso in basso */}
        <div className="sticky bottom-4">
          <Card className="shadow-2xl border-2 border-blue-200 bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <Calculator className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-slate-600">Totale preventivo</p>
                    <strong className="text-3xl font-bold text-blue-600">
                      € {calcolaTotale().toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                    </strong>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={exportPDF}
                    size="lg"
                    className="gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Esporta PDF
                  </Button>
                  <Button 
                    onClick={salva}
                    size="lg"
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="w-5 h-5" />
                    Salva preventivo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(App), { ssr: false });
