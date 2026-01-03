import { getUserCredits } from "@/lib/credit"

const CreditDisplay = async() => {


  const credits = await getUserCredits();

  return (
    <div className="rounded-lg border bg-background p-4">
        <div className="test-sm font-medium text-muted-foreground">残りクレジット</div>
        <div className="mt-2 fonr-bold">{credits} クレジット</div>
    </div>
  )
}

export default CreditDisplay