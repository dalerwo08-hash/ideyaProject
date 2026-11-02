import { useState, type FormEvent } from 'react'

type AuthMode = 'login' | 'register'
type FormMessage = {
  kind: 'error' | 'success'
  text: string
}

function Login() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [message, setMessage] = useState<FormMessage | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const payload = Object.fromEntries(formData.entries())

    try {
      const response = await fetch(mode === 'login' ? '/api/login' : '/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.status === 401 || response.status === 403) {
        setMessage({
          kind: 'error',
          text: 'Неверный email или пароль. Проверьте данные и попробуйте снова.',
        })
      } else if (response.status === 404) {
        setMessage({
          kind: 'error',
          text: `Ошибка 404: адрес ${mode === 'login' ? '/api/login' : '/api/register'} не найден. Проверьте, что сервер авторизации запущен и настроен.`,
        })
      } else if (!response.ok) {
        setMessage({
          kind: 'error',
          text: `Не удалось выполнить запрос (ошибка ${response.status}). Попробуйте ещё раз.`,
        })
      } else {
        setMessage({
          kind: 'success',
          text: mode === 'login' ? 'Вы успешно вошли в аккаунт.' : 'Регистрация прошла успешно.',
        })
      }
    } catch {
      setMessage({
        kind: 'error',
        text: 'Не удалось подключиться к серверу. Проверьте соединение и попробуйте ещё раз.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode)
    setMessage(null)
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <div className="auth-brand" aria-hidden="true">
          <span className="brand-mark">a</span>
          <span>amira</span>
        </div>

        <div className="auth-tabs" role="tablist" aria-label="Авторизация">
          <button
            className={`auth-tab ${mode === 'login' ? 'is-active' : ''}`}
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            onClick={() => changeMode('login')}
          >
            Вход
          </button>
          <button
            className={`auth-tab ${mode === 'register' ? 'is-active' : ''}`}
            type="button"
            role="tab"
            aria-selected={mode === 'register'}
            onClick={() => changeMode('register')}
          >
            Регистрация
          </button>
        </div>

        <h1 id="auth-title">{mode === 'login' ? 'С возвращением!' : 'Создать аккаунт'}</h1>
        <p className="auth-description">
          {mode === 'login'
            ? 'Войдите, чтобы продолжить и получить доступ к своему аккаунту.'
            : 'Заполните данные, чтобы создать новый аккаунт.'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label className="field">
              <span>Ваше имя</span>
              <input name="name" type="text" placeholder="Например, Амира" autoComplete="name" required />
            </label>
          )}
          <label className="field">
            <span>Email</span>
            <input
              name="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              required
            />
          </label>
          <label className="field">
            <span>Пароль</span>
            <input
              name="password"
              type="password"
              placeholder="Введите пароль"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={6}
              required
            />
          </label>

          {mode === 'login' && (
            <div className="form-options">
              <label className="remember-option">
                <input type="checkbox" name="remember" />
                <span>Запомнить меня</span>
              </label>
              <button
                className="text-button"
                type="button"
                onClick={() => setMessage({
                  kind: 'error',
                  text: 'Чтобы восстановить пароль, обратитесь в службу поддержки.',
                })}
              >
                Забыли пароль?
              </button>
            </div>
          )}

          {message && (
            <p className={`form-message ${message.kind}`} role={message.kind === 'error' ? 'alert' : 'status'}>
              {message.text}
            </p>
          )}

          <button className="submit-button" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Подождите...'
              : mode === 'login'
                ? 'Войти'
                : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'login' ? 'Ещё нет аккаунта?' : 'Уже есть аккаунт?'}
          {' '}
          <button
            className="text-button"
            type="button"
            onClick={() => changeMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Создать аккаунт' : 'Войти'}
          </button>
        </p>
      </section>
      <p className="page-note">Безопасный вход в ваш аккаунт</p>
    </main>
  )
}

export default Login
