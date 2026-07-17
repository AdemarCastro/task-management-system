import { useEffect, useState } from 'react';

type AuthPanelProps = {
  apiStatus: string;
};

const TOKEN_STORAGE_KEY = 'access_token';
const VERIFIER_STORAGE_KEY = 'pkce_code_verifier';

function randomString() {
  const bytes = new Uint8Array(32);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function base64Url(buffer: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function codeChallenge(verifier: string) {
  const encoded = new TextEncoder().encode(verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', encoded);
  return base64Url(digest);
}

export function AuthPanel({ apiStatus }: AuthPanelProps) {
  const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN as string | undefined;
  const clientId = import.meta.env.VITE_COGNITO_APP_CLIENT_ID as string | undefined;
  const redirectUri = import.meta.env.VITE_COGNITO_REDIRECT_URI as string | undefined;
  const logoutUri = import.meta.env.VITE_COGNITO_LOGOUT_URI as string | undefined;
  const [authStatus, setAuthStatus] = useState(
    localStorage.getItem(TOKEN_STORAGE_KEY) ? 'token ativo' : 'dev-token',
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const verifier = sessionStorage.getItem(VERIFIER_STORAGE_KEY);

    if (!code || !verifier || !cognitoDomain || !clientId || !redirectUri) {
      return;
    }

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      code,
      redirect_uri: redirectUri,
      code_verifier: verifier,
    });

    fetch(`${cognitoDomain}/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
      .then((response) => {
        if (!response.ok) throw new Error('Token exchange failed');
        return response.json() as Promise<{ access_token: string }>;
      })
      .then((payload) => {
        localStorage.setItem(TOKEN_STORAGE_KEY, payload.access_token);
        sessionStorage.removeItem(VERIFIER_STORAGE_KEY);
        setAuthStatus('token ativo');
        window.history.replaceState({}, document.title, window.location.pathname);
      })
      .catch(() => setAuthStatus('falha no login'));
  }, [clientId, cognitoDomain, redirectUri]);

  async function handleLogin() {
    if (!cognitoDomain || !clientId || !redirectUri) {
      setAuthStatus('dev-token');
      return;
    }

    const verifier = randomString();
    sessionStorage.setItem(VERIFIER_STORAGE_KEY, verifier);
    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      scope: 'openid email profile',
      redirect_uri: redirectUri,
      code_challenge: await codeChallenge(verifier),
      code_challenge_method: 'S256',
    });
    window.location.href = `${cognitoDomain}/oauth2/authorize?${params.toString()}`;
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setAuthStatus('dev-token');

    if (cognitoDomain && clientId && logoutUri) {
      const params = new URLSearchParams({ client_id: clientId, logout_uri: logoutUri });
      window.location.href = `${cognitoDomain}/logout?${params.toString()}`;
    }
  }

  return (
    <aside className="auth-panel" aria-label="Status da aplicacao">
      <h2>Ambiente</h2>
      <dl>
        <dt>API</dt>
        <dd>{apiStatus}</dd>
        <dt>Auth</dt>
        <dd>{cognitoDomain ? 'Cognito' : authStatus}</dd>
      </dl>
      <button className="primary-button" type="button" onClick={handleLogin}>
        Entrar com Cognito
      </button>
      <button className="secondary-button" type="button" onClick={handleLogout}>
        Sair
      </button>
    </aside>
  );
}
