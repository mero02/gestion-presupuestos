from pydantic import BaseModel, EmailStr, Field, validator
from typing import List, Optional
from datetime import datetime, date

# Esquema base para fechas
class FechaBase(BaseModel):
    fecha: Optional[datetime] = Field(
        default=None,
        description="Fecha del registro. Si no se proporciona, se usará la fecha actual."
    )

# Esquema base para montos
class MontoBase(BaseModel):
    monto: float = Field(..., gt=0, description="El monto debe ser un número positivo.")

    @validator("monto")
    def monto_positivo(cls, v):
        if v <= 0:
            raise ValueError("El monto debe ser un número positivo.")
        return v

# Schemas para Usuario
class UsuarioBase(BaseModel):
    nombre: str = Field(..., example="Juan Pérez")
    email: EmailStr = Field(..., example="juan.perez@example.com")

class UsuarioCreate(UsuarioBase):
    password: str = Field(..., min_length=8, example="password123")

class Usuario(UsuarioBase):
    id: int = Field(..., example=1)

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: str = Field(..., example="juan.perez@example.com")
    password: str = Field(..., example="password123")

class Token(BaseModel):
    access_token: str = Field(..., example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    token_type: str = Field(default="bearer", example="bearer")

# Schemas para Ingreso
class IngresoBase(MontoBase, FechaBase):
    monto: float
    fuente: str = Field(..., example="Salario")
    id_moneda: int = Field(..., example=1)

class IngresoCreate(IngresoBase):
    id_usuario: int = Field(..., example=1)

class IngresoResponse(IngresoBase):
    id_ingreso: int = Field(..., example=1)
    id_usuario: int = Field(..., example=1)

    class Config:
        from_attributes = True

# Schemas para Gasto
class GastoBase(BaseModel):
    monto: float
    id_categoria: int
    fecha: Optional[datetime] = None

class GastoCreate(GastoBase):
    id_usuario: int

class GastoResponse(GastoBase):
    id_gasto: int
    id_usuario: int

    class Config:
        from_attributes = True

# Schemas para Categoría de Gasto
class CategoriaGastoBase(BaseModel):
    nombre: str = Field(..., example="Comida")

class CategoriaGastoCreate(CategoriaGastoBase):
    pass

class CategoriaGasto(CategoriaGastoBase):
    id_categoria: int = Field(..., example=1)

    class Config:
        from_attributes = True

        
# Schemas para Resumen
class ResumenBase(BaseModel):
    total_ingresos: float = Field(..., example=5000.0)
    total_gastos: float = Field(..., example=3000.0)
    balance: float = Field(..., example=2000.0)
    fecha: Optional[datetime] = Field(default=None, example="2023-10-01T00:00:00")

class ResumenCreate(ResumenBase):
    id_usuario: int = Field(..., example=1)

class ResumenResponse(ResumenBase):
    id_resumen: int = Field(..., example=1)
    id_usuario: int = Field(..., example=1)

    class Config:
        from_attributes = True
        
# Schemas de las categorias
class CategoriaGastoBase(BaseModel):
    nombre: str = Field(..., example="Comida")

class CategoriaGastoCreate(CategoriaGastoBase):
    pass

class CategoriaGasto(CategoriaGastoBase):
    id_categoria: int = Field(..., example=1)

    class Config:
        from_attributes = True
        
# Schemas para Moneda
class MonedaBase(BaseModel):
    nombre: str = Field(..., example="Dólar")

class MonedaCreate(MonedaBase):
    pass

class Moneda(MonedaBase):
    id_moneda: int = Field(..., example=1)

    class Config:
        from_attributes = True
        
# schemas para presupuesto
class PresupuestoCreate(BaseModel):
    id_categoria: int = Field(..., description="ID de la categoría asociada al presupuesto")
    id_moneda: int = Field(..., description="ID de la moneda asociada al presupuesto")
    monto_objetivo: float = Field(..., description="Monto objetivo del presupuesto")
    periodo: str = Field(..., description="Período del presupuesto (ej: mensual, trimestral, anual)")
    fecha_inicio: datetime = Field(..., description="Fecha de inicio del presupuesto")
    fecha_fin: datetime = Field(..., description="Fecha de fin del presupuesto")

class PresupuestoResponse(BaseModel):
    id_presupuesto: int
    id_usuario: int
    id_categoria: int
    id_moneda: int
    monto_objetivo: float
    monto_actual: float
    periodo: str
    fecha_inicio: datetime
    fecha_fin: datetime

    class Config:
        from_attributes = True 