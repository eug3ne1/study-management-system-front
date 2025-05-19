// src/pages/CourseMaterialsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getLectures, deleteLecture } from '@/api/lectures.js';
import { getTests, deleteTest } from '@/api/tests.js';
import { getTasks, deleteTask } from '@/api/tasks.js';       // ← Імпортуємо API для завдань
//import { getGrades } from '@/api/grades.js';
import { Badge } from '@/components/ui/badge';
import TeacherHeader from '@/components/TeacherHeader.jsx';
import BackButton from '@/components/BackButton.jsx';
import { 
  getTestGrades, 
  getTaskGrades 
} from '../../api/grades.js';

import {
  getCourseSubmissions,
  gradeTaskSubmission
} from '../../api/taskSubmissions.js';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function CourseMaterialsPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [lectures, setLectures] = useState([]);
  const [tests, setTests] = useState([]);
  const [tasks, setTasks]     = useState([]);
  const [testGrades, setTestGrades] = useState([]);
  const [taskGrades, setTaskGrades] = useState([]);   
  
  // ← стан для завдань
  useEffect(() => {
    getLectures(courseId).then(setLectures).catch(console.error);
    getTests(courseId).then(setTests).catch(console.error);
    getTasks(courseId).then(setTasks).catch(console.error);
    getTestGrades(courseId).then(setTestGrades).catch(console.error);
    getTaskGrades(courseId).then(setTaskGrades).catch(console.error);
  }, [courseId]);

  useEffect(() => {
    getCourseSubmissions(courseId)
      .then(setSubmissions)
      .catch(console.error);
  }, [courseId]);
  
  const [submissions, setSubmissions]   = useState([]);
  const [filterTask, setFilterTask]     = useState('');
  const [filterStudent, setFilterStudent] = useState('');
  const [selectedSub, setSelectedSub]   = useState(null);
  const [editedGrade, setEditedGrade]   = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteLecture = async (id) => {
    if (!window.confirm('Видалити цю лекцію?')) return;
    await deleteLecture(id);
    setLectures(prev => prev.filter(l => l.id !== id));
  };

  const handleDeleteTest = async (id) => {
    if (!window.confirm('Видалити цей тест?')) return;
    await deleteTest(id);
    setTests(prev => prev.filter(t => t.id !== id));
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Видалити це завдання?')) return;
    await deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };


  const openDialog = (sub) => {
    setSelectedSub(sub);
    setEditedGrade(sub.grade ?? '');
    setIsDialogOpen(true);
  };

  const saveGrade = async () => {
    try {
      const updated = await gradeTaskSubmission(selectedSub.id, editedGrade);
      setSubmissions(list =>
        list.map(s => s.id === updated.id ? updated : s)
      );
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };


  const filtered = submissions.filter(sub => {
    const taskMatch = sub.task.title
      .toLowerCase()
      .includes(filterTask.trim().toLowerCase());
    const studentFull = `${sub.student.firstName} ${sub.student.lastName}`.toLowerCase();
    const studentMatch = studentFull.includes(filterStudent.trim().toLowerCase());
    return taskMatch && studentMatch;
  });
  

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <TeacherHeader />
      <div className="max-w-5xl mx-auto mt-16 flex items-start space-x-6 px-6 ">
        <BackButton/>
        <Card className='w-full'>
          <CardHeader>
            <CardTitle>Керування курсом</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="lectures">
              <TabsList>
                <TabsTrigger value="lectures">Лекції</TabsTrigger>
                <TabsTrigger value="tests">Тести</TabsTrigger>
                <TabsTrigger value="tasks">Завдання</TabsTrigger> 
                <TabsTrigger value="submissions">Оцінка робіт</TabsTrigger>   
                <TabsTrigger value="grades">Оцінки</TabsTrigger>
                 
            
              </TabsList>

            
              <TabsContent value="lectures">
                <div className="flex justify-end mb-4">
                  <Button onClick={() => navigate(`/teacher/courses/${courseId}/lectures/new`)}>
                    Нова лекція
                  </Button>
                </div>
                <div className="space-y-2">
                  {lectures.map(l => (
                    <Card
                      key={l.id}
                      className="p-4 hover:bg-gray-600 cursor-pointer"
                      onClick={() => navigate(`/teacher/courses/${courseId}/lectures/${l.id}/edit`)}
                    >
                      <div className="flex justify-between items-center">
                        <CardTitle>{l.title}</CardTitle>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={e => { e.stopPropagation(); handleDeleteLecture(l.id); }}
                        >
                          ✕
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="tests">
                <div className="flex justify-end mb-4">
                  <Button onClick={() => navigate(`/teacher/courses/${courseId}/tests/new`)}>
                    Новий тест
                  </Button>
                </div>
                <div className="space-y-2">
                  {tests.map(t => (
                    <Card
                      key={t.id}
                      className="p-4 hover:bg-gray-600 cursor-pointer"
                      onClick={() => navigate(`/teacher/courses/${courseId}/tests/${t.id}/edit`)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{t.name}</CardTitle>
                          <Badge variant="secondary" className="mt-2">
                            {`${new Date(t.startTime).toLocaleDateString('uk-UA', { day: '2-digit', month: 'short' })} ${new Date(t.startTime).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}`}
                            {' - '}
                            {`${new Date(t.endTime).toLocaleDateString('uk-UA', { day: '2-digit', month: 'short' })} ${new Date(t.endTime).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}`}
                          </Badge>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={e => { e.stopPropagation(); handleDeleteTest(t.id); }}
                        >
                          ✕
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* ЗАВДАННЯ */}
              <TabsContent value="tasks">
                <div className="flex justify-end mb-4">
                  <Button onClick={() => navigate(`/teacher/courses/${courseId}/tasks/new`)}>
                    Нове завдання
                  </Button>
                </div>
                <div className="space-y-2">
                  {tasks.map(task => (
                    <Card
                      key={task.id}
                      className="p-4 hover:bg-gray-600 cursor-pointer"
                      onClick={() => navigate(`/teacher/courses/${courseId}/tasks/${task.id}/edit`)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{task.title}</CardTitle>
                          <Badge variant="secondary" className="mt-2">
                            {`${new Date(task.startTime).toLocaleDateString('uk-UA', { day: '2-digit', month: 'short' })} ${new Date(task.startTime).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}`}
                            {' - '}
                            {`${new Date(task.endTime).toLocaleDateString('uk-UA', { day: '2-digit', month: 'short' })} ${new Date(task.endTime).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}`}
                          </Badge>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={e => { e.stopPropagation(); handleDeleteTask(task.id); }}
                        >
                          ✕
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="grades">
                <div className="space-y-8">
                  {/* Оцінки за тести */}
                  <section>
                    <h3 className="text-lg font-semibold mb-2">Оцінки за тести</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full table-auto">
                        <thead>
                          <tr>
                            <th className="px-4 py-2">Студент</th>
                            <th className="px-4 py-2">Тест</th>
                            <th className="px-4 py-2">Оцінка</th>
                          </tr>
                        </thead>
                        <tbody>
                          {testGrades.map(g => (
                            <tr key={g.id} className="hover:bg-gray-50">
                              <td className="border px-4 py-2">
                                {g.student.firstName} {g.student.lastName}
                              </td>
                              <td className="border px-4 py-2">
                                {g.test.name}
                              </td>
                              <td className="border px-4 py-2">
                                {g.grade}
                              </td>
                            </tr>
                          ))}
                          {testGrades.length === 0 && (
                            <tr>
                              <td colSpan={3} className="text-center py-4 text-gray-500">
                                Немає оцінок за тести
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  {/* Оцінки за завдання */}
                  <section>
                    <h3 className="text-lg font-semibold mb-2">Оцінки за завдання</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full table-auto">
                        <thead>
                          <tr>
                            <th className="px-4 py-2">Студент</th>
                            <th className="px-4 py-2">Завдання</th>
                            <th className="px-4 py-2">Оцінка</th>
                          </tr>
                        </thead>
                        <tbody>
                          {taskGrades.map(g => (
                            <tr key={g.id} className="hover:bg-gray-70">
                              <td className="border px-4 py-2">
                                {g.student.firstName} {g.student.lastName}
                              </td>
                              <td className="border px-4 py-2">
                                {g.task.title}
                              </td>
                              <td className="border px-4 py-2">
                                {g.grade}
                              </td>
                            </tr>
                          ))}
                          {taskGrades.length === 0 && (
                            <tr>
                              <td colSpan={3} className="text-center py-4 text-gray-500">
                                Немає оцінок за завдання
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              </TabsContent>

              <TabsContent value="submissions">
                {/* Фільтр по назві завдання */}
                {/* Пошукові поля */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="filterTask">Фільтр за назвою завдання</Label>
                    <Input
                      id="filterTask"
                      placeholder="Введіть назву завдання..."
                      value={filterTask}
                      onChange={e => setFilterTask(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="filterStudent">Фільтр за ім’ям студента</Label>
                    <Input
                      id="filterStudent"
                      placeholder="Введіть ім’я студента..."
                      value={filterStudent}
                      onChange={e => setFilterStudent(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Список карток відповідей */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filtered.length > 0
                    ? filtered.map(sub => (
                        <Card
                          key={sub.id}
                          className="p-4 cursor-pointer hover:shadow-lg"
                          onClick={() => openDialog(sub)}
                        >
                          <h3 className="text-lg font-semibold">
                            {sub.task.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {sub.student.firstName} {sub.student.lastName}
                          </p>
                          <p className="mt-2 font-medium">
                            Оцінка: {sub.grade ?? '—'}
                          </p>
                        </Card>
                      ))
                    : (
                      <p className="col-span-2 text-center text-gray-500">
                        Немає жодної роботи
                      </p>
                    )
                  }
                </div>

                {/* Діалог для оцінювання */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedSub?.task.title} — {selectedSub?.student.firstName} {selectedSub?.student.lastName}
                      </DialogTitle>
                    </DialogHeader>

                    {/* Файли студента */}
                    {selectedSub?.filesUrl?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedSub.filesUrl.map(f => (
                          <a
                            key={f.id}
                            href={f.path}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Badge variant="secondary" className="truncate">
                              {f.path.split('/').pop()}
                            </Badge>
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Поле для оцінки */}
                    <div className="space-y-2">
                      <Label htmlFor="gradeInput">Оцінка</Label>
                      <Input
                        id="gradeInput"
                        type="number"
                        min={0}
                        step={0.1}
                        value={editedGrade}
                        onChange={e => setEditedGrade(e.target.value)}
                      />
                    </div>

                    <DialogFooter className="mt-4">
                      <Button onClick={saveGrade} className="w-full">
                        Зберегти
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TabsContent>

            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
