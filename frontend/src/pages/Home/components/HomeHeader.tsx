import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../../hooks/useAuth';
import { messages } from '../messages';

export function HomeHeader() {
    const intl = useIntl();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/', { replace: true });
    };

    return (
        <header className="glass relative overflow-hidden p-6 lg:p-8">
            <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-sky-300/20 blur-3xl" />
            <div className="absolute -bottom-12 left-1/3 h-44 w-44 rounded-full bg-amber-200/30 blur-3xl" />
            <div className="relative flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-sky-700/70">{intl.formatMessage(messages.billingConsole)}</p>
                    <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                        {intl.formatMessage(messages.pageTitle)}
                    </h1>
                    <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{intl.formatMessage(messages.pageDescription)}</p>
                </div>
                <button className="button button-secondary px-5 py-3" type="button" onClick={handleLogout}>
                    {intl.formatMessage(messages.signOut)}
                </button>
            </div>
        </header>
    );
}
