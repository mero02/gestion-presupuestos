from typing import List
from sqlalchemy.orm import Session
from src.gestion.models import Usuario
from src.gestion import schemas, exceptions

# CRUD para Usuario
def crear_usuario(db: Session, usuario: schemas.UsuarioCreate) -> Usuario:
    return Usuario.create(db, nombre=usuario.nombre, email=usuario.email)

def listar_usuarios(db: Session) -> List[Usuario]:
    return Usuario.get_all(db)

def leer_usuario(db: Session, usuario_id: int) -> Usuario:
    db_usuario = Usuario.get(db, usuario_id)
    if db_usuario is None:
        raise exceptions.UsuarioNoEncontrado()
    return db_usuario

def modificar_usuario(db: Session, usuario_id: int, usuario: schemas.UsuarioUpdate) -> Usuario:
    db_usuario = leer_usuario(db, usuario_id)
    return db_usuario.update(db, nombre=usuario.nombre, email=usuario.email)

def eliminar_usuario(db: Session, usuario_id: int) -> Usuario:
    db_usuario = leer_usuario(db, usuario_id)
    db_usuario.delete(db)
    return db_usuario