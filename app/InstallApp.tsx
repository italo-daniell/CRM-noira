"use client";

import { useEffect, useRef, useState } from "react";
import { Download, X } from "lucide-react";
import "./pwa.css";

type InstallPrompt = Event & {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallApp() {
  return <button type="button" className="noira-install" onClick={() => window.dispatchEvent(new Event("noira-install"))}><Download size={17} aria-hidden="true"/><span>Instalar NOIRA</span></button>;
}

export function AppRuntime() {
  const prompt = useRef<InstallPrompt | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [installed, setInstalled] = useState(false);
  const [available, setAvailable] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setInstalled(window.matchMedia("(display-mode: standalone)").matches);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => {
        // Installation and online navigation can still work without offline support.
      });
    }
    const beforeInstall = (event: Event) => { event.preventDefault(); prompt.current = event as InstallPrompt; setAvailable(true); };
    const completed = () => { prompt.current = null; setAvailable(false); setInstalled(true); };
    const show = () => dialog.current?.showModal();
    const offline = () => setNotice("Sem conexão. Reconecte para abrir outras telas. Seus dados locais permanecem neste dispositivo.");
    const online = () => setNotice("");
    const storageError = () => setNotice("O navegador não conseguiu salvar os dados. Verifique o espaço disponível e a permissão de armazenamento antes de fechar.");
    window.addEventListener("beforeinstallprompt", beforeInstall);
    window.addEventListener("appinstalled", completed);
    window.addEventListener("noira-install", show);
    window.addEventListener("noira-storage-error", storageError);
    window.addEventListener("offline", offline);
    window.addEventListener("online", online);
    if (!navigator.onLine) offline();
    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstall);
      window.removeEventListener("appinstalled", completed);
      window.removeEventListener("noira-install", show);
      window.removeEventListener("noira-storage-error", storageError);
      window.removeEventListener("offline", offline);
      window.removeEventListener("online", online);
    };
  }, []);

  async function install() {
    const event = prompt.current;
    if (!event || busy) return;
    setBusy(true);
    try {
      await event.prompt();
      const result = await event.userChoice;
      prompt.current = null;
      setAvailable(false);
      if (result.outcome === "accepted") setInstalled(true);
    } catch { setNotice("Use a opção Instalar aplicativo no menu do navegador."); }
    finally { setBusy(false); }
  }

  return <>
    {notice && <aside className="noira-device-notice" role="status"><span>{notice}</span><button type="button" aria-label="Fechar aviso" onClick={() => setNotice("")}><X size={18}/></button></aside>}
    <dialog ref={dialog} className="noira-install-dialog" aria-labelledby="install-title">
      <button type="button" className="noira-dialog-close" aria-label="Fechar instalação" onClick={() => dialog.current?.close()}><X size={20}/></button>
      <img src="/icons/icon-192.png" width="64" height="64" alt="NOIRA"/>
      <small>NOIRA CRM · APLICATIVO</small>
      <h2 id="install-title">{installed ? "Seu NOIRA está pronto" : "Seu CRM, a um toque"}</h2>
      <p>Abra o painel direto pelo ícone do NOIRA no computador ou celular, sem a tela de entrada.</p>
      {available && !installed ? <button type="button" className="noira-install-primary" disabled={busy} onClick={install}>{busy ? "Abrindo instalação…" : "Instalar aplicativo"}</button> : <div className="noira-install-help">{installed ? "O aplicativo já está instalado ou aberto em uma janela própria." : <><b>No computador ou Android:</b> use “Instalar aplicativo” ou “Adicionar à tela inicial” no menu do navegador.<br/><br/><b>No iPhone ou iPad:</b> abra no Safari, toque em Compartilhar e em “Adicionar à Tela de Início”.</>}</div>}
      <p className="noira-device-note">Acesso direto temporário. Os registros de exemplo e suas alterações ficam neste navegador. Não há sincronização entre dispositivos nesta versão.</p>
    </dialog>
  </>;
}
