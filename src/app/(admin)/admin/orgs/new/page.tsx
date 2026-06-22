import { PageHeader } from '@/components/layout/PageHeader'
import { OrgForm } from '@/modules/admin/components/OrgForm'

export default function NewOrgPage() {
  return (
    <div>
      <PageHeader title="Nueva organizacion" description="Despues podras asignar su owner y coordinadores." />
      <OrgForm />
    </div>
  )
}
