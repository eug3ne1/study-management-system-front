// src/pages/CreateLecturePage.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { createLecture } from '@/api/lectures.js';
import { Badge } from '@/components/ui/badge';
import TeacherHeader from '@/components/TeacherHeader.jsx';
import BackButton from '@/components/BackButton.jsx';

export default function CreateLecturePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', files: [] });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'files') {
      setForm((prev) => ({ ...prev, files: Array.from(files) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const removeFile = (index) => {
    setForm(prev => {
      const files = [...prev.files];
      files.splice(index, 1);
      return { ...prev, files };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLecture(
        {courseId: courseId, title: form.title, content: form.content },
        form.files
      );
      navigate(`/teacher/courses/${courseId}/materials`);
    } catch {
      setError('Помилка при створенні лекції');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 ">
      <TeacherHeader/>
      <div className="max-w-5xl mx-auto mt-16 flex items-start space-x-6 px-6">
        <BackButton/>
        <Card className='w-full'>
          <CardHeader>
            <CardTitle>Нова лекція</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
              <div>
                <Label htmlFor="content">Зміст</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  className="w-full h-48"
                  required
                />
              </div>
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
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full">
                Створити лекцію
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
