import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';

export default function BackButton() {
    const navigate = useNavigate();
    return (
           <Button
                          variant="secondary"
                          onClick={() => navigate(-1)}  // повернутися на попередню сторінку
                          className="px-4 py-1"
                        >
                          ← Назад
                  
                  </Button>


    )
}