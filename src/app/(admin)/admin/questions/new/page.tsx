import { PageHeader } from '@/components/layout/PageHeader'
import { QuestionForm } from '@/modules/admin/components/QuestionForm'

export default function NewQuestionPage() {
  return (
    <div>
      <PageHeader
        title="Nueva pregunta"
        description="Completa los campos y revisa el preview a la derecha."
      />
      <QuestionForm />
    </div>
  )
}
