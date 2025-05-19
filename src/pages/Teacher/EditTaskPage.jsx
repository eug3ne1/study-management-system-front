// src/pages/EditTaskPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TeacherHeader from '@/components/TeacherHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { getTask, updateTask, deleteTaskFile } from '@/api/tasks.js';
import BackButton from '@/components/BackButton.jsx';
import axios from '@/api/axios';

export default function EditTaskPage() {
  const { courseId, taskId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    maxScore: '',      // додаємо сюди
    startTime: '',
    endTime: '',
    files: []
  });
  const [existingFiles, setExistingFiles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getTask(taskId)
      .then(data => {
        setForm({
          title:       data.title        ?? '',
          description: data.description  ?? '',
          maxScore:    data.maxGrade    != null ? String(data.maxGrade) : '',
          startTime:   data.startTime?.slice(0,16) ?? '',
          endTime:     data.endTime?.slice(0,16)   ?? '',
          files:       []
        });
        if (Array.isArray(data.filesUrl)) {
          setExistingFiles(data.filesUrl);
        }
      })
      .catch(() => {
        setError('Не вдалося завантажити дані завдання');
      });
  }, [taskId]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'files') {
      setForm(prev => ({ ...prev, files: Array.from(files) }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const removeExistingFile = async fileId => {
    try {
      await deleteTaskFile(taskId, fileId);
      setExistingFiles(prev => prev.filter(f => f.id !== fileId));
    } catch {
      console.error('Failed to delete existing file', fileId);
    }
  };

  const removeNewFile = index => {
    setForm(prev => {
      const files = [...prev.files];
      files.splice(index, 1);
      return { ...prev, files };
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await updateTask(
        taskId,
        {
          courseId,
          title:       form.title,
          description: form.description,
          maxGrade:    Number(form.maxScore),  // передаємо як число
          startTime:   form.startTime,
          endTime:     form.endTime
        },
        form.files
      );
      navigate(`/teacher/courses/${courseId}/materials`);
    } catch {
      setError('Помилка при оновленні завдання');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <TeacherHeader/>
      <div className="max-w-5xl mx-auto mt-16 flex items-start space-x-6 px-6">
        <BackButton/>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Редагувати завдання</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Заголовок */}
              <div>
                <Label htmlFor="title">Заголовок</Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full"
                  required
                />
              </div>

              {/* Опис */}
              <div>
                <Label htmlFor="description">Опис (необов’язково)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full h-32"
                />
              </div>

              {/* Максимальна оцінка */}
              <div>
                <Label htmlFor="maxScore">Максимальна оцінка</Label>
                <Input
                  id="maxScore"
                  name="maxScore"
                  type="number"
                  min="0"
                  value={form.maxScore}
                  onChange={handleChange}
                  className="w-full"
                  required
                />
              </div>

              {/* Дати */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Початок</Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="datetime-local"
                    value={form.startTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">Кінець</Label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="datetime-local"
                    value={form.endTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Поточні файли */}
              {existingFiles.length > 0 && (
                <div>
                  <Label>Поточні PDF-файли</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {existingFiles.map(file => (
                      <div key={file.id} className="flex items-center space-x-2">
                        <a
                          href={
                            file.path.startsWith('http')
                              ? file.path
                              : `${axios.defaults.baseURL}${file.path}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-grow"
                        >
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-800 cursor-pointer truncate"
                          >
                            {file.path.split('/').pop()}
                          </Badge>
                        </a>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeExistingFile(file.id)}
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Нові файли */}
              <div>
                <Label htmlFor="files">Додати/замінити PDF-файли</Label>
                <Input
                  id="files"
                  name="files"
                  type="file"
                  accept="application/pdf"
                  multiple
                  onChange={handleChange}
                />
              </div>
              {form.files.length > 0 && (
                <div className="space-y-2">
                  {form.files.map((file, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {file.name}
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeNewFile(idx)}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Помилка */}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Зберегти */}
              <Button type="submit" className="w-full">
                Зберегти зміни
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
