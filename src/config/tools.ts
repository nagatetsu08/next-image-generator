import ImageGenerator from "@/components/dashboard/tools/image-generator";

export const  tools = {
    "image-generator": {
        title: "画像生成",
        description: "AIを使用してお好みの画像を生成",
        component: ImageGenerator
    },
    "remove-bg": {
        title: "背景削除",
        description: "画像から背景を削除",
        component: ImageGenerator
    },
    "optimize": {
        title: "画像最適化",
        description: "画像を最適化使用",
        component: ImageGenerator
    }
}

// オブジェクトから型抽出したい場合は以下のようにやるテクニックがある。
export type ToolType = keyof typeof tools