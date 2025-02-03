from typing import List, Optional
from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, UTC
from src.models import BaseModel
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Usuario(BaseModel):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String)
    fecha_creacion: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(UTC))

    # Relaciones
    ingresos: Mapped[List["Ingreso"]] = relationship(
        "Ingreso", back_populates="usuario", cascade="all, delete-orphan"
    )
    gastos: Mapped[List["Gasto"]] = relationship(
        "Gasto", back_populates="usuario", cascade="all, delete-orphan"
    )
    resumen: Mapped[Optional["Resumen"]] = relationship(
        "Resumen", back_populates="usuario", cascade="all, delete-orphan"
    )

    def set_password(self, password: str):
        self.hashed_password = pwd_context.hash(password)

    def verify_password(self, password: str) -> bool:
        return pwd_context.verify(password, self.hashed_password)

class CategoriaGasto(BaseModel):
    __tablename__ = "categorias_gasto"

    id_categoria: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    
    # Relación con los gastos
    gastos: Mapped[List["Gasto"]] = relationship("Gasto", back_populates="categoria")

class Ingreso(BaseModel):
    __tablename__ = "ingresos"

    id_ingreso: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    id_usuario: Mapped[int] = mapped_column(ForeignKey("usuarios.id"), nullable=False)
    monto: Mapped[float] = mapped_column(Float, nullable=False)
    id_moneda: Mapped[int] = mapped_column(ForeignKey("monedas.id_moneda"), nullable=False)
    fuente: Mapped[str] = mapped_column(String, nullable=False)
    fecha: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(UTC))

    # Relación con Usuario
    usuario: Mapped["Usuario"] = relationship("Usuario", back_populates="ingresos")
    moneda: Mapped["Moneda"] = relationship("Moneda", back_populates="ingresos")

class Gasto(BaseModel):
    __tablename__ = "gastos"

    id_gasto: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    id_usuario: Mapped[int] = mapped_column(ForeignKey("usuarios.id"), nullable=False)
    id_categoria: Mapped[int] = mapped_column(ForeignKey("categorias_gasto.id_categoria"), nullable=False)
    monto: Mapped[float] = mapped_column(Float, nullable=False)
    fecha: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(UTC))

    # Relaciones
    usuario: Mapped["Usuario"] = relationship("Usuario", back_populates="gastos")
    categoria: Mapped["CategoriaGasto"] = relationship("CategoriaGasto", back_populates="gastos")

class Resumen(BaseModel):
    __tablename__ = "resumen"

    id_resumen: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    id_usuario: Mapped[int] = mapped_column(ForeignKey("usuarios.id"), nullable=False)
    total_ingresos: Mapped[float] = mapped_column(Float, nullable=False)
    total_gastos: Mapped[float] = mapped_column(Float, nullable=False)
    balance: Mapped[float] = mapped_column(Float, nullable=False)
    fecha: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(UTC))

    # Relación con Usuario
    usuario: Mapped["Usuario"] = relationship("Usuario", back_populates="resumen")

class Moneda(BaseModel):
    __tablename__ = "monedas"

    id_moneda: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, unique=True, nullable=False)

    # Relación con los ingresos
    ingresos: Mapped[List["Ingreso"]] = relationship("Ingreso", back_populates="moneda")

class Presupuesto(BaseModel):
    __tablename__ = "presupuestos"

    id_presupuesto: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    id_usuario: Mapped[int] = mapped_column(ForeignKey("usuarios.id"), nullable=False)
    id_categoria: Mapped[int] = mapped_column(ForeignKey("categorias_gasto.id_categoria"), nullable=False)
    id_moneda: Mapped[int] = mapped_column(ForeignKey("monedas.id_moneda"), nullable=False)
    monto_objetivo: Mapped[float] = mapped_column(Float, nullable=False)
    monto_actual: Mapped[float] = mapped_column(Float, default=0.0)
    periodo: Mapped[str] = mapped_column(String, nullable=False)  # Ej: "mensual", "trimestral", "anual"
    fecha_inicio: Mapped[datetime] = mapped_column(DateTime)
    fecha_fin: Mapped[datetime] = mapped_column(DateTime)
    
    # Relaciones
    usuario: Mapped["Usuario"] = relationship("Usuario")
    categoria: Mapped["CategoriaGasto"] = relationship("CategoriaGasto")
    moneda: Mapped["Moneda"] = relationship("Moneda")