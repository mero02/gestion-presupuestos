from pydantic import BaseModel, EmailStr, field_validator
from typing import List, Optional
from datetime import datetime
from src.gestion.constants import ErrorCode
from src.gestion import exceptions

# Schemas para Usuario
class UsuarioBase(BaseModel):
    nombre: str
    email: EmailStr

class UsuarioCreate(BaseModel):
    nombre: str
    email: str
    password: str

class Usuario(BaseModel):
    id: int
    email: str

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    
# Schemas para Ingreso
class IngresoBase(BaseModel):
    monto: float
    fuente: str
    fecha: Optional[datetime] = None

class IngresoCreate(IngresoBase):
    id_usuario: int

class IngresoResponse(IngresoBase):
    id_ingreso: int
    id_usuario: int

    class Config:
        orm_mode = True

# Schemas para Gasto
class GastoBase(BaseModel):
    monto: float
    categoria: str
    fecha: Optional[datetime] = None

class GastoCreate(GastoBase):
    id_usuario: int

class GastoResponse(GastoBase):
    id_gasto: int
    id_usuario: int

    class Config:
        orm_mode = True

class Gasto(GastoResponse):
    pass