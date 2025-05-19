import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/Redux/userSlice.js';
import TeacherHeader from '@/components/TeacherHeader.jsx';
import { BookText, FileQuestion, PlusCircle, BarChart, Users, Settings } from 'lucide-react';
import Footer from '@/components/Footer.jsx';
import {
    getActiveCoursesCount,
    getActiveTestsCount,
    getStudentsCount
  } from '@/api/stats.js';

export function TeacherPage() {
    const user = useSelector(state => state.user.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

        // стани для підвантаженої статистики
    const [coursesCount, setCoursesCount] = useState(null);
    const [testsCount, setTestsCount]     = useState(null);
    const [studentsCount, setStudentsCount] = useState(null);

    useEffect(() => {
        getActiveCoursesCount().then(setCoursesCount).catch(() => setCoursesCount(0));
        getActiveTestsCount().then(setTestsCount).catch(() => setTestsCount(0));
        getStudentsCount().then(setStudentsCount).catch(() => setStudentsCount(0));
      }, []);

    const quickActions = [
        {
            icon: <BookText className="w-5 h-5" />,
            title: "Мої курси",
            description: "Керуйте вашими навчальними курсами",
            action: () => navigate('/teacher/courses'),
            color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300"
        },
        {
            icon: <PlusCircle className="w-5 h-5" />,
            title: "Створити курс",
            description: "Додайте новий навчальний курс",
            action: () => navigate('/teacher/create-course'),
            color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300"
        },
        {
            icon: <FileQuestion className="w-5 h-5" />,
            title: "Створити тест",
            description: "Додайте новий тест для студентів",
            action: () => navigate('/teacher/create-test'),
            color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300"
        },
        {
            icon: <Users className="w-5 h-5" />,
            title: "Cтуденти",
            description: "Переглянути студентів, що записані на ваші курси",
            action: () => navigate('/teacher/students'),
            color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300"
        }
       
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
            <TeacherHeader />
            
            <div className="flex-1 container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ласкаво просимо, <span className="text-indigo-600 dark:text-indigo-400">{user}</span>!</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Ваш особистий простір для керування навчальним процесом</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Активних курсів</CardTitle>
                                <p className="text-2xl font-bold mt-1">{coursesCount}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/20">
                                <BookText className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                            </div>
                        </CardHeader>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Активних тестів</CardTitle>
                                <p className="text-2xl font-bold mt-1">{testsCount}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
                                <FileQuestion className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
                            </div>
                        </CardHeader>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Студентів</CardTitle>
                                <p className="text-2xl font-bold mt-1">{studentsCount}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/20">
                                <Users className="w-5 h-5 text-amber-600 dark:text-amber-300" />
                            </div>
                        </CardHeader>
                    </Card>


                </div>

                {/* Quick Actions */}
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Швидкі дії</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {quickActions.map((action, index) => (
                        <Card 
                            key={index} 
                            className="hover:shadow-md transition-all cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-500"
                            onClick={action.action}
                        >
                            <CardHeader>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${action.color} mb-3`}>
                                    {action.icon}
                                </div>
                                <CardTitle className="text-lg">{action.title}</CardTitle>
                                <CardDescription>{action.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>


                {/* Main Actions */}
                <div className="flex flex-wrap gap-4">
                    <Button 
                        onClick={() => navigate('/teacher/courses')} 
                        variant="outline" 
                        className="flex-1 min-w-[200px] h-16 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500"
                    >
                        <div className="flex items-center gap-3">
                            <BookText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            <div className="text-left">
                                <p className="font-semibold">Мої курси</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Керування навчальними курсами</p>
                            </div>
                        </div>
                    </Button>
                    
                    <Button 
                        onClick={() => navigate('/teacher/tests')} 
                        variant="outline" 
                        className="flex-1 min-w-[200px] h-16 border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-500"
                    >
                        <div className="flex items-center gap-3">
                            <FileQuestion className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            <div className="text-left">
                                <p className="font-semibold">Мої тести</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Керування тестами та завданнями</p>
                            </div>
                        </div>
                    </Button>
                    
                    <Button 
                        onClick={() => navigate('/teacher/students')} 
                        variant="outline" 
                        className="flex-1 min-w-[200px] h-16 border-2 border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-500"
                    >
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            <div className="text-left">
                                <p className="font-semibold">Мої студенти</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Перегляд успішності студентів</p>
                            </div>
                        </div>
                    </Button>
                </div>
            </div>
            <Footer/>
        </div>
    );
}