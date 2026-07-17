type AuthPanelProps = {
  apiStatus: string;
};

export function AuthPanel({ apiStatus }: AuthPanelProps) {
  const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN as string | undefined;

  function handleLogin() {
    if (!cognitoDomain) {
      alert('Configure VITE_COGNITO_DOMAIN para habilitar o Managed Login.');
      return;
    }

    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_COGNITO_APP_CLIENT_ID,
      response_type: 'code',
      scope: 'openid email profile',
      redirect_uri: import.meta.env.VITE_COGNITO_REDIRECT_URI,
    });
    window.location.href = `${cognitoDomain}/oauth2/authorize?${params.toString()}`;
  }

  return (
    <aside className="auth-panel" aria-label="Status da aplicação">
      <h2>Ambiente</h2>
      <dl>
        <dt>API</dt>
        <dd>{apiStatus}</dd>
        <dt>Auth</dt>
        <dd>{cognitoDomain ? 'Cognito' : 'pendente'}</dd>
      </dl>
      <button className="primary-button" type="button" onClick={handleLogin}>
        Entrar com Cognito
      </button>
      <p className="muted">Para desenvolvimento local da API, use Authorization: Bearer dev-token.</p>
    </aside>
  );
}
