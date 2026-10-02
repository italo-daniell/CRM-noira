import "../auth.css";

export default function DashboardLoading() {
  return (
    <main className="auth-loading-screen" aria-live="polite" aria-busy="true">
      <span className="auth-spinner" />
      <p>Carregando sua conta NOIRA…</p>
    </main>
  );
}
