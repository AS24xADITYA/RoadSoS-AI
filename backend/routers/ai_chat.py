from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import openai
from config import settings

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, str]] = []

@router.post("/chat")
async def chat(request: ChatRequest):
    if not settings.OPENAI_API_KEY:
        # Fallback to mock if no key
        return {"answer": "Cloud AI not configured. (Mock) Please apply pressure to bleeding.", "sources": ["Mock Fallback"]}

    try:
        client = openai.AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY,
            base_url=settings.AI_BASE_URL
        )
        
        messages = [{"role": "system", "content": "You are a calm, authoritative emergency first-aid assistant. Provide medically-grounded advice based on WHO guidelines. Always recommend calling professional help (108 in India). Keep it brief and bulleted."}]
        for h in request.history:
            messages.append(h)
        messages.append({"role": "user", "content": request.message})
        
        response = await client.chat.completions.create(
            model=settings.AI_MODEL,
            messages=messages,
            temperature=0.1
        )
        
        answer = response.choices[0].message.content
        return {"answer": answer, "sources": ["OpenAI GPT-4o-mini", "WHO First Aid Guidelines"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
