import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Zap, Star, Shield, Check } from "lucide-react";

const plans = [
    {
        id: "basic",
        name: "Zen Basic",
        price: "₹499",
        period: "/month",
        features: ["Standard Audio Quality", "Limit of 3 Sessions/Day", "Basic Progress Tracking"],
        color: "#94A3B8",
        bg: "bg-slate-50",
    },
    {
        id: "premium",
        name: "Zen Pro",
        price: "₹699",
        period: "/month",
        features: ["HD Audio Quality", "Unlimited Sessions", "Advanced AI Analytics", "Offline Mode"],
        color: "#6F7BF7",
        bg: "bg-indigo-50",
        popular: true,
    },
    {
        id: "immersion",
        name: "Master ZenGraph",
        price: "₹829",
        period: "/month",
        features: ["Lossless Audio Quality", "1-on-1 AI Coaching", "Early Access to Features", "ZenMaster Profile Badge"],
        color: "#F97316",
        bg: "bg-orange-50",
    },
];

export default function SubscriptionPlans() {
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleSelectPlan = (plan: typeof plans[0]) => {
        setSelectedId(plan.id);
        localStorage.setItem("zengraph_pending_plan", JSON.stringify(plan));

        // Brief delay to let user see selection
        setTimeout(() => {
            navigate("/app/subscription/confirm", { state: { plan } });
        }, 500);
    };

    return (
        <div className="p-8 lg:p-12 max-w-6xl mx-auto animate-in fade-in duration-700" style={{ fontFamily: "Inter, sans-serif" }}>
            <div className="flex items-center gap-4 mb-10 animate-in slide-in-from-bottom-4 duration-700">
                <button
                    onClick={() => navigate("/app/profile")}
                    className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors hover:bg-gray-100 bg-white shadow-sm border border-gray-100"
                >
                    <ChevronLeft size={22} className="text-gray-700" />
                </button>
                <h2 className="text-[#1F2933] text-2xl font-black tracking-tight">Select Your Plan</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan, index) => {
                    const isSelected = selectedId === plan.id;
                    const isOtherSelected = selectedId !== null && !isSelected;

                    return (
                        <div
                            key={plan.id}
                            onClick={() => handleSelectPlan(plan)}
                            style={{ animationDelay: `${index * 150}ms` }}
                            className={`relative rounded-[40px] p-8 border-2 transition-all duration-500 flex flex-col cursor-pointer animate-in fade-in slide-in-from-bottom-8 fill-mode-both ${isSelected
                                    ? 'border-[#6F7BF7] bg-[#EEF0FF]/30 scale-[1.05] shadow-2xl z-20 ring-4 ring-indigo-50'
                                    : plan.popular && !isOtherSelected
                                        ? 'border-[#6F7BF7] shadow-xl scale-102 z-10 bg-white'
                                        : 'border-white bg-white hover:border-gray-100 hover:shadow-lg opacity-90 hover:opacity-100'
                                }`}
                        >
                            {plan.popular && (
                                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-colors duration-300 ${isSelected || !isOtherSelected ? 'bg-[#6F7BF7]' : 'bg-gray-400'}`}>
                                    Most Popular
                                </div>
                            )}

                            <div className={`w-16 h-16 rounded-3xl ${plan.bg} flex items-center justify-center mb-6 transition-transform duration-500 ${isSelected ? 'scale-110 rotate-3' : ''}`}>
                                {plan.id === 'basic' ? <Shield style={{ color: plan.color }} /> : plan.id === 'premium' ? <Zap style={{ color: plan.color }} /> : <Star style={{ color: plan.color }} />}
                            </div>

                            <h3 className="text-2xl font-black text-[#1F2933] mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-4xl font-black text-[#1F2933]">{plan.price}</span>
                                <span className="text-gray-400 font-bold">{plan.period}</span>
                            </div>

                            <div className="space-y-4 mb-10 flex-1">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-start gap-3">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                                            <Check size={12} className="text-green-500" />
                                        </div>
                                        <span className="text-gray-600 font-medium text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                className={`w-full py-4 rounded-2xl font-black transition-all duration-300 ${isSelected || (plan.popular && !isOtherSelected) ? 'bg-[#6F7BF7] text-white shadow-lg' : 'bg-gray-50 text-gray-400'}`}
                            >
                                {isSelected ? 'Processing...' : `Choose ${plan.name}`}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
