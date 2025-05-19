// src/pages/TeacherCoursesPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTeacherCourses, deleteCourse, updateCourse } from '../../api/course.js';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { getTags } from '../../api/tags.js';
import { Checkbox } from '@/components/ui/checkbox';
import TeacherHeader from '@/components/TeacherHeader.jsx';

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('all');
  const [editingCourse, setEditingCourse] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', tagIds: [] });
  const navigate = useNavigate();

  useEffect(() => {
    getTeacherCourses().then(setCourses).catch(err => console.error(err));
    getTags().then(data => setTags(Array.isArray(data) ? data : data.tags || [])).catch(err => console.error(err));
  }, []);

  const filtered = courses
    .filter(c => filterTag === 'all' || c.tags?.some(t => t.name === filterTag))
    .filter(c => search === '' || c.name.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async (id) => {
    if (window.confirm('Видалити цей курс?')) {
      try {
        await deleteCourse(id);
        setCourses(prev => prev.filter(c => c.id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const openEdit = (course) => {
    setEditingCourse(course);
    setForm({ name: course.name, description: course.description, tagIds: course.tags.map(t => t.id) });
  };

  const handleFormChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const toggleTag = (id) => {
    setForm(prev => {
      const tagIds = prev.tagIds.includes(id)
        ? prev.tagIds.filter(t => t !== id)
        : [...prev.tagIds, id];
      return { ...prev, tagIds };
    });
  };

  const handleSave = async () => {
    try {
      const updated = await updateCourse(editingCourse.id, {
        name: form.name,
        description: form.description,
        tagIds: form.tagIds,
      });
      setCourses(prev => prev.map(c => c.id === updated.id ? updated : c));
      setEditingCourse(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <TeacherHeader/>
      <div className="container mx-auto p-6 grid grid-cols-4 ">
          {/* Sidebar */}
          <aside className="col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search courses..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div>
                <Label>Tag</Label>
                <div className="space-y-2 mt-2">
                  <div key="all" className="flex items-center">
                    <input
                      type="radio"
                      id="tag-all"
                      checked={filterTag === 'all'}
                      onChange={() => setFilterTag('all')}
                    />
                    <Label htmlFor="tag-all" className="ml-2">All</Label>
                  </div>
                  {tags.map(tag => (
                    <div key={tag.id} className="flex items-center">
                      <input
                        type="radio"
                        id={`tag-${tag.id}`}
                        checked={filterTag === tag.name}
                        onChange={() => setFilterTag(tag.name)}
                      />
                      <Label htmlFor={`tag-${tag.id}`} className="ml-2">{tag.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Courses List */}
        <section className="col-span-3 space-y-4">
          {filtered.map(course => (
            <Card key={course.id} className="p-4 w-full max-w-[800px] mx-auto relative">
              {/* Dropdown in top-right corner of Card */}
              <div className="absolute top-3 right-5">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">•••</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => openEdit(course)}>
                      Редагувати
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(course.id)}>
                      Видалити
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <CardHeader className="flex items-start pr-10">
                <div className="flex-grow">
                  <CardTitle>{course.name}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {course.tags?.map(tag => (
                      <Badge key={tag.id} variant="secondary">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate(`/teacher/courses/${course.id}/materials`)}>
                     Керування матеріалами курсу
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </section>
      </div>
      {editingCourse && (
        <Dialog open onOpenChange={() => setEditingCourse(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Редагувати курс</DialogTitle>
              <DialogDescription>Змінити назву, опис та теги</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Назва</Label>
                <Input id="name" name="name" value={form.name} onChange={handleFormChange} />
              </div>
              <div>
                <Label htmlFor="description">Опис</Label>
                <Input id="description" name="description" value={form.description} onChange={handleFormChange} />
              </div>
              <div>
                <Label>Теги</Label>
                <div className="space-y-2 mt-2">
                  {tags.map(tag => (
                    <div key={tag.id} className="flex items-center">
                      <Checkbox id={`edit-tag-${tag.id}`} checked={form.tagIds.includes(tag.id)} onCheckedChange={() => toggleTag(tag.id)} />
                      <Label htmlFor={`edit-tag-${tag.id}`} className="ml-2">{tag.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingCourse(null)}>Скасувати</Button>
              <Button onClick={handleSave}>Зберегти</Button>
            </DialogFooter>
            <DialogClose className="absolute top-2 right-2"></DialogClose>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
