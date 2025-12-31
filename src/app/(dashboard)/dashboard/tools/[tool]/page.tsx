import PageContainer from '@/components/dashboard/page-container';
import PageHeader from '@/components/dashboard/tools/page-header';
import { ToolType, tools } from '@/config/tools';
import { notFound } from 'next/navigation';


// next15からパラメータ取得が非同期になったので以下のような書き方になってるので注意
const ToolPage = async({params}: {params: Promise<{tool: string}> }) => {

  const toolType = (await params).tool as ToolType;
  const tool = tools[toolType];

  if (!tool) {
    notFound();
  }

  const ToolComponent = tool.component

  return (
    <PageContainer>
      <PageHeader title={tool.title} description={tool.description} />
      <div className='max-w-2xl'>
        <ToolComponent />
      </div>
    </PageContainer>
  )
}

export default ToolPage