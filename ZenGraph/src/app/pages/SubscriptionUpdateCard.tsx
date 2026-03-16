import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { ChevronLeft, CreditCard, ShieldCheck, CheckCircle2, Ticket } from "lucide-react";

export default function SubscriptionUpdateCard() {
    const navigate = useNavigate();
    const location = useLocation();

    // Attempt to get plan from state, fallback to localStorage if needed
    const getPlan = () => {
        if (location.state?.plan) return location.state.plan;
        const saved = localStorage.getItem("zengraph_pending_plan");
        return saved ? JSON.parse(saved) : null;
    };

    const plan = getPlan();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            if (plan) {
                localStorage.setItem("zengraph_active_plan", JSON.stringify(plan));
            }
            setLoading(false);
            setSuccess(true);
            setTimeout(() => navigate("/app/profile"), 2000);
        }, 2000);
    };

    return (
        <div className="p-8 lg:p-12 max-w-3xl mx-auto animate-in fade-in duration-700" style={{ fontFamily: "Inter, sans-serif" }}>
            {/* Header */}
            <div className="flex items-center gap-4 mb-10 animate-in slide-in-from-bottom-4 duration-700">
                <button
                    onClick={() => navigate("/app/subscription/confirm", { state: { plan } })}
                    className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors hover:bg-gray-100 bg-white shadow-sm border border-gray-100"
                >
                    <ChevronLeft size={22} className="text-gray-700" />
                </button>
                <h2 className="text-[#1F2933] text-2xl font-black tracking-tight">Update Payment Method</h2>
            </div>

            <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl relative overflow-hidden animate-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
                {success ? (
                    <div className="text-center py-20 space-y-6 animate-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <CheckCircle2 size={48} className="text-green-500" />
                        </div>
                        <h3 className="text-3xl font-black text-[#1F2933]">{plan ? `${plan.name} Activated!` : 'Card Updated Successfully!'}</h3>
                        <p className="text-gray-500 font-medium">{plan ? `Your new ${plan.name} features are now available.` : 'Your subscription will continue without interruption.'}</p>
                        <p className="text-indigo-500 font-bold animate-pulse">Redirecting to profile...</p>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-10">
                        <div className="flex-1 space-y-12">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-3xl bg-indigo-50 flex items-center justify-center">
                                    <CreditCard size={32} className="text-[#6F7BF7]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-[#1F2933]">Payment Details</h3>
                                    <p className="text-gray-400 font-medium text-sm">{plan ? `Final step for your ${plan.name} plan` : 'Update your default payment method'}</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-2">Cardholder Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Alex Johnson"
                                            className="w-full px-6 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#6F7BF7] focus:bg-white outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300"
                                        />
                                    </div>

                                    <div className="group">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-2">Card Number</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                required
                                                placeholder="**** **** **** 4242"
                                                className="w-full px-6 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#6F7BF7] focus:bg-white outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300 tracking-widest"
                                            />
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
                                                <div className="w-8 h-5 bg-gray-200 rounded-sm" />
                                                <div className="w-8 h-5 bg-gray-300 rounded-sm" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="group">
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-2">Expiry Date</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="MM / YY"
                                                className="w-full px-6 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#6F7BF7] focus:bg-white outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300"
                                            />
                                        </div>
                                        <div className="group">
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-2">CVC</label>
                                            <input
                                                type="password"
                                                required
                                                placeholder="***"
                                                className="w-full px-6 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#6F7BF7] focus:bg-white outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 rounded-3xl bg-indigo-50/50 flex items-start gap-4">
                                    <ShieldCheck size={24} className="text-[#6F7BF7] mt-1 shrink-0" />
                                    <p className="text-gray-500 text-sm leading-relaxed font-medium">
                                        Your payment information is encrypted and securely processed by our payment provider. We do not store your full card details on our servers.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 rounded-[24px] bg-[#6F7BF7] text-white text-xl font-black shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        plan ? `Pay ${plan.price}` : "Save Changes"
                                    )}
                                </button>
                            </form>
                        </div>

                        {plan && (
                            <div className="lg:w-1/3 bg-gray-50/50 rounded-4xl p-8 h-fit border border-gray-100">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Payment Summary</h4>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-[#6F7BF7] flex items-center justify-center shrink-0">
                                            <Ticket size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="font-black text-[#1F2933]">{plan.name}</p>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Billed Monthly</p>
                                        </div>
                                    </div>
                                    <div className="h-[1px] bg-gray-100 w-full" />
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm font-bold">
                                            <span className="text-gray-400">Amount due</span>
                                            <span className="text-[#1F2933]">{plan.price}</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-bold">
                                            <span className="text-gray-400">GST (Simulated)</span>
                                            <span className="text-[#1F2933]">₹0.00</span>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Auto-Renewal Active</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
