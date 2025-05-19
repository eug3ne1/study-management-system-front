
// src/pages/CreateTestPage.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { createTest } from '../../api/tests.js';
import TeacherHeader from '@/components/TeacherHeader.jsx';
import BackButton from '@/components/BackButton.jsx';

const initialAnswer = { text: '', isCorrect: false };
const initialQuestion = { text: '', content: '', value: 1, type: 'SINGLE_CHOICE', answers: [ { ...initialAnswer } ] };

const createEmptyAnswer = () => ({ text: '', isCorrect: false });
const createEmptyQuestion = () => ({
  text: '',
  content: '',
  value: 1,
  type: 'SINGLE_CHOICE',
  answers: [ createEmptyAnswer() ]
});

export default function CreateTestPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState({
    name: '',
    description: '',
    maxAttempts: 1,
    startTime: '',
    endTime: '',
    questions: [ createEmptyQuestion() ],
  });


  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTest(prev => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (qIdx, field, value) => {
    setTest(prev => {
      const qs = prev.questions.map((q, i) =>
        i === qIdx ? { ...q, [field]: value } : q
      );
      return { ...prev, questions: qs };
    });
  };

  const handleAnswerChange = (qIdx, aIdx, field, value) => {
    setTest(prev => {
      const qs = prev.questions.map((q, i) => {
        if (i !== qIdx) return q;
        const answers = q.answers.map((a, j) =>
          j === aIdx ? { ...a, [field]: value } : a
        );
        return { ...q, answers };
      });
      return { ...prev, questions: qs };
    });
  };

  const addQuestion = () => {
    setTest(prev => ({
      ...prev,
      questions: [...prev.questions, createEmptyQuestion()]
    }));
  };
  

  const removeQuestion = (idx) => {
    setTest(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx)
    }));
  };


  const addAnswer = (qIdx) => {
    setTest(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === qIdx
          ? { ...q, answers: [...q.answers, createEmptyAnswer()] }
          : q
      )
    }));
  };

  const removeAnswer = (qIdx, aIdx) => {
    setTest(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => {
        if (i !== qIdx) return q;
        return { ...q, answers: q.answers.filter((_, j) => j !== aIdx) };
      })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTest(courseId, test);
      navigate(`/teacher/courses/${courseId}/materials`);
    } catch (err) {
      console.error(err);
      setError('Не вдалося створити тест');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 ">
          <TeacherHeader/>
          <div className="max-w-5xl mx-auto mt-16 flex items-start space-x-6 px-6">
            <BackButton/>
            <Card className='w-full'>
          <CardHeader>
            <CardTitle>Новий тест</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Test meta */}
              <div>
                <Label htmlFor="name">Назва тесту</Label>
                <Input id="name" name="name" value={test.name} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="description">Опис</Label>
                <Textarea id="description" name="description" value={test.description} onChange={handleChange} required />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor="maxAttempts">Спроби</Label>
                  <Input id="maxAttempts" name="maxAttempts" type="number" min={1} value={test.maxAttempts} onChange={handleChange} required />
                </div>
                <div className="flex-1">
                  <Label htmlFor="startTime">Початок</Label>
                  <Input id="startTime" name="startTime" type="datetime-local" value={test.startTime} onChange={handleChange} required />
                </div>
                <div className="flex-1">
                  <Label htmlFor="endTime">Кінець</Label>
                  <Input id="endTime" name="endTime" type="datetime-local" value={test.endTime} onChange={handleChange} required />
                </div>
              </div>
              {/* Questions */}
              {test.questions.map((q, qIdx) => (
                <div key={qIdx} className="border p-4 rounded space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Питання {qIdx + 1}</h3>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeQuestion(qIdx)}>✕</Button>
                  </div>
                  <div>
                    <Label>Текст питання</Label>
                    <Input value={q.text} onChange={e => handleQuestionChange(qIdx, 'text', e.target.value)} required />
                  </div>
               
                  <div className="flex space-x-4">
                    <div>
                      <Label>Оцінка</Label>
                      <Input type="number" step="0.1" value={q.value} onChange={e => handleQuestionChange(qIdx, 'value', parseFloat(e.target.value))} required />
                    </div>
                    <div>
                      <Label>Тип</Label>
                      <Select value={q.type} onValueChange={val => handleQuestionChange(qIdx, 'type', val)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SINGLE_CHOICE">Одиночний вибір</SelectItem>
                          <SelectItem value="MULTIPLE_CHOICE">Множинний вибір</SelectItem>
                           {/* <SelectItem value="OPEN">Відкрита відповідь</SelectItem> */}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {/* Answers */}
                  <div className="pl-4 border-l space-y-2">
                    <Label>Варіанти відповіді</Label>
                    {q.answers.map((a, aIdx) => (
                      <div key={aIdx} className="flex items-center space-x-2">
                        <Input value={a.text} onChange={e => handleAnswerChange(qIdx, aIdx, 'text', e.target.value)} placeholder="Текст відповіді" required />
                        <Label>Правильна?</Label>
                        <Checkbox
                            checked={a.isCorrect}
                            onCheckedChange={checked => handleAnswerChange(qIdx, aIdx, 'isCorrect', checked)}
                          />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeAnswer(qIdx, aIdx)}>✕</Button>
                      </div>
                    ))}
                    <Button type="button" onClick={() => addAnswer(qIdx)}>Додати відповідь</Button>
                  </div>
                </div>
              ))}
              <Button type="button" onClick={addQuestion}>Додати питання</Button>

              {error && <p className="text-red-500">{error}</p>}
              <Button type="submit" className="w-full mt-4">Створити тест</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
