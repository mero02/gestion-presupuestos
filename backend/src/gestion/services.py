from typing import List
from sqlalchemy.orm import Session
from src.gestion.models import Usuario
from src.gestion import schemas, exceptions
from src.utils.jwt import create_access_token
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# CRUD para Usuario
def registrar_usuario(db: Session, usuario: schemas.UsuarioCreate) -> Usuario:
    db_usuario = Usuario.get(db, email=usuario.email)  
    if db_usuario:
        raise exceptions.BadRequest(detail="Email ya registrado.")
    nuevo_usuario = Usuario(
        nombre=usuario.nombre,
        email=usuario.email
    )
    nuevo_usuario.set_password(usuario.password)  
    return nuevo_usuario.save(db)

def autenticar_usuario(db: Session, email: str, password: str) -> str:
    db_usuario = Usuario.get(db, email=email)
    if not db_usuario or not db_usuario.verify_password(password):
        raise exceptions.BadRequest(detail="Credenciales inválidas.")
    # Generar token JWT
    return create_access_token({"sub": db_usuario.email})
