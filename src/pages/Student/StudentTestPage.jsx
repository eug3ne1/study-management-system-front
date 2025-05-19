import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentHeader from '@/components/StudentHeader';
import BackButton from '@/components/BackButton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { getTest, submitTest } from '@/api/tests.js';

export default function StudentTakeTestPage() {
  const { courseId, testId } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [radioAnswers, setRadioAnswers] = useState({});
  const [checkboxAnswers, setCheckboxAnswers] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    getTest(testId)
      .then(data => setTest(data))
      .catch(() => setError('Не вдалося завантажити тест'));
  }, [testId]);

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Завантаження…
      </div>
    );
  }

  const handleRadio = (questionId, value) => {
    setRadioAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleCheckbox = (questionId, answerId, checked) => {
    setCheckboxAnswers(prev => {
      const list = prev[questionId] || [];
      return {
        ...prev,
        [questionId]: checked
          ? [...list, answerId]
          : list.filter(id => id !== answerId)
      };
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const payload = {
      testId: Number(testId),
      answers: test.questions.map(q => {
        if (q.type === 'SINGLE_CHOICE') {
          const sel = radioAnswers[q.id];
          return {
            questionId: q.id,
            selectedAnswerIds: sel ? [Number(sel)] : []
          };
        }
        if (q.type === 'MULTIPLE_CHOICE') {
          const arr = checkboxAnswers[q.id] || [];
          return {
            questionId: q.id,
            selectedAnswerIds: arr.map(id => Number(id))
          };
        }
        return { questionId: q.id, selectedAnswerIds: [] };
      })
    };

    try {
      await submitTest(payload);
      navigate(`/student/courses/${courseId}`);
    } catch {
      setError('Помилка при відправці результатів');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <StudentHeader />
      <div className="max-w-3xl mx-auto mt-6 px-4">
        <BackButton />
        <Card>
          <CardHeader>
            <CardTitle>Тест: {test.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{test.description}</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              {test.questions.map((q, idx) => (
                <div key={q.id} className="space-y-3">
                  <h3 className="font-semibold">
                    {idx + 1}. {q.text} ({q.value} бал{q.value > 1 ? 'ів' : ''})
                  </h3>

                  {q.type === 'SINGLE_CHOICE' && (
                    <RadioGroup
                      name={`question-${q.id}`}             
                      value={radioAnswers[q.id] || ''}
                      onValueChange={val => handleRadio(q.id, val)}
                      className="space-y-2"
                    >
                      {q.answers.map(a => (
                        <div key={a.id} className="flex items-center space-x-2">
                          <RadioGroupItem
                            id={`q${q.id}_a${a.id}`}
                            name={`question-${q.id}`}         
                            value={String(a.id)}
                          />
                          <label htmlFor={`q${q.id}_a${a.id}`}>{a.text}</label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {q.type === 'MULTIPLE_CHOICE' && (
                    <div className="space-y-2">
                      {q.answers.map(a => (
                        <div key={a.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`q${q.id}_a${a.id}`}
                            checked={(checkboxAnswers[q.id] || []).includes(a.id)}
                            onCheckedChange={checked =>
                              handleCheckbox(q.id, a.id, checked)
                            }
                          />
                          <label htmlFor={`q${q.id}_a${a.id}`}>{a.text}</label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {error && <p className="text-red-500">{error}</p>}
              <Button type="submit" className="w-full">
                Завершити тест
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
