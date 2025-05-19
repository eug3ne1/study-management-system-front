
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export function SelectRolePage() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const email = params.get('email');
    const [role, setRole] = useState('ROLE_STUDENT');
    const [error, setError] = useState(null);
  
    if (!email) {
      return <div className="p-4 text-red-500">Не вказано email для вибору ролі.</div>;
    }
  
    // Використовуємо відправку форми, щоб обійти CORS при редіректі
    const handleSubmit = () => {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'http://localhost:8080/auth/oauth2/complete';
      form.style.display = 'none';
  
      const inputEmail = document.createElement('input');
      inputEmail.name = 'email';
      inputEmail.value = email;
      form.appendChild(inputEmail);
  
      const inputRole = document.createElement('input');
      inputRole.name = 'role';
      inputRole.value = role;
      form.appendChild(inputRole);
  
      document.body.appendChild(form);
      form.submit();
    };
  
    return (
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-xl font-semibold mb-4">Виберіть вашу роль</h1>
        <p className="mb-4">Email: <span className="font-medium">{email}</span></p>
        <div className="space-y-2 mb-4">
          <Label className="flex items-center">
            <input
              type="radio"
              name="role"
              value="ROLE_STUDENT"
              checked={role === 'ROLE_STUDENT'}
              onChange={() => setRole('ROLE_STUDENT')}
              className="mr-2"
            />
            Студент
          </Label>
          <Label className="flex items-center">
            <input
              type="radio"
              name="role"
              value="ROLE_TEACHER"
              checked={role === 'ROLE_TEACHER'}
              onChange={() => setRole('ROLE_TEACHER')}
              className="mr-2"
            />
            Викладач
          </Label>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <Button className="w-full" onClick={handleSubmit}>
          Підтвердити роль
        </Button>
      </div>
    );
  }
  