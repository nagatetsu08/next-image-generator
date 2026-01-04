import { PlanItem } from "@/types/plans"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const PlanCard = ({ plan }: { plan: PlanItem }) => {
  
  const {
    name,
    description,
    icon: Icon, //JSXコンポーネントは大文字でないといけないので、ここでエイリアスを割り当てている。分割代入の:はエイリアス（as 〜）
    price,
    features,
    buttonText,
    recommend
  } = plan 

  return (
    <div className={`border rounded-xl bg-card p-8 shadow-sm flex flex-col ${recommend ? "ring-2 ring-primary scale-105" : ''}`}>
      {/* formのボタンを一番下に配置したいので、flex-1を使って、余白スペースを全部使って、びよーんと伸びろ */}
      <div className='space-y-6 flex-1'>
        <div className='space-y-4'>
          {recommend && (
            // w-fitは文字に横幅を合わせる
            <div className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary w-fit">人気プラン</div>
          )}
          <div className='flex items-center gap-2'>
            {Icon && <Icon className='size-6 text-primary'/>}
            <h2 className='text-2xl font-bold'>{name}</h2>
          </div>
          <p className='text-muted-foreground'>{description}</p>
        </div>
      
        <div className='flex items-baseline'> 
          <span className='text-4xl font-bold'>{price}</span>
          <span className='ml-2 text-muted-foreground'>/月</span>
        </div>
      
        {features && features.length > 0 && (
          <ul className='space-y-4 text-sm'>
            {features.map((feature, index) => (
              <li key={index} className='flex items-center gap-3'>
                <Check className='size-4 text-primary'/>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <form>
        <Button 
          className='w-full mt-8' 
          size={"lg"} 
          variant={recommend ? "default" : "outline"} 
          type='submit'
        >
          {buttonText}
        </Button>
      </form>
    </div>
  )
}

export default PlanCard