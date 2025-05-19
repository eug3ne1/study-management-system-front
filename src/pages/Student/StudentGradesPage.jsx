// src/pages/StudentGradesPage.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate }               from 'react-router-dom'
import StudentHeader                 from '@/components/StudentHeader.jsx'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label }                     from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Button }                    from '@/components/ui/button'
import { getStudentCourses }         from '@/api/course.js'
import { getStudentTestGrades, getStudentTaskGrades } from '@/api/grades.js'
import BackButton from '@/components/BackButton.jsx'

export default function StudentGradesPage() {
  const navigate = useNavigate()

  // Список курсів, вибраний курс
  const [courses, setCourses]           = useState([])
  const [selectedCourseId, setSelectedCourseId] = useState('')

  // Дані оцінок
  const [testGrades, setTestGrades]     = useState([])
  const [taskGrades, setTaskGrades]     = useState([])

  const [loadingCourses, setLoadingCourses] = useState(true)
  const [loadingGrades,  setLoadingGrades]  = useState(false)
  const [error, setError]                 = useState('')

  // Підвантажити курси студента
  useEffect(() => {
    getStudentCourses()
      .then(c => setCourses(c))
      .catch(() => setError('Не вдалося завантажити курси'))
      .finally(() => setLoadingCourses(false))
  }, [])

  // Коли змінився курс — підвантажити оцінки
  useEffect(() => {
    if (!selectedCourseId) return
    setLoadingGrades(true)
    Promise.all([
        getStudentTestGrades(selectedCourseId),
        getStudentTaskGrades(selectedCourseId)
    ])
      .then(([tg, kg]) => {
        setTestGrades(tg)
        setTaskGrades(kg)
      })
      .catch(() => setError('Не вдалося завантажити оцінки'))
      .finally(() => setLoadingGrades(false))
  }, [selectedCourseId])

  // Об’єднані рядки — спочатку тести, потім завдання
  const rows = [
    ...testGrades.map(g => ({
      key: `test-${g.test.id}`,
      name: g.test.name,
      grade: g.grade
    })),
    ...taskGrades.map(g => ({
      key: `task-${g.task.id}`,
      name: g.task.title,
      grade: g.grade
    }))
  ]

  // Обчислити загальну оцінку
  const totalGrade = rows.reduce((sum, r) => sum + (r.grade || 0), 0)

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <StudentHeader />

      <div className="max-w-5xl mx-auto mt-16 flex items-start space-x-6 px-6">
        <BackButton/>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Мої оцінки</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && <p className="text-red-500">{error}</p>}

            <div>
              <Label htmlFor="course">Оберіть курс</Label>
              <Select
                id="course"
                value={selectedCourseId}
                onValueChange={setSelectedCourseId}
                disabled={loadingCourses}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={loadingCourses ? 'Завантаження…' : 'Немає курсів'} />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(c => (
                    <SelectItem
                      key={c.id}
                      value={String(c.id)}
                      className="flex items-center space-x-5"
                    >
                      <span className="font-medium">{c.name}</span>
                
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCourseId && (
              loadingGrades
                ? <p>Завантаження оцінок…</p>
                : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border">
                      <thead>
                        <tr className="bg-gray-800 dark:bg-gray-800">
                          <th className="px-4 py-2 text-left text-white">Назва</th>
                          <th className="px-4 py-2 text-left text-white">Оцінка</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.length > 0 ? rows.map(row => (
                          <tr key={row.key} className="hover:bg-gray-700 dark:hover:bg-gray-700">
                            <td className="border px-4 py-2">{row.name}</td>
                            <td className="border px-4 py-2">{row.grade}</td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={2} className="px-4 py-2 text-center text-gray-500">
                              Оцінок ще немає
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )
            )}

              {selectedCourseId && !loadingGrades && rows.length > 0 && (
                <div className="flex justify-end pr-14 font-semibold">
                  Загальна оцінка за курс: {totalGrade}
                </div>
              )}

              {selectedCourseId && (
              <Button
                variant="outline"
                onClick={() => navigate(`/student/courses/${selectedCourseId}`)}
                className="mt-2"
              >
                Перейти до матеріалів курсу
              </Button>
            )}

              
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
