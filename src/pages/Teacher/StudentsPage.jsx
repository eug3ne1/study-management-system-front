// src/pages/StudentsPage.jsx
import React, { useState, useEffect } from 'react';
import TeacherHeader from '@/components/TeacherHeader';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { getTeacherCourses, getCourseStudents } from '../../api/course.js';

export default function StudentsPage() {
  const navigate = useNavigate();
  const [courses, setCourses]           = useState([]);
  const [selectedCourseId, setCourseId] = useState(null);
  const [students, setStudents]         = useState([]);

  // Підвантажуємо всі курси викладача
  useEffect(() => {
    getTeacherCourses()
      .then(setCourses)
      .catch(console.error);
  }, []);

  // Коли вибрали курс — підвантажуємо студентів
  useEffect(() => {
    if (!selectedCourseId) {
      setStudents([]);
      return;
    }
    getCourseStudents(selectedCourseId)
      .then(setStudents)
      .catch(console.error);
  }, [selectedCourseId]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <TeacherHeader />

      <div className="max-w-3xl mx-auto mt-16 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Студенти курсу</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Вибір курсу */}
            <div>
              <Label htmlFor="courseSelect">Оберіть курс</Label>
              <Select
                id="courseSelect"
                onValueChange={val => setCourseId(Number(val))}
                value={selectedCourseId?.toString() ?? ''}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Оберіть курс" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem
                      key={course.id}
                      value={course.id.toString()}
                    >
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Список студентів */}
            {selectedCourseId && (
              <div>
                {students.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {students.map(s => (
                      <li key={s.id}>
                        {s.firstName} {s.lastName}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">
                    Немає студентів, записаних на цей курс.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
