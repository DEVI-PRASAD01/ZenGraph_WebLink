import { useNavigate, useLocation } from "react-router";
import { ChevronLeft, Info, CheckCircle2, ArrowRight } from "lucide-react";

export default function SubscriptionConfirm() {
    const navigate = useNavigate();
    const location = useLocation();

    // Attempt to get plan from state, fallback to localStorage if needed
    const getPlan = () => {
        if (location.state?.plan) return location.state.plan;
        const saved = localStorage.getItem("zengraph_pending_plan");
        return saved ? JSON.parse(saved) : null;
    };

    const plan = getPlan();

    if (!plan) {
        return (
            <div className="p-8 text-center mt-20">
                <h2 className="text-2xl font-black text-gray-400">No plan selected</h2>
                <button onClick={() => navigate("/app/subscription/plans")} className="mt-4 text-[#6F7BF7] font-black underline">Go back to plans</button>
            </div>
        );
    }

    return (
        <div className="p-8 lg:p-12 max-w-2xl mx-auto animate-in fade-in duration-700" style={{ fontFamily: "Inter, sans-serif" }}>
            <div className="flex items-center gap-4 mb-10 animate-in slide-in-from-bottom-4 duration-700">
                <button
                    onClick={() => navigate("/app/subscription/plans")}
                    className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors hover:bg-gray-100 bg-white shadow-sm border border-gray-100"
                >
                    <ChevronLeft size={22} className="text-gray-700" />
                </button>
                <h2 className="text-[#1F2933] text-2xl font-black tracking-tight">Confirm Your Selection</h2>
            </div>

            <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl overflow-hidden relative animate-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-full -z-10" />

                <div className="mb-10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#6F7BF7] mb-2">Review Summary</p>
                    <h3 className="text-4xl font-black text-[#1F2933] mb-4">{plan.name}</h3>
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 inline-flex">
                        <CheckCircle2 size={18} className="text-green-500" />
                        <span className="font-black text-[#1F2933]">{plan.price} {plan.period}</span>
                    </div>
                </div>

                <div className="space-y-6 mb-12">
                    <div className="p-6 rounded-3xl bg-gray-50/50 border border-gray-50 space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-gray-400 uppercase tracking-widest text-[10px]">Subtotal</span>
                            <span className="text-gray-700">{plan.price}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-gray-400 uppercase tracking-widest text-[10px]">Taxes</span>
                            <span className="text-gray-700">₹0.00</span>
                        </div>
                        <div className="h-[1px] bg-gray-100 w-full" />
                        <div className="flex justify-between items-center text-xl font-black">
                            <span className="text-[#1F2933]">Total Due Today</span>
                            <span className="text-[#6F7BF7]">{plan.price}</span>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                        <Info size={18} className="text-blue-500 mt-1 shrink-0" />
                        <p className="text-blue-600 text-[11px] font-medium leading-relaxed">
                            You will be charged {plan.price} today. Your subscription will renew automatically every month. Cancel anytime in profile settings.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => navigate("/app/subscription/update-card", { state: { plan } })}
                        className="w-full py-5 rounded-[24px] bg-[#6F7BF7] text-white text-xl font-black shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                    >
                        Proceed to Payment <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={() => navigate("/app/subscription/plans")}
                        className="w-full py-5 rounded-[24px] text-gray-400 font-black hover:bg-gray-50 transition-all"
                    >
                        Change Plan
                    </button>
                </div>
            </div>
        </div>
    );
}
