from typing import List
from sqlalchemy.orm import Session
from src.gestion.models import Usuario, Ingreso, Gasto
from src.gestion import schemas, exceptions
from src.utils.jwt import create_access_token
from passlib.context import CryptContext
from src.gestion.schemas import IngresoCreate
from datetime import datetime, UTC, timedelta
from fastapi import HTTPException, status

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ACCESS_TOKEN_EXPIRE_MINUTES = 30

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

def autenticar_usuario(db: Session, email: str, password: str):
    user = db.query(Usuario).filter(Usuario.email == email).first()
    if not user or not user.verify_password(password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email}, expires_delta=access_token_expires
    )
    return access_token

def crear_ingreso(db: Session, ingreso: IngresoCreate):
    nuevo_ingreso = Ingreso(
        id_usuario=ingreso.id_usuario,
        monto=ingreso.monto,
        fuente=ingreso.fuente,
        fecha=ingreso.fecha or datetime.now(UTC)
    )
    db.add(nuevo_ingreso)
    db.commit()
    db.refresh(nuevo_ingreso)
    return nuevo_ingreso

def obtener_ingresos_por_usuario(db: Session, id_usuario: int):
    return db.query(Ingreso).filter(Ingreso.id_usuario == id_usuario).all()

def crear_gasto(db: Session, gasto: schemas.GastoCreate):
    nuevo_gasto = Gasto(
        id_usuario=gasto.id_usuario,
        monto=gasto.monto,
        categoria=gasto.categoria,
        fecha=gasto.fecha or datetime.now(UTC)
    )
    db.add(nuevo_gasto)
    db.commit()
    db.refresh(nuevo_gasto)
    return nuevo_gasto

def obtener_gastos_por_usuario(db: Session, id_usuario: int):
    return db.query(Gasto).filter(Gasto.id_usuario == id_usuario).all()

