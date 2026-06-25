import { useIntl } from 'react-intl';

import { money } from '../../../utils/format';
import { messages } from '../messages';

export type BalanceProps = {
    balance: { amountCents: number; currency: string };
};

export function Balance({ balance }: BalanceProps) {
    const intl = useIntl();

    return (
        <article className="glass p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-sky-700/70">{intl.formatMessage(messages.paymentBalance)}</p>
            <div className="mt-4 rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-amber-50 p-6">
                <div className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">{money(balance.amountCents, balance.currency)}</div>
                <div className="mt-2 text-sm text-slate-500">{balance.currency}</div>
            </div>
        </article>
    );
}
