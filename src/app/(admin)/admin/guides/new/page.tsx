import { PageHeader } from '@/components/layout/PageHeader'
import { GuideForm } from '@/modules/admin/components/GuideForm'

export default function NewGuidePage() {
  return (
    <div>
      <PageHeader
        title="Nueva guia"
        description="Crea una guia de estudio en Markdown para una subarea del EGEL."
      />
      <GuideForm />
    </div>
  )
}
