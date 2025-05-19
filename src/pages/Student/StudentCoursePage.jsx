// src/pages/StudentCoursePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate }        from 'react-router-dom';
import StudentHeader                     from '@/components/StudentHeader.jsx';
import BackButton                        from '@/components/BackButton.jsx';
import { Badge }                         from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card';
import { Button }                        from '@/components/ui/button';
import { getLectures} from '@/api/lectures.js';
import { getTests} from '@/api/tests.js';
import { getTasks} from '@/api/tasks.js';    
import { getStudentSubmission } from '@/api/taskSubmissions.js';
import { getAttempts } from '@/api/tests.js';
import { getStudentTestGrades } from '@/api/grades.js';

export default function StudentCoursePage() {
  const { courseId } = useParams();
  const navigate     = useNavigate();

  const [lectures, setLectures] = useState([]);
  const [tasks,    setTasks]    = useState([]);
  const [tests,    setTests]    = useState([]);
  const [submissionsMap, setSubMap] = useState({}); 
  const [attemptsMap, setAttemptsMap]   = useState({});

  // Секція: 'lectures' | 'tasks' | 'tests'
  const [section,    setSection]    = useState('lectures');
  const [selectedId, setSelectedId] = useState(null);

  const usedAttempts    = attemptsMap[selectedId]  || 0;

  const [testGradesMap, setTestGradesMap] = useState({}); 

    // Знайти поточний обʼєкт по id
  const selectedLecture = lectures.find(l => l.id === selectedId);
  const selectedTask    = tasks.find(t => t.id === selectedId);
  const selectedTest    = tests.find(t => t.id === selectedId);
  const selectedSub     = submissionsMap[selectedId]; // може бути undefined/null
  const myGrade         = testGradesMap[selectedId]; // оцінка за тест
  

    // Форматування дати й часу
    const formatDateTime = iso => {
      if (!iso) return '';
      const dt = new Date(iso);
      const date = dt.toLocaleDateString('uk-UA', { day: '2-digit', month: 'short' });
      const time = dt.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
      return `${date} ${time}`;
    };

  // Завантажити дані
  useEffect(() => {
    Promise.all([
      getLectures(courseId),
      getTasks(courseId),
      getTests(courseId),
    ]).then(([lecs, tks, ts]) => {
      setLectures(lecs);
      setTasks(tks);
      setTests(ts);

      // за замовчуванням — перша лекція
      if (lecs.length > 0) {
        setSection('lectures');
        setSelectedId(lecs[0].id);
      } else if (tks.length > 0) {
        setSection('tasks');
        setSelectedId(tks[0].id);
      } else if (ts.length > 0) {
        setSection('tests');
        setSelectedId(ts[0].id);
      }
    }).catch(console.error);
  }, [courseId]);


  useEffect(() => {
    if (!tasks.length) return;
    // викликаємо getMySubmission для кожного task.id
    Promise.all(
      tasks.map(t =>
        getStudentSubmission(t.id)
          .then(sub => ({ taskId: t.id, sub }))
          .catch(() => ({ taskId: t.id, sub: null }))
      )
    ).then(results => {
      const map = {};
      results.forEach(({ taskId, sub }) => {
        map[taskId] = sub; // або null
      });
      setSubMap(map);
    });
  }, [tasks]);


   // підвантажуємо кількість спроб для кожного тесту
   useEffect(() => {
    if (!tests.length) return;
    Promise.all(
      tests.map(t =>
        getAttempts(t.id)
          .then(cnt => ({ testId: t.id, cnt }))
          .catch(() => ({ testId: t.id, cnt: 0 }))
      )
    ).then(results => {
      const m = {};
      results.forEach(({ testId, cnt }) => { m[testId] = cnt; });
      setAttemptsMap(m);
    });
  }, [tests]);

  // Генерує бейдж за статусом підмітки
  const renderSubmissionBadge = (sub) => {
    if (!sub) return null;
    if (sub.grade > 0) {
      return <Badge variant="success">Перевірено: {sub.grade}</Badge>;
    }
    // grade == 0
    return <Badge variant="warning">На перевірці</Badge>;
  };


// оцінки за тсет 
  useEffect(() => {
    if (!tests.length) return;
    getStudentTestGrades(courseId)
      .then(grades => {
        // grades: [{ test: {id,...}, grade, student, ... }, ...]
        const m = {};
        grades.forEach(g => {
          m[g.test.id] = g.grade;
        });
        setTestGradesMap(m);
      })
      .catch(console.error);
  }, [tests, courseId]);


  const totalGrade = [
    ...Object.values(testGradesMap),
    ...Object.values(submissionsMap).map(sub => sub?.grade || 0)
  ].reduce((sum, x) => sum + (x || 0), 0);


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <StudentHeader />

      <div className="max-w-6xl mx-auto mt-16 px-6 flex space-x-6">
        <BackButton />

        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
          <nav className="p-4">
            {/* Лекції */}
            <h3 className="prose text-black mb-2 text-lg font-semibold">Лекції</h3>
            <ul>
              {lectures.map(l => (
                <li key={l.id}>
                  <button
                    className={`block w-full text-left px-2 py-1 rounded ${
                      section === 'lectures' && selectedId === l.id
                        ? 'prose text-black bg-gray-200 dark:bg-gray-700'
                        : 'prose text-black hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => {
                      setSection('lectures');
                      setSelectedId(l.id);
                    }}
                  >
                    {l.title}
                  </button>
                </li>
              ))}
            </ul>

            {/* Завдання */}
            <h3 className="prose text-black mt-6 mb-2 text-lg font-semibold">Завдання</h3>
            <ul>
              {tasks.map(t => (
                <li key={t.id}>
                  <button
                    className={`block w-full text-left px-2 py-1 rounded ${
                      section === 'tasks' && selectedId === t.id
                        ? 'prose text-black bg-gray-200 dark:bg-gray-700'
                        : 'prose text-black hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => {
                      setSection('tasks');
                      setSelectedId(t.id);
                    }}
                  >
                    <span>{t.title}</span>
                  
                  </button>
                </li>
              ))}
            </ul>

            {/* Тести */}
            <h3 className=" prose text-black mt-6 mb-2 text-lg font-semibold">Тести</h3>
            <ul>
              {tests.map(t => (
                <li key={t.id}>
                  <button
                    className={`block w-full text-left px-2 py-1 rounded ${
                      section === 'tests' && selectedId === t.id
                        ? 'prose text-black bg-gray-200 dark:bg-gray-700'
                        : 'prose text-black hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => {
                      setSection('tests');
                      setSelectedId(t.id);
                    }}
                  >
                    {t.name}
                  </button>
                </li>
              ))}
            </ul>

            <div>
              <h3 className="prose text-black mt-6 text-lg font-semibold mb-2">Оцінки</h3>
              <button
                className={`block w-full text-left px-2 py-1 rounded ${
                  section==='grades'
                    ? 'prose text-black bg-gray-200 dark:bg-gray-700'
                    : 'prose text-black hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => setSection('grades')}
              >
                Переглянути оцінки
              </button>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {section === 'lectures' && selectedLecture && (
            <Card>
              <CardHeader>
                <CardTitle>{selectedLecture.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="prose "
                  dangerouslySetInnerHTML={{ __html: selectedLecture.content }}
                />
                {selectedLecture.filesUrl?.length > 0 && (
                  <div>
                    <h4 className="font-medium">Файли:</h4>
                    <ul className="list-disc list-inside">
                      {selectedLecture.filesUrl.map(f => {
                        const name = f.path.split('/').pop();
                        return (
                          <li key={f.id}>
                            <a
                              href={f.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {name}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {section === 'tasks' && selectedTask && (
            <Card>
              <CardHeader>
                <CardTitle>Завдання: {selectedTask.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{selectedTask.description}</p>
                {/* При потребі додайте лінк на сторінку здачі */}
                <p className="text-sm text-gray-400">
                  {`Час: ${formatDateTime(selectedTask.startTime)} — ${formatDateTime(selectedTask.endTime)}`}
                </p>
                {renderSubmissionBadge(selectedSub)}
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() =>
                    navigate(
                      `/student/courses/${courseId}/tasks/${selectedTask.id}`
                    )
                  }
                >
                  Відкрити завдання
                </Button>
              </CardContent>
            </Card>
          )}

            {/* Тест */}
            {section === 'tests' && selectedTest && (
            <Card className="relative">
              <CardHeader>
                <CardTitle>{selectedTest.name}</CardTitle>

                {/* ось тут виводимо оцінку, якщо є */}
                {myGrade != null && (
                  <Badge
                    variant="success"
                    className="absolute top-4 right-4"
                  >
                    Оцінка: {myGrade}
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="space-y-2">
                <p>{selectedTest.description}</p>
                <p className="text-sm text-gray-400">
                  Час: {formatDateTime(selectedTest.startTime)} — {formatDateTime(selectedTest.endTime)}
                </p>
                <p className="text-sm">
                  Спроби: <b>{usedAttempts}</b> / <b>{selectedTest.maxAttempts}</b>
                </p>

                {usedAttempts >= selectedTest.maxAttempts ? (
                  <Badge variant="destructive">Спроби вичерпані</Badge>
                ) : new Date() < new Date(selectedTest.startTime) ? (
                  <Badge variant="secondary">Тест ще не почався</Badge>
                ) : new Date() > new Date(selectedTest.endTime) ? (
                  <Badge variant="secondary">Тест завершено</Badge>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() =>
                      navigate(`/student/courses/${courseId}/tests/${selectedTest.id}`)
                    }
                  >
                    Пройти тест
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
            {/* Оцінки */}
            {section === 'grades' && (
            <Card>
              <CardHeader>
                <CardTitle>Ваші оцінки</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left">Назва</th>
                        <th className="px-4 py-2 text-left">Оцінка</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tests.map(t => (
                        <tr key={`test-${t.id}`} className="hover:bg-gray-110">
                          <td className="border px-4 py-2">{t.name}</td>
                          <td className="border px-4 py-2">
                            {testGradesMap[t.id] != null ? testGradesMap[t.id] : '–'}
                          </td>
                        </tr>
                      ))}
                      {tasks.map(t => (
                        <tr key={`task-${t.id}`} className="hover:bg-gray-110">
                          <td className="border px-4 py-2">{t.title}</td>
                          <td className="border px-4 py-2">
                            {submissionsMap[t.id]?.grade != null ? submissionsMap[t.id].grade : '–'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold">Загальна оцінка: {totalGrade}</h4>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
