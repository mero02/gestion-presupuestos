from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from src.gestion import models, schemas, exceptions, services
from src.auth.dependencies import get_current_user
from .schemas import IngresoCreate, IngresoResponse, GastoCreate, GastoResponse
from .services import crear_ingreso, obtener_ingresos_por_usuario, obtener_gastos_por_usuario, crear_gasto
from typing import List

router = APIRouter()

# Rutas para Usuarios
@router.post("/register", response_model=schemas.Usuario)
def register(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    return services.registrar_usuario(db, usuario)

@router.post("/login", response_model=schemas.Token)
def login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    token = services.autenticar_usuario(db, request.email, request.password)
    return {"access_token": token, "token_type": "bearer"}

# Rutas para Ingresos

@router.post("/ingresos/", response_model=IngresoResponse)
def registrar_ingreso(ingreso: IngresoCreate, db: Session = Depends(get_db)):
    return crear_ingreso(db, ingreso)

@router.get("/ingresos/{id_usuario}", response_model=List[IngresoResponse])
def listar_ingresos(id_usuario: int, db: Session = Depends(get_db)):
    ingresos = obtener_ingresos_por_usuario(db, id_usuario)
    if not ingresos:
        raise HTTPException(status_code=404, detail="No se encontraron ingresos para este usuario")
    return ingresos

# Rutas para Gastos
@router.post("/gastos/", response_model=schemas.Gasto)
def registrar_gasto(gasto: schemas.GastoCreate, db: Session = Depends(get_db)):
    return services.crear_gasto(db, gasto)

@router.get("/gastos/{id_usuario}", response_model=List[schemas.Gasto])
def listar_gastos(id_usuario: int, db: Session = Depends(get_db)):
    gastos = services.obtener_gastos_por_usuario(db, id_usuario)
    if not gastos:
        raise HTTPException(status_code=404, detail="No se encontraron gastos para este usuario")
    return gastos