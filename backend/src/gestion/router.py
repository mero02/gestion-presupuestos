from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from src.database import get_db
from src.gestion import schemas, services
from src.auth.dependencies import get_current_user
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
@router.post("/ingresos/", response_model=schemas.IngresoResponse)
def registrar_ingreso(
    ingreso: schemas.IngresoCreate,
    db: Session = Depends(get_db),
    current_user: schemas.Usuario = Depends(get_current_user)
):
    return services.crear_ingreso(db, ingreso)

@router.get("/ingresos/{id_usuario}", response_model=List[schemas.IngresoResponse])
def listar_ingresos(
    id_usuario: int,
    skip: int = Query(0, description="Número de registros a saltar"),
    limit: int = Query(10, description="Número máximo de registros a devolver"),
    db: Session = Depends(get_db),
    current_user: schemas.Usuario = Depends(get_current_user)
):
    ingresos = services.obtener_ingresos_por_usuario(db, id_usuario, skip, limit)
    if not ingresos:
        raise HTTPException(status_code=404, detail="No se encontraron ingresos para este usuario")
    return ingresos

@router.delete("/ingresos/{id_ingreso}", response_model=schemas.IngresoResponse)
def eliminar_ingreso(
    id_ingreso: int,
    db: Session = Depends(get_db),
    current_user: schemas.Usuario = Depends(get_current_user)
):
    ingreso = services.eliminar_ingreso(db, id_ingreso)
    if not ingreso:
        raise HTTPException(status_code=404, detail="Ingreso no encontrado")
    return ingreso

@router.put("/ingresos/{id_ingreso}", response_model=schemas.IngresoResponse)
def actualizar_ingreso(
    id_ingreso: int,
    ingreso: schemas.IngresoCreate,
    db: Session = Depends(get_db),
    current_user: schemas.Usuario = Depends(get_current_user)
):
    return services.actualizar_ingreso(db, id_ingreso, ingreso)

# Rutas para Gastos
@router.post("/gastos/", response_model=schemas.GastoResponse)
def registrar_gasto(
    gasto: schemas.GastoCreate,
    db: Session = Depends(get_db),
    current_user: schemas.Usuario = Depends(get_current_user)
):
    return services.crear_gasto(db, gasto)

@router.get("/gastos/{id_usuario}", response_model=List[schemas.GastoResponse])
def listar_gastos(
    id_usuario: int,
    skip: int = Query(0, description="Número de registros a saltar"),
    limit: int = Query(10, description="Número máximo de registros a devolver"),
    db: Session = Depends(get_db),
    current_user: schemas.Usuario = Depends(get_current_user)
):
    gastos = services.obtener_gastos_por_usuario(db, id_usuario, skip, limit)
    if not gastos:
        raise HTTPException(status_code=404, detail="No se encontraron gastos para este usuario")
    return gastos

@router.delete("/gastos/{id_gasto}", response_model=schemas.GastoResponse)
def eliminar_gasto(
    id_gasto: int,
    db: Session = Depends(get_db),
    current_user: schemas.Usuario = Depends(get_current_user)
):
    gasto = services.eliminar_gasto(db, id_gasto)
    if not gasto:
        raise HTTPException(status_code=404, detail="Gasto no encontrado")
    return gasto

@router.put("/gastos/{id_gasto}", response_model=schemas.GastoResponse)
def actualizar_gasto(
    id_gasto: int,
    gasto: schemas.GastoCreate,
    db: Session = Depends(get_db),
    current_user: schemas.Usuario = Depends(get_current_user)
):
    return services.actualizar_gasto(db, id_gasto, gasto)

# Rutas para Resumen
@router.get("/resumen/{id_usuario}/{mes}/{anio}", response_model=schemas.ResumenResponse)
def obtener_resumen(
    id_usuario: int,
    mes: int,
    anio: int,
    db: Session = Depends(get_db),
    current_user: schemas.Usuario = Depends(get_current_user)
):
    return services.obtener_resumen(db, id_usuario, mes, anio)

# Rutas para Categorías
@router.post("/categorias/", response_model=schemas.CategoriaGasto)
def crear_categoria(
    categoria: schemas.CategoriaGastoCreate,
    db: Session = Depends(get_db),
    current_user: schemas.Usuario = Depends(get_current_user)
):
    return services.crear_categoria(db, categoria)

@router.get("/categorias/", response_model=List[schemas.CategoriaGasto])
def listar_categorias(
    skip: int = Query(0, description="Número de registros a saltar"),
    limit: int = Query(10, description="Número máximo de registros a devolver"),
    db: Session = Depends(get_db)
):
    return services.obtener_categorias(db, skip, limit)

@router.put("/categorias/{id_categoria}", response_model=schemas.CategoriaGasto)
def actualizar_categoria(
    id_categoria: int,
    categoria: schemas.CategoriaGastoCreate,
    db: Session = Depends(get_db),
    current_user: schemas.Usuario = Depends(get_current_user)
):
    return services.actualizar_categoria(db, id_categoria, categoria)

@router.delete("/categorias/{id_categoria}", response_model=schemas.CategoriaGasto)
def eliminar_categoria(
    id_categoria: int,
    db: Session = Depends(get_db),
    current_user: schemas.Usuario = Depends(get_current_user)
):
    return services.eliminar_categoria(db, id_categoria)

@router.get("/categorias/{id_categoria}", response_model=schemas.CategoriaGasto)
def obtener_categoria(
    id_categoria: int,
    db: Session = Depends(get_db)
):
    categoria = services.obtener_categoria_por_id(db, id_categoria)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return categoria

# Rutas para Monedas
@router.post("/monedas/", response_model=schemas.Moneda)
def crear_moneda(
    moneda: schemas.MonedaCreate,
    db: Session = Depends(get_db),
    current_user: schemas.Usuario = Depends(get_current_user)
):
    return services.crear_moneda(db, moneda)

@router.get("/monedas/", response_model=List[schemas.Moneda])
def listar_monedas(
    skip: int = Query(0, description="Número de registros a saltar"),
    limit: int = Query(10, description="Número máximo de registros a devolver"),
    db: Session = Depends(get_db)
):
    return services.obtener_monedas(db, skip, limit)

@router.put("/monedas/{id_moneda}", response_model=schemas.Moneda)
def actualizar_moneda(
    id_moneda: int,
    moneda: schemas.MonedaCreate,
    db: Session = Depends(get_db),
    current_user: schemas.Usuario = Depends(get_current_user)
):
    return services.actualizar_moneda(db, id_moneda, moneda)

@router.delete("/monedas/{id_moneda}", response_model=schemas.Moneda)
def eliminar_moneda(
    id_moneda: int,
    db: Session = Depends(get_db),
    current_user: schemas.Usuario = Depends(get_current_user)
):
    return services.eliminar_moneda(db, id_moneda)

# Rutas para Presupuestos
@router.post("/presupuestos/", response_model=schemas.PresupuestoResponse)
def crear_presupuesto(
    presupuesto: schemas.PresupuestoCreate,
    db: Session = Depends(get_db),
    current_user: schemas.Usuario = Depends(get_current_user)
):
    return services.crear_presupuesto(db, presupuesto)

@router.get("/presupuestos/{id_usuario}", response_model=List[schemas.PresupuestoResponse])
def listar_presupuestos(
    id_usuario: int,
    skip: int = Query(0, description="Número de registros a saltar"),
    limit: int = Query(10, description="Número máximo de registros a devolver"),
    db: Session = Depends(get_db),
    current_user: schemas.Usuario = Depends(get_current_user)
):
    presupuestos = services.obtener_presupuestos_usuario(db, id_usuario, skip, limit)
    if not presupuestos:
        raise HTTPException(status_code=404, detail="No se encontraron presupuestos para este usuario")
    return presupuestos

@router.get("/presupuestos/detalle/{id_presupuesto}", response_model=schemas.PresupuestoResponse)
def obtener_presupuesto(
    id_presupuesto: int,
    db: Session = Depends(get_db),
    current_user: schemas.Usuario = Depends(get_current_user)
):
    """
    Obtiene un presupuesto específico por su ID.
    """
    presupuesto = services.obtener_presupuesto_por_id(db, id_presupuesto)
    if not presupuesto or presupuesto.id_usuario != current_user.id:
        raise HTTPException(status_code=404, detail="Presupuesto no encontrado")
    return presupuesto

@router.put("/presupuestos/{id_presupuesto}", response_model=schemas.PresupuestoResponse)
def actualizar_presupuesto(
    id_presupuesto: int,
    presupuesto: schemas.PresupuestoCreate,
    db: Session = Depends(get_db),
    current_user: schemas.Usuario = Depends(get_current_user)
):
    """
    Actualiza un presupuesto existente.
    """
    presupuesto_actualizado = services.actualizar_presupuesto(db, id_presupuesto, presupuesto, current_user.id)
    if not presupuesto_actualizado:
        raise HTTPException(status_code=404, detail="Presupuesto no encontrado")
    return presupuesto_actualizado

@router.delete("/presupuestos/{id_presupuesto}", response_model=schemas.PresupuestoResponse)
def eliminar_presupuesto(
    id_presupuesto: int,
    db: Session = Depends(get_db),
    current_user: schemas.Usuario = Depends(get_current_user)
):
    presupuesto_eliminado = services.eliminar_presupuesto(db, id_presupuesto)
    if not presupuesto_eliminado:
        raise HTTPException(status_code=404, detail="Presupuesto no encontrado")
    return presupuesto_eliminado

@router.put("/presupuestos/{id_presupuesto}/actualizar-monto", response_model=schemas.PresupuestoResponse)
def actualizar_monto_presupuesto(
    id_presupuesto: int,
    db: Session = Depends(get_db),
    current_user: schemas.Usuario = Depends(get_current_user)
):
    """
    Actualiza el monto actual de un presupuesto basado en los gastos registrados.
    """
    presupuesto = services.actualizar_monto_actual(db, id_presupuesto, current_user.id)
    if not presupuesto:
        raise HTTPException(status_code=404, detail="Presupuesto no encontrado")
    return presupuesto