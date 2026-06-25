import type { FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useBalance } from '../../hooks/useBalance';
import { usePaymentChannel } from '../../hooks/usePaymentChannel';
import { usePayments } from '../../hooks/usePayments';
import { Balance } from './components/Balance';
import { HomeHeader } from './components/HomeHeader';
import { Payment } from './components/Payment';

export default function HomePage() {
    const { token, customer } = useAuth();
    const { balance, error: balanceError, setBalance } = useBalance(token);
    const {status, setStatus, error: paymentsError, setError, initiatePayment} = usePayments(token);
    const { error: channelError, setError: setChannelError } = usePaymentChannel({
        token,
        customer,
        setBalance,
        setStatus,
    });

    const combinedError = balanceError || paymentsError || channelError || '';
    
    const handlePayment = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setError('');
        setChannelError('');
        await initiatePayment(Number(form.get('amount') ?? 0), String(form.get('currency') ?? 'USD'));
    };

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return (
        <main className="shell">
            <div className="mx-auto flex max-w-7xl flex-col gap-6">
                <HomeHeader />

                {combinedError ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{combinedError}</p> : null}

                <section className="grid gap-6">
                    <Balance balance={balance} />
                    <Payment status={status} onSubmit={handlePayment} />
                </section>
            </div>
        </main>
    );
}
