from fastapi import APIRouter, HTTPException
from app.schemas.schemas import PresignedUploadRequest, PresignedUploadResponse
from app.config import settings
import uuid
import time

router = APIRouter(prefix="/uploads", tags=["uploads"])

ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "audio/ogg", "audio/mpeg", "audio/wav", "audio/m4a"]

@router.post("/sign", response_model=PresignedUploadResponse)
def generate_presigned_url(req: PresignedUploadRequest):
    if req.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Disallowed content type. Only images and audio files are supported.")
        
    ext = req.filename.split(".")[-1] if "." in req.filename else "bin"
    file_key = f"evidence/{uuid.uuid4().hex}.{ext}"
    
    # In cloud with AWS S3 / Cloudflare R2, generate presigned url using boto3.
    # For local/simulation mode, provide a mock signature endpoint that expires in 300 seconds.
    expires_at = int(time.time()) + 300
    upload_url = f"https://{settings.R2_BUCKET}.r2.cloudflarestorage.com/{file_key}?expires={expires_at}&signature=mock_sign"
    public_url = f"https://cdn.resolveiq.gov.in/{file_key}"
    
    return PresignedUploadResponse(
        upload_url=upload_url,
        file_key=file_key,
        public_url=public_url
    )

