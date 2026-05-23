from fastapi import APIRouter, File, UploadFile, HTTPException
import openai
from config import settings
import shutil
import os

router = APIRouter()

@router.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    if not settings.OPENAI_API_KEY:
        return {"text": "Cloud STT not configured. (Mock) Accident reported.", "language": "en"}

    temp_path = f"temp_{file.filename}"
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        client = openai.AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY,
            base_url=settings.AI_BASE_URL
        )
        
        with open(temp_path, "rb") as audio_file:
            # Note: Groq uses 'whisper-large-v3' for STT
            stt_model = "whisper-large-v3" if "groq" in settings.AI_BASE_URL else "whisper-1"
            transcript = await client.audio.transcriptions.create(
                model=stt_model, 
                file=audio_file
            )
        
        return {"text": transcript.text, "language": "auto"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
