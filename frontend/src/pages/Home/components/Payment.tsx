import type { FormEvent } from 'react';
import { useIntl } from 'react-intl';

import { messages } from '../messages';

export type PaymentProps = {
    status: string;
    onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

export function Payment({ status, onSubmit }: PaymentProps) {
    const intl = useIntl();
    const isPending = status === 'Pending';

    return (
        <article className="glass p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-sky-700/70">{intl.formatMessage(messages.paymentFlow)}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-900">{intl.formatMessage(messages.initiatePayment)}</h3>
                </div>
            </div>

            <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-xs font-medium uppercase tracking-[0.25em] text-slate-500">{intl.formatMessage(messages.amountLabel)}</label>
                        <input name="amount" className="field" type="number" min="0.01" step="0.01" defaultValue="10.00" inputMode="decimal" />
                    </div>
                    <div>
                        <label className="mb-2 block text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Currency</label>
                        <select name="currency" className="field" defaultValue="USD">
                            <option value="USD">USD</option>
                        </select>
                    </div>
                </div>

                <button
                    className="button button-primary w-fit px-5 py-3 disabled:cursor-not-allowed disabled:opacity-60"
                    type="submit"
                    disabled={isPending}
                    aria-disabled={isPending}
                >
                    {isPending ? intl.formatMessage(messages.processingPayment) : intl.formatMessage(messages.startPayment)}
                </button>
            </form>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{intl.formatMessage(messages.status)}</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{status}</p>
            </div>

        </article>
    );
}
