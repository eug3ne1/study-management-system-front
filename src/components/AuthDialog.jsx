import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login, register } from '../api/auth.js';
import { loginSuccess } from '../Redux/userSlice.js';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import googleLogo from '@/assets/googleLogo.png';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Eye, EyeOff } from 'lucide-react';

// базова функція для розбору JWT без бібліотек
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export default function AuthDialog({ open, onOpenChange }) {
  const [mode, setMode] = useState('login');
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    middleName: '',
    lastName: '',
    roleName: 'ROLE_STUDENT',
  });
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Обробляємо редірект з Google OAuth2
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      const decoded = parseJwt(token);
      if (!decoded) {
        setError('Не вдалось обробити автентифікацію через Google.');
        return;
      }
      const userRole = decoded.authorities?.[0] || 'ROLE_STUDENT';
      const email = decoded.email || decoded.sub;
      dispatch(loginSuccess({ token, user: email, role: userRole }));
      setError(null);
      // очищаємо параметри URL
      navigate(location.pathname, { replace: true });
      // перенаправлення за роллю
      if (userRole === 'ROLE_TEACHER') navigate('/teacher');
      else navigate('/student');
    }
  }, [location.search, dispatch, navigate, location.pathname]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleRoleChange = (value) => {
    setForm({ ...form, roleName: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login({ email: form.username, password: form.password });
      const userRole = data.authorities?.[0];
      dispatch(loginSuccess({ token: data.jwt, user: form.username, role: userRole }));
      setError(null);
      if (userRole === 'ROLE_TEACHER') navigate('/teacher');
      else navigate('/student');
    } catch {
      setError('Невірний логін або пароль.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        middleName: form.middleName,
        lastName: form.lastName,
        roleName: form.roleName,
      };
      const data = await register(payload);
      const userRole = data.authorities?.[0] || form.roleName;
      dispatch(loginSuccess({ token: data.jwt, user: form.email, role: userRole }));
      setError(null);
      if (userRole === 'ROLE_TEACHER') navigate('/teacher');
      else navigate('/student');
    } catch {
      setError('Помилка реєстрації.');
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError(null);
    setForm(prev => ({ ...prev, password: '' }));
    setShowPasswordLogin(false);
    setShowPasswordRegister(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'login' ? 'Увійти' : 'Реєстрація'}</DialogTitle>
          <DialogDescription>
            {mode === 'login'
              ? 'Введіть ваші облікові дані для входу.'
              : 'Заповніть форму для реєстрації.'}
          </DialogDescription>
        </DialogHeader>

        {mode === 'login' ? (
          <>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Ім'я користувача</Label>
                <Input id="username" name="username" value={form.username} onChange={handleChange} required />
              </div>
              <div className="relative">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  name="password"
                  type={showPasswordLogin ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute -translate-y-7 right-0 px-5 flex items-center"
                  onClick={() => setShowPasswordLogin(prev => !prev)}
                >
                  {showPasswordLogin ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <DialogFooter>
                <Button type="submit" className="w-full">
                  Увійти
                </Button>
              </DialogFooter>
            </form>

            
              <Button
                variant="outline"
                onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
                className="flex items-center justify-center space-x-2"
              >
                <img src={googleLogo} alt="Google logo" className="w-7 h-5" />
                <span>Увійти через Google</span>
              </Button>
  
          </>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="relative">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                name="password"
                type={showPasswordRegister ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                className="pr-10"
                required
              />
              <button
                type="button"
                className="absolute -translate-y-7 right-0 px-5 flex items-center"
                onClick={() => setShowPasswordRegister(prev => !prev)}
              >
                {showPasswordRegister ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            <div>
              <Label htmlFor="firstName">Ім’я</Label>
              <Input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="lastName">Прізвище</Label>
              <Input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="middleName">По батькові</Label>
              <Input id="middleName" name="middleName" value={form.middleName} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="roleName">Роль</Label>
              <Select onValueChange={handleRoleChange} defaultValue={form.roleName}>
                <SelectTrigger id="roleName">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ROLE_STUDENT">Студент</SelectItem>
                  <SelectItem value="ROLE_TEACHER">Викладач</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <DialogFooter>
              <Button type="submit" className="w-full">
                Зареєструватися
              </Button>
            </DialogFooter>
          </form>
        )}

        <p className="mt-4 text-center text-sm">
          {mode === 'login' ? (
            <button onClick={() => switchMode('register')} className="text-blue-500 hover:underline">
              Немає акаунту? Зареєструватися
            </button>
          ) : (
            <button onClick={() => switchMode('login')} className="text-blue-500 hover:underline">
              Вже є акаунт? Увійти
            </button>
          )}
        </p>
      </DialogContent>
    </Dialog>
  );
}
