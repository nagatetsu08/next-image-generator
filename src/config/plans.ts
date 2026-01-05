import { PlanItem } from "@/types/plans";

export const plans: PlanItem[] = [
    {
        name: "Starter",
        iconName: "sparkles",
        price: "¥1,000",
        description: "個人利用に最適なエントリープラン",
        features: [
            "月50クレジット付与",
            "基本的な画像生成",
            "メールサポート"
        ],
        buttonText: "Starterプランを選択",
        priceId: "price_1Slu3tRuXneiB2t3KYQhKyJV"
    },
    {
        name: "Pro",
        iconName: "rocket",
        price: "¥2,000",
        description: "プロフェッショナルな制作活動に",
        features: [
            "月100クレジット付与",
            "商用利用可能",
            "優先サポート",
            "メールサポート"
        ],
        buttonText: "Proプランを選択",
        priceId: "price_1Slu4IRuXneiB2t3dDPNmieO",
        recommend: true
    },
    {
        name: "Enterprise",
        iconName: "crown",
        price: "¥5,000",
        description: "ビジネス向けのソリューション",
        features: [
            "月300クレジット付与",
            "24時間優先サポート",
            "API利用・カスタマイズ可能",
            "メールサポート"
        ],
        buttonText: "Enterpriseプランを選択",
        priceId: "price_1Slu4gRuXneiB2t3t59tniKm"
    }
]

