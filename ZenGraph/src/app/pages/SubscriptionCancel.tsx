import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Info, XCircle, Heart, ShieldAlert } from "lucide-react";

export default function SubscriptionCancel() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const reasons = [
        "Too expensive",
        "Not using it enough",
        "Missing specific features",
        "Technical issues",
        "Switching to another app",
        "Other",
    ];

    return (
        <div className="p-8 lg:p-12 max-w-3xl mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>
            {/* Header */}
            <div className="flex items-center gap-4 mb-10">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors hover:bg-gray-100 bg-white shadow-sm border border-gray-100"
                >
                    <ChevronLeft size={22} className="text-gray-700" />
                </button>
                <h2 className="text-[#1F2933] text-2xl font-black tracking-tight">Manage Subscription</h2>
            </div>

            <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl relative overflow-hidden">
                {step === 1 ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mb-8">
                            <ShieldAlert size={40} className="text-orange-500" />
                        </div>
                        <h3 className="text-3xl font-black text-[#1F2933] mb-4 leading-tight">Wait! You'll lose access to your premium benefits</h3>
                        <p className="text-gray-500 font-medium mb-10">Cancelling your plan will remove access to the following features at the end of your billing cycle:</p>

                        <div className="space-y-4 mb-12">
                            {[
                                "Unlimited Guided Meditations",
                                "Advanced AI Progress Analytics",
                                "Personalized AI Meditation Coach",
                                "Offline Mode & High Quality Audio",
                                "Exclusive ZenMaster Badges",
                            ].map((benefit) => (
                                <div key={benefit} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                                        <XCircle size={14} className="text-red-500" />
                                    </div>
                                    <span className="font-bold text-gray-700">{benefit}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => setStep(2)}
                                className="w-full py-5 rounded-[24px] border-2 border-gray-100 text-red-500 font-black hover:bg-red-50 transition-all flex items-center justify-center gap-3"
                            >
                                Proceed to Cancel
                            </button>
                            <button
                                onClick={() => navigate("/app/profile")}
                                className="w-full py-5 rounded-[24px] bg-[#6F7BF7] text-white text-xl font-black shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >
                                <Heart size={20} className="fill-white" /> Keep My Plan
                            </button>
                        </div>
                    </div>
                ) : step === 2 ? (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <h3 className="text-3xl font-black text-[#1F2933] mb-4 leading-tight">We're sorry to see you go</h3>
                        <p className="text-gray-500 font-medium mb-10">Please let us know why you're cancelling so we can improve ZenGraph.</p>

                        <div className="grid grid-cols-1 gap-4 mb-12">
                            {reasons.map((reason) => (
                                <button
                                    key={reason}
                                    className="w-full p-5 rounded-2xl border-2 border-gray-50 hover:border-[#6F7BF7] hover:bg-indigo-50 transition-all text-left font-bold text-gray-600 focus:border-[#6F7BF7] focus:bg-indigo-50 outline-none"
                                >
                                    {reason}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => setStep(3)}
                                className="w-full py-5 rounded-[24px] bg-red-500 text-white text-xl font-black shadow-xl shadow-red-100 hover:bg-red-600 transition-all flex items-center justify-center gap-3"
                            >
                                Confirm Cancellation
                            </button>
                            <button
                                onClick={() => setStep(1)}
                                className="w-full py-5 rounded-[24px] text-gray-400 font-black hover:bg-gray-50 transition-all"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 space-y-6 animate-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Info size={48} className="text-gray-400" />
                        </div>
                        <h3 className="text-3xl font-black text-[#1F2933]">Subscription Cancelled</h3>
                        <p className="text-gray-500 font-medium leading-relaxed px-10">
                            Your subscription has been cancelled. You will still have access to premium features until <strong>April 6, 2026</strong>.
                        </p>
                        <div className="pt-8">
                            <button
                                onClick={() => navigate("/app/profile")}
                                className="px-10 py-4 rounded-2xl bg-gray-100 text-gray-600 font-black hover:bg-gray-200 transition-all"
                            >
                                Back to Profile
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-8 flex items-center gap-3 p-6 rounded-3xl bg-indigo-50/30 border border-indigo-50">
                <Info size={20} className="text-indigo-400 shrink-0" />
                <p className="text-indigo-400 text-sm font-medium">Once cancelled, you won't be charged again. You can reactivate at any time from your settings.</p>
            </div>
        </div>
    );
}
