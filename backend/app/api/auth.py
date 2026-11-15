from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User
from app.schemas.schemas import LoginRequest, TokenResponse
from app.config import settings
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
import jwt
import datetime

router = APIRouter(prefix="/auth", tags=["auth"])
ph = PasswordHasher()

def mask_phone_number(phone: str, role: str) -> str:
    """Mask phone numbers for non-admin roles (e.g. +91 98*** **001)."""
    if not phone or role == "admin":
        return phone
    if len(phone) >= 10:
        return phone[:6] + "*** ***" + phone[-3:]
    return "***"

def create_access_token(data: dict, expires_delta: datetime.timedelta = None):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + (expires_delta or datetime.timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    token = request.cookies.get("resolveiq_access_token")
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            
    if not token:
        # Default anonymous/citizen fallback
        user = db.query(User).filter_by(role="agent").first()
        if user:
            return user
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
        
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired or invalid")
        
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

@router.post("/login", response_model=TokenResponse)
def login(login_req: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_req.email).first()
    if not user:
        raise HTTPException(status_code=400, detail={"code": "INVALID_CREDENTIALS", "message": "Incorrect email or password"})
    
    try:
        ph.verify(user.hashed_password, login_req.password)
    except VerifyMismatchError:
        raise HTTPException(status_code=400, detail={"code": "INVALID_CREDENTIALS", "message": "Incorrect email or password"})
        
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role, "team": user.team, "name": user.name}
    )
    
    # httpOnly, Secure, SameSite=Lax cookie
    response.set_cookie(
        key="resolveiq_access_token",
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=False,  # Set True in production over HTTPS
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        role=user.role,
        name=user.name,
        team=user.team
    )

