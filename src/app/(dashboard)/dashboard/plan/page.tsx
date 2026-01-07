import { plans } from '@/config/plans'
import PlanCard from '@/components/dashboard/plan/plan'

// Todo:サブスク購入した人はこの画面ではなく管理画面にリダイレクトするようにしたい。（useEffectを使って）

const Plan = () => {
  return (
    // タイトル
    <div className='container py-8 mx-auto'>
      <div className='mb-12 text-center'>
        <h1 className='text-4l font-bold'>料金プラン</h1>
        <p className='mt-4 text-muted-foreground text-lg'>あなたの料金プランに合わせて最適なプランをお選びください</p>
      </div>

      <div className='grid lg:grid-cols-3 gap-8 md:grid-cols-1 mx-auto max-w-7wl'>
        {plans.map((item) => (
          // キーはコンポーネント内に割り当てる
          <PlanCard key={item.name} plan={item} />
        ))}
      </div>
    </div>
  )
}

export default Plan