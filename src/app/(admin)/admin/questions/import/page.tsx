import { PageHeader } from '@/components/layout/PageHeader'
import { ImportWizard } from '@/modules/admin/components/ImportWizard'

export default function ImportQuestionsPage() {
  return (
    <div>
      <PageHeader
        title="Importar preguntas desde XLSX"
        description="Sube un archivo Excel y revisa el preview antes de confirmar."
      />
      <ImportWizard />
    </div>
  )
}
