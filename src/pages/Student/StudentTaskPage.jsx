// src/pages/StudentTaskPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import StudentHeader from '@/components/StudentHeader'
import BackButton    from '@/components/BackButton'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label }     from '@/components/ui/label'
import { Badge }     from '@/components/ui/badge'
import { Input }     from '@/components/ui/input'
import { Button }    from '@/components/ui/button'
import { getTask} from '@/api/tasks.js'
import { submitTask } from '@/api/taskSubmissions.js'

export default function StudentTaskPage() {
  const { courseId, taskId } = useParams()
  const [task,       setTask]       = useState(null)
  const [files,      setFiles]      = useState([])
  const [error,      setError]      = useState('')
  const [success,    setSuccess]    = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getTask(taskId)
      .then(data => setTask(data))
      .catch(() => setError('Не вдалося завантажити завдання'))
  }, [taskId])

  const handleFileChange = e => {
    setFiles(Array.from(e.target.files))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!files.length) return
    setSubmitting(true)
    setError('')
    try {
      await submitTask(taskId, files)
      setSuccess(true)
    } catch {
      setError('Помилка при відправці роботи')
    } finally {
      setSubmitting(false)
    }
  }

  if (!task) return null

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <StudentHeader />
      <div className="max-w-3xl mx-auto mt-8 px-6">
        <BackButton />

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Завдання: {task.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-300 dark:text-gray-200">
              {task.description}
            </p>

            {task.filesUrl?.length > 0 && (
              <div className="mb-4 space-x-2">
                <Label>Файли від викладача:</Label>
                {task.filesUrl.map(f => (
                  <a
                    key={f.id}
                    href={f.path}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Badge variant="secondary">{f.path.split('/').pop()}</Badge>
                  </a>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="studentFiles">Ваші файли</Label>
                <Input
                  id="studentFiles"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
              </div>
              {error    && <p className="text-red-500">{error}</p>}
              {success  && <p className="text-green-600">Ваша робота відправлена!</p>}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full"
              >
                {submitting ? 'Відправляємо…' : 'Відправити роботу'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
