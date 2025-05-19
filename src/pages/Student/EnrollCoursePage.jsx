// src/pages/EnrollCoursePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate }                     from 'react-router-dom';
import StudentHeader                       from '@/components/StudentHeader.jsx';
import BackButton                          from '@/components/BackButton.jsx';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card';
import { Label }                           from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Input }                           from '@/components/ui/input';
import { Button }                          from '@/components/ui/button';
import { getUniversities }                 from '@/api/university.js';
import { getTeachersByUniversity }         from '@/api/teacher.js';
import { getCoursesByTeacher, enrollCourse } from '@/api/course.js';

export default function EnrollCoursePage() {
  const navigate = useNavigate();

  const [universities, setUniversities] = useState([]);
  const [teachers, setTeachers]         = useState([]);
  const [courses, setCourses]           = useState([]);

  const [uniId, setUniId]               = useState('');
  const [teacherId, setTeacherId]       = useState('');
  const [courseId, setCourseId]         = useState('');

  const [uniFilter, setUniFilter]           = useState('');
  const [teacherFilter, setTeacherFilter]   = useState('');

  const [loading, setLoading]     = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');

  // 1) Отримуємо університети
  useEffect(() => {
    getUniversities()
      .then(setUniversities)
      .catch(() => setError('Не вдалося завантажити університети'))
      .finally(() => setLoading(false));
  }, []);

  // 2) При виборі університету — отримуємо викладачів
  useEffect(() => {
    if (!uniId) {
      setTeachers([]);
      setTeacherId('');
      setTeacherFilter('');
      return;
    }
    getTeachersByUniversity(uniId)
      .then(setTeachers)
      .catch(() => setError('Не вдалося завантажити викладачів'));
  }, [uniId]);

  // 3) При виборі викладача — отримуємо курси
  useEffect(() => {
    if (!teacherId) {
      setCourses([]);
      setCourseId('');
      return;
    }
    getCoursesByTeacher(teacherId)
      .then(setCourses)
      .catch(() => setError('Не вдалося завантажити курси'));
  }, [teacherId]);

  const handleEnroll = async () => {
    if (!courseId) return;
    setEnrolling(true);
    setError('');
    try {
      await enrollCourse(courseId);
      setSuccess('Ви успішно записані на курс!');
      setTimeout(() => navigate('/student'), 1500);
    } catch {
      setError('Помилка запису на курс');
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <StudentHeader />

      <div className="max-w-5xl mx-auto mt-16 flex items-start space-x-6 px-6">
        <BackButton/>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Запис на курс</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error   && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-600">{success}</p>}

            {/* Університет */}
            <div>
              <Label htmlFor="university">Університет</Label>
              <Select
                value={uniId}
                onValueChange={val => {
                  setUniId(val);
                  setUniFilter('');
                }}
                defaultValue=""
              >
                <SelectTrigger id="university" className="w-full">
                  <SelectValue placeholder="Оберіть університет" />
                </SelectTrigger>
                <SelectContent>
                  {/* Поле пошуку */}
                  <div className="p-2">
                    <Input
                      placeholder="Пошук університету..."
                      value={uniFilter}
                      onChange={e => setUniFilter(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  {/* Відфільтровані пункти */}
                  {universities
                    .filter(u =>
                      u.name.toLowerCase().includes(uniFilter.toLowerCase())
                    )
                    .map(u => (
                      <SelectItem key={u.id} value={String(u.id)}>
                        {u.name}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>

            {/* Викладач */}
            <div>
              <Label htmlFor="teacher">Викладач</Label>
              <Select
                value={teacherId}
                onValueChange={val => {
                  setTeacherId(val);
                  setTeacherFilter('');
                }}
                defaultValue=""
                disabled={!teachers.length}
              >
                <SelectTrigger id="teacher" className="w-full">
                  <SelectValue placeholder="Оберіть викладача" />
                </SelectTrigger>
                <SelectContent>
                  {/* Поле пошуку */}
                  <div className="p-2">
                    <Input
                      placeholder="Пошук викладача..."
                      value={teacherFilter}
                      onChange={e => setTeacherFilter(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  {/* Відфільтровані пункти */}
                  {teachers
                    .filter(t => {
                      const full = `${t.firstName} ${t.lastName} ${t.middleName}`.toLowerCase();
                      return full.includes(teacherFilter.toLowerCase());
                    })
                    .map(t => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.firstName} {t.middleName} {t.lastName} 
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>

            {/* Курс */}
            <div>
              <Label htmlFor="course">Курс</Label>
              <Select
                value={courseId}
                onValueChange={setCourseId}
                defaultValue=""
                disabled={!courses.length}
              >
                <SelectTrigger id="course" className="w-full">
                  <SelectValue placeholder="Оберіть курс" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(c => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleEnroll}
              disabled={!courseId || enrolling}
              className="w-full"
            >
              {enrolling ? 'Записуємо…' : 'Записатися'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
