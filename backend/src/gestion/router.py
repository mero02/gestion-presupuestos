from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from src.gestion import models, schemas, exceptions, services
from src.auth.dependencies import get_current_user

router = APIRouter()

# Rutas para Usuarios
@router.post("/register", response_model=schemas.Usuario)
def register(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    return services.registrar_usuario(db, usuario)

@router.post("/login")
def login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    token = services.autenticar_usuario(db, request.email, request.password)
    return {"access_token": token, "token_type": "bearer"}

@router.get("/usuarios/me", response_model=schemas.Usuario)
def read_own_user(current_user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    usuario = models.Usuario.get(db, email=current_user)
    if not usuario:
        raise exceptions.NotFound(detail="Usuario no encontrado")
    return usuario