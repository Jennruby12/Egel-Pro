import Link from 'next/link'
import { Plus, Upload } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/PageHeader'
import { QuestionsTable } from '@/modules/admin/components/QuestionsTable'

export default async function AdminQuestionsPage() {
  const supabase = await createClient()
  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
    .limit(500)

  return (
    <div>
      <PageHeader
        title="Banco de preguntas"
        description="Crea, edita y publica las preguntas que veran los estudiantes."
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/admin/questions/import">
                <Upload className="h-4 w-4" />
                Importar XLSX
              </Link>
            </Button>
            <Button asChild>
              <Link href="/admin/questions/new">
                <Plus className="h-4 w-4" />
                Nueva pregunta
              </Link>
            </Button>
          </>
        }
      />

      <QuestionsTable rows={questions ?? []} />
    </div>
  )
}
