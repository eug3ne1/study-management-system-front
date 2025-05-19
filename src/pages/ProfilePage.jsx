// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react'
import { useSelector }                 from 'react-redux'
import Header                          from '@/components/Header'
import StudentHeader                   from '@/components/StudentHeader.jsx'
import TeacherHeader                   from '@/components/TeacherHeader.jsx'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card'
import { Label }                       from '@/components/ui/label'
import { Input }                       from '@/components/ui/input'
import { Button }                      from '@/components/ui/button'
import { Eye, EyeOff }                 from 'lucide-react'
import { getProfile, updateProfile }   from '../api/user.js'

export default function ProfilePage() {
  // дістаємо роль із Redux store
  const role = useSelector(state => state.user.role)
  
  // обираємо Header-компонент
  const HeaderComponent =
    role === 'ROLE_TEACHER' ? TeacherHeader
    : role === 'ROLE_STUDENT' ? StudentHeader
    : Header

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  })
  const [loading, setLoading]   = useState(true)
  const [error,   setError]     = useState('')
  const [success, setSuccess]   = useState('')

  // стани для показу/приховування пароля
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew,     setShowNew]     = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    getProfile()
      .then(user => {
        setForm(f => ({
          ...f,
          firstName:  user.firstName  || '',
          lastName:   user.lastName   || '',
          middleName: user.middleName || ''
        }))
      })
      .catch(() => setError('Не вдалося завантажити профіль'))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError(''); setSuccess('')

    if (form.newPassword && form.newPassword !== form.confirmNewPassword) {
      setError('Новий пароль та підтвердження не співпадають')
      return
    }

    try {
      await updateProfile({
        firstName: form.firstName,
        lastName:  form.lastName,
        middleName: form.middleName,
        ...(form.currentPassword && { currentPassword: form.currentPassword }),
        ...(form.newPassword     && { newPassword:     form.newPassword })
      })
      setSuccess('Профіль успішно оновлено')
      // чистимо паролі
      setForm(f => ({
        ...f,
        currentPassword:    '',
        newPassword:        '',
        confirmNewPassword: ''
      }))
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка при оновленні')
    }
  }

  const renderPasswordField = (label, name, value, show, setShow) => (
    <div className="relative">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={handleChange}
        className="pr-10"
        placeholder={label === 'Поточний пароль' ? '(залиште пусто, якщо не міняєте)' : undefined}
      />
      <button
        type="button"
        onClick={() => setShow(v => !v)}
        className="absolute inset-y-0 right-0 px-3 flex items-center"
        tabIndex={-1}
      >
        {show ? <EyeOff size={16}/> : <Eye size={18}/>}
      </button>
    </div>
  )

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Завантаження...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
  
      <HeaderComponent />

      <div className="max-w-md mx-auto mt-16 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Мій профіль</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error   && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm">{success}</p>}

              <div>
                <Label htmlFor="firstName">Ім’я</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="lastName">Прізвище</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="middleName">По-батькові</Label>
                <Input
                  id="middleName"
                  name="middleName"
                  value={form.middleName}
                  onChange={handleChange}
                />
              </div>

              <hr className="border-t" />

              {renderPasswordField(
                'Поточний пароль',
                'currentPassword',
                form.currentPassword,
                showCurrent,
                setShowCurrent
              )}
              {renderPasswordField(
                'Новий пароль',
                'newPassword',
                form.newPassword,
                showNew,
                setShowNew
              )}
              {renderPasswordField(
                'Підтвердження нового',
                'confirmNewPassword',
                form.confirmNewPassword,
                showConfirm,
                setShowConfirm
              )}

              <Button type="submit" className="w-full">
                Зберегти зміни
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
