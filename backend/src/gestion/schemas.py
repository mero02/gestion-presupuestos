from pydantic import BaseModel, EmailStr, field_validator
from typing import List
from datetime import datetime
from src.gestion.constants import ErrorCode
from src.gestion import exceptions

# Schemas para Usuario
class UsuarioBase(BaseModel):
    nombre: str
    email: EmailStr

class UsuarioCreate(UsuarioBase):
    password: str  

class Usuario(UsuarioBase):
    id: int
    fecha_creacion: datetime

    model_config = {"from_attributes": True}

class LoginRequest(BaseModel):
    email: EmailStr
    password: str