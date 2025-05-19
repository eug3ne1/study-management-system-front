// src/pages/EditLecturePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getLecture, updateLecture } from '@/api/lectures.js';
import { deleteLectureFile } from '@/api/lectures.js';
import axios from '@/api/axios';
import TeacherHeader from '@/components/TeacherHeader.jsx';
import BackButton from '@/components/BackButton.jsx';


export default function EditLecturePage() {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: '', content: '', files: [] });
  
  
  
  // Видалити вже існуючий файл
  const removeExistingFile = async (fileId) => {
    try {
      await deleteLectureFile(lectureId, fileId);
      setExistingFiles(prev => prev.filter(f => f.id !== fileId));
    } catch (err) {
      console.error('Failed to delete existing file', err);
    }
  };
  const [existingFiles, setExistingFiles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getLecture(courseId, lectureId)
      .then((data) => {
        setForm({ title: data.title, content: data.content, files: [] });
        if (Array.isArray(data.filesUrl)) {
          setExistingFiles(data.filesUrl);
        }
      })
      .catch(() => setError('Не вдалося завантажити дані лекції'));
  }, [courseId, lectureId]);

  // Remove new selected file
  const removeNewFile = (index) => {
    setForm((prev) => {
      const files = [...prev.files];
      files.splice(index, 1);
      return { ...prev, files };
    });
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'files') {
      setForm((prev) => ({ ...prev, files: Array.from(files) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateLecture(
        
        lectureId,
        {courseId: courseId, title: form.title, content: form.content },
        form.files
      );
      navigate(`/teacher/courses/${courseId}/materials`);
    } catch {
      setError('Помилка при оновленні лекції');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      
      <TeacherHeader/>
     
      <div className="max-w-5xl mx-auto mt-16 flex items-start space-x-6 px-6">
        <BackButton/>     
        <Card className='w-full '>
          <CardHeader>
            <CardTitle>Редагувати лекцію</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
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

              {/* Content */}
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

              {/* Existing Files */}
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

              {/* New File Upload */}
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

              {/* New Selected Files List */}
              {form.files.length > 0 && (
                <div className="space-y-2">
                  {form.files.map((file, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                      >
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

              {/* Error */}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Submit */}
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


