// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import { TeacherPage } from './pages/Teacher/TeacherPage';
import CreateCoursePage from './pages/Teacher/CreateCoursePage';
import TeacherCoursesPage from './pages/Teacher/TeacherCoursesPage';
import CourseMaterialsPage from './pages/Teacher/CourseMaterialsPage.jsx';
import CreateLecturePage from './pages/Teacher/CreateLecturePage';
import EditLecturePage from './pages/Teacher/EditLecturePage.jsx';
import EditTestPage from './pages/Teacher/EditTestPage.jsx';

import CreateTaskPage from './pages/Teacher/CreateTaskPage.jsx';
import EditTaskPage from './pages/Teacher/EditTaskPage.jsx';
import StudentsPage from './pages/Teacher/StudentsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import StudentPage from './pages/Student/StudentPage';
import EnrollCoursePage from './pages/Student/EnrollCoursePage';
import StudentCoursePage from './pages/Student/StudentCoursePage';
import StudentTaskPage from './pages/Student/StudentTaskPage.jsx';
import StudentTestPage from './pages/Student/StudentTestPage.jsx';
import StudentGradesPage from './pages/Student/StudentGradesPage';
import LandingPage from './pages/LandingPage.jsx';
import { SelectRolePage } from './pages/SelectRolePage.jsx';
import OAuth2SuccessPage from './pages/OAuth2SuccessPage.jsx';
import CreateTestPage from './pages/Teacher/СreateTestPage';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='' element={<LandingPage />}/>
        <Route path="/select-role" element={<SelectRolePage/>} />
        <Route path="/oauth2-success" element={<OAuth2SuccessPage />} />
        <Route path='/student' element={<StudentPage/>}/>
        <Route path="/teacher" element={<TeacherPage />} />
        <Route path="/teacher/create-course" element={<CreateCoursePage />} />
        <Route path="/teacher/courses" element={<TeacherCoursesPage />} />
        <Route path="/teacher/courses/:courseId/materials" element={<CourseMaterialsPage/>} />
        <Route path="/teacher/courses/:courseId/lectures/new" element={<CreateLecturePage />} />
        <Route path="/teacher/courses/:courseId/lectures/:lectureId/edit" element={<EditLecturePage />}/>
        <Route path="/teacher/courses/:courseId/tests/new" element={<CreateTestPage />} />
        <Route path="/teacher/courses/:courseId/tests/:testId/edit" element={<EditTestPage />} />
        <Route path="/teacher/courses/:courseId/tasks/new" element={<CreateTaskPage />}/>
        <Route path="/teacher/courses/:courseId/tasks/:taskId/edit" element={<EditTaskPage />}/>
        <Route path="/teacher/students" element={<StudentsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/student/enroll-course" element={<EnrollCoursePage />} />
        <Route path="/student/grades" element={<StudentGradesPage />} />
        <Route path="/student/courses/:courseId" element={<StudentCoursePage />} />
        <Route path="/student/courses/:courseId/tasks/:taskId" element={<StudentTaskPage />} />
        <Route path="/student/courses/:courseId/tests/:testId" element={<StudentTestPage />} />

      </Routes>
    </Router>
    
  );
}

