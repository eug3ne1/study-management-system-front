// src/pages/StudentHomePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate }           from 'react-router-dom';
import StudentHeader             from '@/components/StudentHeader.jsx';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card';
import { Button }                from '@/components/ui/button';
import { Badge }                 from '@/components/ui/badge';
import { Label }                 from '@/components/ui/label';
import { Input }                 from '@/components/ui/input';
import {
  getStudentCourses,
  deleteStudentCourse
} from '@/api/course.js';
import { getTags }               from '@/api/tags.js';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import Footer from '@/components/Footer.jsx';


export default function StudentPage() {
  const navigate = useNavigate();

  const [courses, setCourses]     = useState([]);
  const [tags, setTags]           = useState([]);
  const [search, setSearch]       = useState('');
  const [filterTag, setFilterTag] = useState('all');
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      getStudentCourses(),
      getTags()
    ])
    .then(([coursesData, tagsData]) => {
      setCourses(coursesData);
      setTags(tagsData);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchSearch = course.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchTag = filterTag === 'all'
      ? true
      : course.tags.some(t => t.name === filterTag);
    return matchSearch && matchTag;
  });

  const handleUnenroll = async (courseId) => {
    if (!window.confirm('Припинити відслідковувати цей курс?')) return;
    try {
      await deleteStudentCourse(courseId);
      setCourses(prev => prev.filter(c => c.id !== courseId));
    } catch (err) {
      console.error('Не вдалося відписатися від курсу', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Завантаження…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <StudentHeader />

      <div className="flex-1 container mx-auto p-6 grid grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Фільтри</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="search">Пошук</Label>
                <Input
                  id="search"
                  placeholder="Введіть назву..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div>
                <Label>Розділ</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="tag-all"
                      checked={filterTag === 'all'}
                      onChange={() => setFilterTag('all')}
                    />
                    <Label htmlFor="tag-all" className="ml-2">Усі</Label>
                  </div>
                  {tags.map(tag => (
                    <div key={tag.id} className="flex items-center">
                      <input
                        type="radio"
                        id={`tag-${tag.id}`}
                        checked={filterTag === tag.name}
                        onChange={() => setFilterTag(tag.name)}
                      />
                      <Label htmlFor={`tag-${tag.id}`} className="ml-2">
                        {tag.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Courses */}
        <section className="col-span-3 space-y-6">
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCourses.map(course => (
                <Card
                  key={course.id}
                  className="relative hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between w-full">
                      <CardTitle>{course.name}</CardTitle>
                      {/* Меню дій */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            ⋮
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onSelect={() => handleUnenroll(course.id)}
                          >
                            Відписатися
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    {course.description && (
                      <p className="text-sm text-gray-400 dark:text-gray-400">
                        {course.description}
                      </p>
                    )}
                    {course.teacherDTO && (
                      <p className="text-sm text-gray-350">
                        Викладач:{' '}
                        <span className="font-medium">
                          {course.teacherDTO.lastName}{' '}
                          {course.teacherDTO.firstName}{' '}
                          {course.teacherDTO.middleName}{' '}
                        
                        </span>
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {course.tags?.map(tag => (
                        <Badge key={tag.id} variant="secondary">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-4"
                      onClick={() => navigate(`/student/courses/${course.id}`)}
                    >
                      Відкрити курс
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 col-span-3">
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Курсів не знайдено.
              </p>
              <Button
                onClick={() => navigate('/student/enroll-course')}
                className="px-8"
              >
                Додати курс
              </Button>
            </div>
          )}
        </section>
      </div>
      <Footer/>
    </div>
    
  );
}
