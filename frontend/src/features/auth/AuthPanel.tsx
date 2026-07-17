import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from 'react';

import { apiClient, User } from '../../services/apiClient';

type AuthMode = 'login' | 'register' | 'forgot' | 'reset' | 'change';
type AuthPanelProps = {
  apiStatus: string;
  user: User | null;
  onAuthenticated: Dispatch<SetStateAction<User | null>>;
  onLogout: () => void;
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

function initialMode(): AuthMode {
  return new URLSearchParams(window.location.search).has('reset_token') ? 'reset' : 'login';
}

export function AuthPanel({ apiStatus, user, onAuthenticated, onLogout }: AuthPanelProps) {
  const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN as string | undefined;
  const clientId = import.meta.env.VITE_COGNITO_APP_CLIENT_ID as string | undefined;
  const redirectUri = import.meta.env.VITE_COGNITO_REDIRECT_URI as string | undefined;
  const logoutUri = import.meta.env.VITE_COGNITO_LOGOUT_URI as string | undefined;
  const cognitoConfigured = Boolean(cognitoDomain && clientId && redirectUri);
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetUrl, setResetUrl] = useState('');
  const [pending, setPending] = useState(false);

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
        if (!response.ok) throw new Error('Falha ao concluir o login externo.');
        return response.json() as Promise<{ access_token: string }>;
      })
      .then(async (payload) => {
        localStorage.setItem(TOKEN_STORAGE_KEY, payload.access_token);
        sessionStorage.removeItem(VERIFIER_STORAGE_KEY);
        const authenticatedUser = await apiClient.me();
        onAuthenticated(authenticatedUser);
        window.history.replaceState({}, document.title, window.location.pathname);
      })
      .catch((callbackError: Error) => setError(callbackError.message));
  }, [clientId, cognitoDomain, onAuthenticated, redirectUri]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    setMessage('');

    try {
      if (mode === 'login') {
        const response = await apiClient.login({ email, password });
        localStorage.setItem(TOKEN_STORAGE_KEY, response.access_token);
        onAuthenticated(response.user);
      } else if (mode === 'register') {
        const response = await apiClient.register({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        });
        localStorage.setItem(TOKEN_STORAGE_KEY, response.access_token);
        onAuthenticated(response.user);
      } else if (mode === 'forgot') {
        const response = await apiClient.requestPasswordReset(email);
        setMessage(response.detail);
        setResetUrl(response.reset_url ?? '');
      } else if (mode === 'reset') {
        const token = new URLSearchParams(window.location.search).get('reset_token') ?? '';
        const response = await apiClient.confirmPasswordReset({
          token,
          password,
          password_confirmation: passwordConfirmation,
        });
        localStorage.setItem(TOKEN_STORAGE_KEY, response.access_token);
        window.history.replaceState({}, document.title, window.location.pathname);
        onAuthenticated(response.user);
      } else if (mode === 'change') {
        await apiClient.changePassword({
          current_password: currentPassword,
          password,
          password_confirmation: passwordConfirmation,
        });
        setCurrentPassword('');
        setPassword('');
        setPasswordConfirmation('');
        setMode('login');
        setMessage('Senha alterada com sucesso.');
      }
    } catch (submitError) {
      setError((submitError as Error).message);
    } finally {
      setPending(false);
    }
  }

  async function handleCognitoLogin() {
    if (!cognitoDomain || !clientId || !redirectUri) return;
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

  async function handleLogout() {
    try {
      if (localStorage.getItem(TOKEN_STORAGE_KEY)) {
        await apiClient.logout();
      }
    } catch {
      // A local logout still clears the client session when the API is unavailable.
    } finally {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      onLogout();
    }

    if (cognitoConfigured && cognitoDomain && clientId && logoutUri) {
      const params = new URLSearchParams({ client_id: clientId, logout_uri: logoutUri });
      window.location.href = `${cognitoDomain}/logout?${params.toString()}`;
    }
  }

  if (user) {
    return (
      <aside className="auth-panel" aria-label="Conta do usuario">
        <div className="auth-panel-heading">
          <div>
            <p className="eyebrow">Sessao ativa</p>
            <h2>{user.name || user.email}</h2>
          </div>
          <span className="online-dot" aria-label="API online" />
        </div>
        <dl>
          <dt>API</dt>
          <dd>{apiStatus}</dd>
          <dt>Email</dt>
          <dd>{user.email}</dd>
        </dl>
        {mode === 'change' ? (
          <form className="auth-form" onSubmit={handleSubmit}>
            <h3>Alterar senha</h3>
            <label>
              Senha atual
              <input
                name="current_password"
                required
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
            </label>
            <label>
              Nova senha
              <input
                name="password"
                minLength={8}
                required
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            <label>
              Confirmar nova senha
              <input
                name="password_confirmation"
                minLength={8}
                required
                type="password"
                value={passwordConfirmation}
                onChange={(event) => setPasswordConfirmation(event.target.value)}
              />
            </label>
            <button className="primary-button" disabled={pending} type="submit">
              Salvar nova senha
            </button>
            <button className="link-button" type="button" onClick={() => setMode('login')}>
              Cancelar
            </button>
          </form>
        ) : (
          <button className="secondary-button" type="button" onClick={() => setMode('change')}>
            Alterar senha
          </button>
        )}
        {message ? <p className="auth-message">{message}</p> : null}
        {error ? <p className="auth-error">{error}</p> : null}
        <button className="secondary-button" type="button" onClick={handleLogout}>
          Sair
        </button>
      </aside>
    );
  }

  return (
    <aside className="auth-panel" aria-label="Autenticacao">
      <p className="eyebrow">Acesso seguro</p>
      <h2>
        {mode === 'register'
          ? 'Criar conta'
          : mode === 'forgot'
            ? 'Recuperar senha'
            : mode === 'reset'
              ? 'Definir nova senha'
              : 'Entrar'}
      </h2>
      <p className="auth-api-status">
        API: <strong>{apiStatus}</strong>
      </p>
      <p className="muted">
        {mode === 'forgot'
          ? 'Enviaremos um link de redefinicao para o seu e-mail.'
          : mode === 'reset'
            ? 'Escolha uma senha nova para continuar.'
            : 'Acesse suas tarefas e colaboracoes.'}
      </p>

      {mode === 'login' || mode === 'register' ? (
        <div className="auth-tabs" role="tablist" aria-label="Acesso">
          <button
            className={mode === 'login' ? 'active' : ''}
            type="button"
            onClick={() => setMode('login')}
          >
            Entrar
          </button>
          <button
            className={mode === 'register' ? 'active' : ''}
            type="button"
            onClick={() => setMode('register')}
          >
            Criar conta
          </button>
        </div>
      ) : null}

      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === 'register' ? (
          <label>
            Nome
            <input
              name="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
        ) : null}
        {mode !== 'reset' ? (
          <label>
            E-mail
            <input
              autoComplete="email"
              name="email"
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
        ) : null}
        {mode === 'change' ? (
          <label>
            Senha atual
            <input
              required
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
            />
          </label>
        ) : null}
        {mode !== 'forgot' && mode !== 'login' ? (
          <label>
            {mode === 'register' ? 'Senha' : 'Nova senha'}
            <input
              autoComplete="new-password"
              minLength={8}
              name="password"
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
        ) : null}
        {mode === 'login' ? (
          <label>
            Senha
            <input
              autoComplete="current-password"
              name="password"
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
        ) : null}
        {mode === 'register' || mode === 'reset' || mode === 'change' ? (
          <label>
            Confirmar senha
            <input
              autoComplete="new-password"
              minLength={8}
              name="password_confirmation"
              required
              type="password"
              value={passwordConfirmation}
              onChange={(event) => setPasswordConfirmation(event.target.value)}
            />
          </label>
        ) : null}
        <button className="primary-button" disabled={pending} type="submit">
          {pending
            ? 'Aguarde...'
            : mode === 'forgot'
              ? 'Enviar link'
              : mode === 'reset'
                ? 'Redefinir senha'
                : mode === 'register'
                  ? 'Criar conta'
                  : 'Entrar'}
        </button>
      </form>

      {mode === 'login' ? (
        <button className="link-button" type="button" onClick={() => setMode('forgot')}>
          Esqueci minha senha
        </button>
      ) : null}
      {mode === 'forgot' || mode === 'reset' ? (
        <button className="link-button" type="button" onClick={() => setMode('login')}>
          Voltar para o login
        </button>
      ) : null}
      {resetUrl ? (
        <p className="auth-message">
          Link local gerado:{' '}
          <a href={resetUrl}>abrir redefinicao</a>
        </p>
      ) : null}
      {message ? <p className="auth-message">{message}</p> : null}
      {error ? <p className="auth-error">{error}</p> : null}

      {cognitoConfigured && mode === 'login' ? (
        <button className="secondary-button" type="button" onClick={handleCognitoLogin}>
          Entrar com provedor externo
        </button>
      ) : null}
    </aside>
  );
}
