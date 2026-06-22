'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  questionFormSchema,
  type QuestionFormInput,
} from '@/lib/validations/question.schema'
import { createQuestion, updateQuestion } from '@/modules/admin/actions'
import { QuestionPreview } from './QuestionPreview'
import { DISCIPLINAR_AREAS, TRANSVERSAL_AREAS } from '@/lib/constants/egel'
import type { Tables } from '@/types/database'

type Props = {
  initialData?: Tables<'questions'> | null
}

const EMPTY_DEFAULTS: QuestionFormInput = {
  section: 'disciplinar',
  area: 1,
  area_name: 'Analisis de Sistemas de Software',
  subarea: 1,
  subarea_name: 'Tipos de requerimientos',
  type: 'single',
  stimulus_id: '',
  question_text: '',
  option_a: '',
  option_b: '',
  option_c: '',
  correct_answer: 'a',
  explanation: '',
  difficulty: 'medium',
  tags: [],
  is_active: true,
  is_pilot: false,
  diagram: '',
  image_url: '',
  option_a_image: '',
  option_b_image: '',
  option_c_image: '',
  option_a_diagram: '',
  option_b_diagram: '',
  option_c_diagram: '',
}

function fromExisting(q: Tables<'questions'>): QuestionFormInput {
  return {
    section: (q.section as 'disciplinar' | 'transversal') ?? 'disciplinar',
    area: q.area,
    area_name: q.area_name,
    subarea: q.subarea,
    subarea_name: q.subarea_name,
    type: (q.type as 'single' | 'multireactivo') ?? 'single',
    stimulus_id: q.stimulus_id ?? '',
    question_text: q.question_text,
    option_a: q.option_a,
    option_b: q.option_b,
    option_c: q.option_c,
    correct_answer: q.correct_answer as 'a' | 'b' | 'c',
    explanation: q.explanation ?? '',
    difficulty: (q.difficulty as 'easy' | 'medium' | 'hard') ?? 'medium',
    tags: q.tags ?? [],
    is_active: q.is_active ?? true,
    is_pilot: q.is_pilot ?? false,
    diagram: q.diagram ?? '',
    image_url: q.image_url ?? '',
    option_a_image: q.option_a_image ?? '',
    option_b_image: q.option_b_image ?? '',
    option_c_image: q.option_c_image ?? '',
    option_a_diagram: q.option_a_diagram ?? '',
    option_b_diagram: q.option_b_diagram ?? '',
    option_c_diagram: q.option_c_diagram ?? '',
  }
}

export function QuestionForm({ initialData }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const isEdit = Boolean(initialData)

  const form = useForm<QuestionFormInput>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: initialData ? fromExisting(initialData) : EMPTY_DEFAULTS,
  })

  // Watch para preview en vivo
  const values = form.watch()

  // Autocompletar area_name/subarea_name al cambiar section/area/subarea
  function syncAreaNames(section: 'disciplinar' | 'transversal', area: number, subarea: number) {
    const source = section === 'disciplinar' ? DISCIPLINAR_AREAS : TRANSVERSAL_AREAS
    const a = source.find((x) => x.area === area)
    if (a) form.setValue('area_name', a.name)
    const sub = a?.subareas.find((s) => s.subarea === subarea)
    if (sub) form.setValue('subarea_name', sub.name)
  }

  function onSubmit(input: QuestionFormInput) {
    startTransition(async () => {
      const result = isEdit && initialData
        ? await updateQuestion(initialData.id, input)
        : await createQuestion(input)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success(isEdit ? 'Pregunta actualizada' : 'Pregunta creada')
      router.push('/admin/questions')
      router.refresh()
    })
  }

  const [showPreview, setShowPreview] = useState(true)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Section + Area + Subarea */}
          <div className="grid grid-cols-3 gap-3">
            <FormField
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      onChange={(e) => {
                        const s = e.target.value as 'disciplinar' | 'transversal'
                        field.onChange(s)
                        syncAreaNames(s, values.area, values.subarea)
                      }}
                    >
                      <option value="disciplinar">Disciplinar</option>
                      <option value="transversal">Transversal</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={4}
                      {...field}
                      onChange={(e) => {
                        const v = Number(e.target.value)
                        field.onChange(v)
                        syncAreaNames(values.section, v, values.subarea)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subarea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subarea</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={5}
                      {...field}
                      onChange={(e) => {
                        const v = Number(e.target.value)
                        field.onChange(v)
                        syncAreaNames(values.section, values.area, v)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="area_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del area</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subarea_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de la subarea</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pregunta */}
          <FormField
            control={form.control}
            name="question_text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Texto de la pregunta</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Opciones — texto + media opcional (imagen/diagrama) por opcion */}
          {(['a', 'b', 'c'] as const).map((letter) => (
            <div key={letter} className="space-y-2 rounded-md border border-bg-border p-3">
              <FormField
                control={form.control}
                name={`option_${letter}` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opcion {letter.toUpperCase()}</FormLabel>
                    <FormControl>
                      <Textarea rows={2} {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormDescription>
                      Texto de la opcion. Puede quedar vacio si la opcion es una imagen o diagrama.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-2 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`option_${letter}_image` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">Imagen (URL)</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://..." {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`option_${letter}_diagram` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">Diagrama (Mermaid)</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={2}
                          placeholder={'classDiagram\n  class A'}
                          className="font-mono text-xs"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}

          {/* Respuesta + dificultad + active */}
          <div className="grid grid-cols-3 gap-3">
            <FormField
              control={form.control}
              name="correct_answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Respuesta correcta</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="a">A</option>
                      <option value="b">B</option>
                      <option value="c">C</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dificultad</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="easy">Facil</option>
                      <option value="medium">Media</option>
                      <option value="hard">Dificil</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Activa</FormLabel>
                  <FormControl>
                    <label className="flex h-10 items-center gap-2">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 accent-primary"
                      />
                      <span className="text-sm text-muted-foreground">
                        {field.value ? 'Si' : 'No'}
                      </span>
                    </label>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Explicacion */}
          <FormField
            control={form.control}
            name="explanation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Explicacion</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} value={field.value ?? ''} />
                </FormControl>
                <FormDescription>Aparece al revisar las respuestas</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Diagrama UML (Mermaid) opcional */}
          <FormField
            control={form.control}
            name="diagram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diagrama UML (Mermaid) — opcional</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder={'classDiagram\n  class Pedido {\n    +int folio\n    +calcularTotal() float\n  }'}
                    className="font-mono text-xs"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormDescription>
                  Notacion Mermaid (classDiagram, sequenceDiagram, flowchart). Se renderiza en el enunciado.{' '}
                  <a href="/study/uml" target="_blank" className="text-aurora-2 hover:underline">
                    Abrir visualizador
                  </a>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Imagen del enunciado (URL) opcional */}
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagen del enunciado (URL) — opcional</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://..."
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormDescription>URL absoluta de una imagen (diagrama, captura, etc.)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowPreview((v) => !v)}
            >
              {showPreview ? 'Ocultar preview' : 'Mostrar preview'}
            </Button>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="animate-spin" />}
              {isEdit ? 'Guardar cambios' : 'Crear pregunta'}
            </Button>
          </div>
        </form>
      </Form>

      {showPreview ? (
        <div className="lg:sticky lg:top-20 lg:self-start">
          <QuestionPreview
            area={values.area}
            subarea={values.subarea}
            questionText={values.question_text}
            optionA={values.option_a ?? ''}
            optionB={values.option_b ?? ''}
            optionC={values.option_c ?? ''}
            correctAnswer={values.correct_answer}
            difficulty={values.difficulty}
            explanation={values.explanation}
            diagram={values.diagram}
            imageUrl={values.image_url}
            optionAImage={values.option_a_image}
            optionBImage={values.option_b_image}
            optionCImage={values.option_c_image}
            optionADiagram={values.option_a_diagram}
            optionBDiagram={values.option_b_diagram}
            optionCDiagram={values.option_c_diagram}
          />
        </div>
      ) : null}
    </div>
  )
}
