from typing import Optional, List
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from enum import auto, StrEnum
from datetime import datetime, UTC
from src.models import BaseModel  
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Usuario(BaseModel):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String)  # Campo para contraseña hasheada
    fecha_creacion: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(UTC))

    ingresos: Mapped[List["Ingreso"]] = relationship(
        "Ingreso", back_populates="usuario", cascade="all, delete-orphan"
    )
    gastos: Mapped[List["Gasto"]] = relationship(
        "Gasto", back_populates="usuario", cascade="all, delete-orphan"
    )
    # Métodos para manejar hashing de contraseñas
    def set_password(self, password: str):
        self.hashed_password = pwd_context.hash(password)

    def verify_password(self, password: str) -> bool:
        return pwd_context.verify(password, self.hashed_password)
    
class Ingreso(BaseModel):
    __tablename__ = "ingresos"

    id_ingreso: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    id_usuario: Mapped[int] = mapped_column(ForeignKey("usuarios.id"), nullable=False)
    monto: Mapped[float] = mapped_column(Integer, nullable=False)
    fuente: Mapped[str] = mapped_column(String, nullable=False)
    fecha: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(UTC))

    # Relación con el usuario
    usuario = relationship("Usuario", back_populates="ingresos")
    
class Gasto(BaseModel):
    __tablename__ = "gastos"

    id_gasto: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    id_usuario: Mapped[int] = mapped_column(ForeignKey("usuarios.id"), nullable=False)
    monto: Mapped[float] = mapped_column(Integer, nullable=False)
    categoria: Mapped[str] = mapped_column(String, nullable=False)
    fecha: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(UTC))

    # Relación con el usuario
    usuario = relationship("Usuario", back_populates="gastos")