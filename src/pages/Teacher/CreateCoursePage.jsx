// src/pages/CreateCoursePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUniversities } from '@/api/university.js';
import { getTags } from '@/api/tags.js';
import { createCourse } from '@/api/course.js';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import TeacherHeader from '@/components/TeacherHeader.jsx';
import BackButton from '@/components/BackButton.jsx';

export default function CreateCoursePage() {
  const [unis, setUnis] = useState([]);
  const [tags, setTags] = useState([]);
  const [form, setForm] = useState({ uniId: '', name: '', description: '', tagIds: [] });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUniversities()
      .then((data) => Array.isArray(data) ? setUnis(data) : setUnis(data.universities || []))
      .catch(() => setError('Не вдалося завантажити університети'));
    getTags()
      .then((data) => setTags(Array.isArray(data) ? data : data.tags || []))
      .catch(() => setError('Не вдалося завантажити теги'));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleUniChange = (value) => setForm({ ...form, uniId: value });
  const handleTagToggle = (tagId) => {
    const next = form.tagIds.includes(tagId)
      ? form.tagIds.filter((id) => id !== tagId)
      : [...form.tagIds, tagId];
    setForm({ ...form, tagIds: next });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCourse({
        uniId: Number(form.uniId),
        name: form.name,
        description: form.description,
        tagIds: form.tagIds
      });
      navigate('/teacher/courses');
    } catch {
      setError('Помилка при створенні курсу');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <TeacherHeader/>
      <div className="container mx-auto p-6">
        <BackButton/>
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Створити курс</CardTitle>
            <CardDescription>Заповніть інформацію про курс</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="uniId">Університет</Label>
                <Select onValueChange={handleUniChange} value={form.uniId}>
                  <SelectTrigger id="uniId">
                    <SelectValue placeholder="Оберіть університет" />
                  </SelectTrigger>
                  <SelectContent>
                    {unis.map((u) => (
                      <SelectItem key={u.id} value={u.id.toString()}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="name">Назва курсу</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required />
              </div>

              <div>
                <Label htmlFor="description">Опис курсу</Label>
                <Input
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Теги</Label>
                <div className="space-y-2">
                  {tags.map((tag) => (
                    <div key={tag.id} className="flex items-center">
                      <Checkbox
                        id={`tag-${tag.id}`}
                        checked={form.tagIds.includes(tag.id)}
                        onCheckedChange={() => handleTagToggle(tag.id)}
                      />
                      <Label htmlFor={`tag-${tag.id}`} className="ml-2">
                        {tag.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button type="submit" className="w-full">
                Створити курс
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
