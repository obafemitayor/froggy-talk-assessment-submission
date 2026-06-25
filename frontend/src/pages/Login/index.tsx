import { useIntl } from 'react-intl';
import { Navigate, useNavigate } from 'react-router-dom';
import type { FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { messages } from './messages';

export default function LoginPage() {
    const navigate = useNavigate();
    const intl = useIntl();
    const { token, busy, error, setError, login } = useAuth();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);

        setError('');
        await login(String(form.get('email') ?? ''), String(form.get('password') ?? ''));
        navigate('/home', { replace: true });
    };

    if (token) {
        return <Navigate to="/home" replace />;
    }

    return (
        <main className="shell">
            <div className="mx-auto flex max-w-5xl flex-col gap-6">
                <header className="glass relative overflow-hidden p-6 lg:p-8">
                    <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-sky-300/20 blur-3xl" />
                    <div className="absolute -bottom-12 left-1/3 h-44 w-44 rounded-full bg-amber-200/30 blur-3xl" />
                    <div className="relative">
                        <p className="text-xs uppercase tracking-[0.4em] text-sky-700/70">{intl.formatMessage(messages.billingConsole)}</p>
                        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                            {intl.formatMessage(messages.pageTitle)}
                        </h1>
                        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{intl.formatMessage(messages.pageDescription)}</p>
                    </div>
                </header>

                <section className="glass p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.35em] text-sky-700/70">{intl.formatMessage(messages.accessLabel)}</p>
                            <h2 className="mt-2 text-2xl font-semibold text-slate-900">{intl.formatMessage(messages.title)}</h2>
                        </div>
                        <span className="chip">{intl.formatMessage(messages.rootRoute)}</span>
                    </div>

                    <form className="mt-5 grid gap-3 sm:grid-cols-2" onSubmit={handleSubmit}>
                        <div>
                            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.25em] text-slate-500">{intl.formatMessage(messages.emailLabel)}</label>
                            <input
                                name="email"
                                className="field"
                                type="email"
                                defaultValue="test@example.com"
                                placeholder={intl.formatMessage(messages.emailPlaceholder)}
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.25em] text-slate-500">{intl.formatMessage(messages.passwordLabel)}</label>
                            <input
                                name="password"
                                className="field"
                                type="password"
                                defaultValue="password"
                                placeholder={intl.formatMessage(messages.passwordPlaceholder)}
                            />
                        </div>
                        <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-2">
                            <button className="button button-primary px-5 py-3" type="submit" disabled={busy}>
                                {busy ? intl.formatMessage(messages.signingIn) : intl.formatMessage(messages.signIn)}
                            </button>
                        </div>
                    </form>

                    {error ? <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
                </section>
            </div>
        </main>
    );
}
