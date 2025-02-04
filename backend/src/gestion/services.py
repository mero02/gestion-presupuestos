from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from src.gestion.models import Usuario, Ingreso, Gasto, Resumen, CategoriaGasto, Moneda, Presupuesto
from src.gestion import schemas, exceptions
from src.utils.jwt import create_access_token
from passlib.context import CryptContext
from datetime import datetime, UTC, timedelta
from fastapi import HTTPException, status
from src.utils.external_api import obtener_tasas_cambio 

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# CRUD para Usuario
def registrar_usuario(db: Session, usuario: schemas.UsuarioCreate) -> Usuario:
    db_usuario = Usuario.get(db, email=usuario.email)
    if db_usuario:
        raise exceptions.EmailYaRegistrado()
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
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email, "name": user.nombre}, expires_delta=access_token_expires
    )
    return access_token

# CRUD para Ingresos
def crear_ingreso(db: Session, ingreso: schemas.IngresoCreate):
    nuevo_ingreso = Ingreso(
        id_usuario=ingreso.id_usuario,
        monto=ingreso.monto,
        fuente=ingreso.fuente,
        id_moneda=ingreso.id_moneda,
        fecha=ingreso.fecha or datetime.now(UTC)
    )
    db.add(nuevo_ingreso)
    db.commit()
    db.refresh(nuevo_ingreso)
    return nuevo_ingreso

def obtener_ingresos_por_usuario(db: Session, id_usuario: int, skip: int = 0, limit: int = 10):
    return db.query(Ingreso).filter(Ingreso.id_usuario == id_usuario).offset(skip).limit(limit).all()

def eliminar_ingreso(db: Session, id_ingreso: int):
    # Buscar el ingreso en la base de datos
    ingreso = db.query(Ingreso).filter(Ingreso.id_ingreso == id_ingreso).first()
    if not ingreso:
        return None  # Si no existe, retornar None
    # Eliminar el ingreso
    db.delete(ingreso)
    db.commit()
    return ingreso

def actualizar_ingreso(db: Session, id_ingreso: int, ingreso: schemas.IngresoCreate):
    db_ingreso = db.query(Ingreso).filter(Ingreso.id_ingreso == id_ingreso).first()
    if not db_ingreso:
        raise exceptions.IngresoNoEncontrado()
    db_ingreso.monto = ingreso.monto
    db_ingreso.fuente = ingreso.fuente
    db_ingreso.id_moneda = ingreso.id_moneda
    db.commit()
    db.refresh(db_ingreso)
    return db_ingreso

# CRUD para Gastos
def crear_gasto(db: Session, gasto: schemas.GastoCreate):
    nuevo_gasto = Gasto(
        id_usuario=gasto.id_usuario,
        monto=gasto.monto,
        id_categoria=gasto.id_categoria,
        fecha=gasto.fecha or datetime.now(UTC)
    )
    db.add(nuevo_gasto)
    db.commit()
    db.refresh(nuevo_gasto)
    return nuevo_gasto

def obtener_gastos_por_usuario(db: Session, id_usuario: int, skip: int = 0, limit: int = 10):
    return db.query(Gasto).filter(Gasto.id_usuario == id_usuario).offset(skip).limit(limit).all()

def eliminar_gasto(db: Session, id_gasto: int):
    # Buscar el gasto en la base de datos
    gasto = db.query(Gasto).filter(Gasto.id_gasto == id_gasto).first()
    if not gasto:
        return None  # Si no existe, retornar None
    # Eliminar el gasto
    db.delete(gasto)
    db.commit()
    return gasto

def actualizar_gasto(db: Session, id_gasto: int, gasto: schemas.GastoCreate):
    db_gasto = db.query(Gasto).filter(Gasto.id_gasto == id_gasto).first()
    if not db_gasto:
        raise exceptions.GastoNoEncontrado()
    db_gasto.monto = gasto.monto
    db_gasto.id_categoria = gasto.id_categoria
    db.commit()
    db.refresh(db_gasto)
    return db_gasto

# CRUD para Resumen
def obtener_resumen(db: Session, id_usuario: int, mes: int, anio: int) -> schemas.ResumenResponse:
    # Obtener tasas de cambio
    tasas_cambio = obtener_tasas_cambio()
    if not tasas_cambio:
        raise Exception("No se pudo obtener las tasas de cambio")

    # Verificar si el usuario existe
    usuario = db.query(Usuario).filter(Usuario.id == id_usuario).first()
    if not usuario:
        raise exceptions.UsuarioNoEncontrado()

    # Obtener el resumen si ya existe
    resumen = db.query(Resumen).filter(
        Resumen.id_usuario == id_usuario,
        extract("month", Resumen.fecha) == mes,
        extract("year", Resumen.fecha) == anio
    ).first()

    fecha_actual = datetime.now()
    mes_actual = fecha_actual.month
    anio_actual = fecha_actual.year

    if resumen:
        # Si el resumen es del mes y año actual, se actualiza
        if mes == mes_actual and anio == anio_actual:
            resumen.total_ingresos = calcular_total_ingresos(db, id_usuario, mes, anio, tasas_cambio)
            resumen.total_gastos = (
                db.query(func.sum(Gasto.monto))
                .filter(
                    Gasto.id_usuario == id_usuario,
                    extract("month", Gasto.fecha) == mes,
                    extract("year", Gasto.fecha) == anio
                )
                .scalar()
            )
            resumen.balance = resumen.total_ingresos - resumen.total_gastos
            resumen.fecha = fecha_actual  # Se actualiza la fecha de modificación
            db.commit()
            db.refresh(resumen)
        return resumen  # Retornar resumen ya existente (o actualizado si es mes/año actual)

    # Si no existe y NO es el mes/año actual, lanzar error
    if mes != mes_actual or anio != anio_actual:
        raise exceptions.ResumenNoEncontrado()

    # Si no existe pero ES el mes/año actual, se debe crear
    total_ingresos = calcular_total_ingresos(db, id_usuario, mes, anio, tasas_cambio)
    total_gastos = (
        db.query(func.sum(Gasto.monto))
        .filter(
            Gasto.id_usuario == id_usuario,
            extract("month", Gasto.fecha) == mes,
            extract("year", Gasto.fecha) == anio
        )
        .scalar()
    )
    nuevo_resumen = Resumen(
        id_usuario=id_usuario,
        total_ingresos=total_ingresos,
        total_gastos=total_gastos,
        balance=total_ingresos - total_gastos,
        fecha=fecha_actual
    )
    db.add(nuevo_resumen)
    db.commit()
    db.refresh(nuevo_resumen)

    return nuevo_resumen

def calcular_total_ingresos(db: Session, id_usuario: int, mes: int, anio: int, tasas_cambio: dict) -> float:
    # Diccionario para mapear nombres de moneda a códigos
    moneda_a_codigo = {
        'Pesos': 'ARS',  # Asumiendo que 'Pesos' es ARS
        'Dolar': 'USD',
        'Euro': 'EUR'
    }

    ingresos = db.query(Ingreso).filter(
        Ingreso.id_usuario == id_usuario,
        extract("month", Ingreso.fecha) == mes,
        extract("year", Ingreso.fecha) == anio
    ).all()

    total_ingresos = 0.0

    for ingreso in ingresos:
        monto = ingreso.monto
        moneda = db.query(Moneda).filter(Moneda.id_moneda == ingreso.id_moneda).first()
        
        if not moneda:
            raise Exception(f"Moneda con id {ingreso.id_moneda} no encontrada")
        
        moneda_nombre = moneda.nombre
        if moneda_nombre != "Pesos":
            # Obtener código de la moneda (ej: 'Dolar' -> 'USD')
            codigo_moneda = moneda_a_codigo.get('Pesos')
            if not codigo_moneda:
                raise Exception(f"Código no encontrado para la moneda: {moneda_nombre}")
            
            tasa = tasas_cambio.get(codigo_moneda)
            if not tasa:
                raise Exception(f"Tasa de cambio no encontrada para {codigo_moneda}")
            
            monto = monto * tasa
        
        total_ingresos += monto

    return total_ingresos

#CRUD categorias
def crear_categoria(db: Session, categoria: schemas.CategoriaGastoCreate):
    nueva_categoria = CategoriaGasto(nombre=categoria.nombre)
    db.add(nueva_categoria)
    db.commit()
    db.refresh(nueva_categoria)
    return nueva_categoria

def obtener_categorias(db: Session, skip: int = 0, limit: int = 10):
    return db.query(CategoriaGasto).offset(skip).limit(limit).all()

def obtener_categoria_por_id(db: Session, id_categoria: int):
    return db.query(CategoriaGasto).filter(CategoriaGasto.id_categoria == id_categoria).first()

def actualizar_categoria(db: Session, id_categoria: int, categoria: schemas.CategoriaGastoCreate):
    db_categoria = obtener_categoria_por_id(db, id_categoria)
    if not db_categoria:
        raise exceptions.CategoriaNoEncontrada()
    db_categoria.nombre = categoria.nombre
    db.commit()
    db.refresh(db_categoria)
    return db_categoria

def eliminar_categoria(db: Session, id_categoria: int):
    db_categoria = obtener_categoria_por_id(db, id_categoria)
    if not db_categoria:
        raise exceptions.CategoriaNoEncontrada()
    db.delete(db_categoria)
    db.commit()
    return db_categoria

#CRUD para Monedas
def crear_moneda(db: Session, moneda: schemas.MonedaCreate):
    nueva_moneda = Moneda(nombre=moneda.nombre)
    db.add(nueva_moneda)
    db.commit()
    db.refresh(nueva_moneda)
    return nueva_moneda

def obtener_monedas(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Moneda).offset(skip).limit(limit).all()

def actualizar_moneda(db: Session, id_moneda: int, moneda: schemas.MonedaCreate):
    db_moneda = db.query(Moneda).filter(Moneda.id_moneda == id_moneda).first()
    if not db_moneda:
        raise exceptions.MonedaNoEncontrada()
    db_moneda.nombre = moneda.nombre
    db.commit()
    db.refresh(db_moneda)
    return db_moneda

def eliminar_moneda(db: Session, id_moneda: int):
    db_moneda = db.query(Moneda).filter(Moneda.id_moneda == id_moneda).first()
    if not db_moneda:
        raise exceptions.MonedaNoEncontrada()
    db.delete(db_moneda)
    db.commit()
    return db_moneda

# CRUD para Presupuestos
def crear_presupuesto(db: Session, presupuesto: schemas.PresupuestoCreate):
    db_presupuesto = Presupuesto(
        id_usuario=presupuesto.id_usuario,
        id_categoria=presupuesto.id_categoria,
        id_moneda=presupuesto.id_moneda,
        monto_objetivo=presupuesto.monto_objetivo,
        periodo=presupuesto.periodo,
        fecha_inicio=presupuesto.fecha_inicio,
        fecha_fin=presupuesto.fecha_fin,
        monto_actual=0.0  
    )
    db.add(db_presupuesto)
    db.commit()
    db.refresh(db_presupuesto)
    return db_presupuesto

def obtener_presupuesto(db: Session, id_presupuesto: int):
    return db.query(Presupuesto).filter(Presupuesto.id_presupuesto == id_presupuesto).first()

def obtener_presupuestos_usuario(db: Session, id_usuario: int, skip: int = 0, limit: int = 10):
    return db.query(Presupuesto).filter(Presupuesto.id_usuario == id_usuario).offset(skip).limit(limit).all()

def actualizar_monto_actual(db: Session, id_presupuesto: int):
    presupuesto = db.query(Presupuesto).filter(Presupuesto.id_presupuesto == id_presupuesto).first()
    if not presupuesto:
        return None

    # Sumar los gastos de la categoría en el período del presupuesto
    monto_actual = db.query(func.sum(Gasto.monto)).filter(
        Gasto.id_categoria == presupuesto.id_categoria,
        Gasto.fecha >= presupuesto.fecha_inicio,
        Gasto.fecha <= presupuesto.fecha_fin
    ).scalar() or 0.0

    presupuesto.monto_actual = monto_actual
    db.commit()
    db.refresh(presupuesto)
    return presupuesto

def eliminar_presupuesto(db: Session, id_presupuesto: int):
    db_presupuesto = db.query(Presupuesto).filter(Presupuesto.id_presupuesto == id_presupuesto).first()
    if not db_presupuesto:
        return None
    db.delete(db_presupuesto)
    db.commit()
    return db_presupuesto
