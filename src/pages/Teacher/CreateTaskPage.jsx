// src/pages/CreateTaskPage.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { createTask } from '@/api/tasks.js';
import { Badge } from '@/components/ui/badge';
import TeacherHeader from '@/components/TeacherHeader.jsx';
import BackButton from '@/components/BackButton.jsx';

export default function CreateTaskPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    startTime: '',
    endTime: '',
    maxScore: '',        // нове поле
    files: []
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'files') {
      setForm(prev => ({ ...prev, files: Array.from(files) }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const removeFile = (index) => {
    setForm(prev => {
      const newFiles = [...prev.files];
      newFiles.splice(index, 1);
      return { ...prev, files: newFiles };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createTask(
        {
          courseId:   courseId,
          title:      form.name,
          description:form.description,
          startTime:  form.startTime,
          endTime:    form.endTime,
          maxGrade:   Number(form.maxScore),   // передаємо як число
        },
        form.files
      );
      navigate(`/teacher/courses/${courseId}/materials`);
    } catch (err) {
      console.error(err);
      setError('Не вдалося створити завдання');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <TeacherHeader/>
      <div className="max-w-5xl mx-auto mt-16 flex items-start space-x-6 px-6">
        <BackButton/>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Нове завдання</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Назва */}
              <div>
                <Label htmlFor="name">Назва</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
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
                  rows={4}
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

              {/* Файли */}
              <div>
                <Label htmlFor="files">PDF файли (опційно)</Label>
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
                        onClick={() => removeFile(idx)}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Помилка */}
              {error && <p className="text-red-500">{error}</p>}

              {/* Відправка */}
              <Button type="submit" className="w-full mt-4">
                Створити завдання
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
