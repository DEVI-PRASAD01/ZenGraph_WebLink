import { useState, useEffect } from "react";

export interface Plan {
    id: string;
    name: string;
    price: string;
    period: string;
    features: string[];
}

export function useSubscription() {
    const [activePlan, setActivePlan] = useState<Plan | null>(null);

    useEffect(() => {
        const checkSubscription = () => {
            const savedPlan = localStorage.getItem("zengraph_active_plan");
            if (savedPlan) {
                try {
                    setActivePlan(JSON.parse(savedPlan));
                } catch (e) {
                    console.error("Failed to parse subscription plan", e);
                    setActivePlan(null);
                }
            } else {
                setActivePlan(null);
            }
        };

        checkSubscription();

        // Listen for storage changes in other tabs
        window.addEventListener("storage", checkSubscription);
        return () => window.removeEventListener("storage", checkSubscription);
    }, []);

    const isPremium = !!activePlan;

    const isMaster = activePlan?.id === "immersion";
    const isPro = activePlan?.id === "premium";
    const isBasic = activePlan?.id === "basic";

    return {
        activePlan,
        isPremium,
        isMaster,
        isPro,
        isBasic,
        planName: activePlan?.name || "Free Plan",
    };
}
