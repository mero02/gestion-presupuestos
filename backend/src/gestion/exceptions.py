from typing import Dict, Any, List, Union
from src.gestion.constants import ErrorCode
from src.exceptions import NotFound, BadRequest, PermissionDenied

class UsuarioNoEncontrado(NotFound):
    DETAIL = ErrorCode.USUARIO_NO_ENCONTRADO

class UsuarioYaRegistrado(BadRequest):
    DETAIL = ErrorCode.USUARIO_YA_REGISTRADO

class EmailYaRegistrado(BadRequest):
    DETAIL = ErrorCode.EMAIL_YA_REGISTRADO

class EmailNoRegistrado(NotFound):
    DETAIL = ErrorCode.EMAIL_NO_REGISTRADO

class CredencialesIncorrectas(PermissionDenied):
    DETAIL = ErrorCode.CREDENCIALES_INCORRECTAS

class IngresoNoEncontrado(NotFound):
    DETAIL = ErrorCode.INGRESO_NO_ENCONTRADO

class GastoNoEncontrado(NotFound):
    DETAIL = ErrorCode.GASTO_NO_ENCONTRADO

class IngresoNoPerteneceAUsuario(PermissionDenied):
    DETAIL = ErrorCode.INGRESO_NO_PERTENECE_A_USUARIO

class GastoNoPerteneceAUsuario(PermissionDenied):
    DETAIL = ErrorCode.GASTO_NO_PERTENECE_A_USUARIO

class IngresoYaRegistrado(BadRequest):
    DETAIL = ErrorCode.INGRESO_YA_REGISTRADO

class GastoYaRegistrado(BadRequest):
    DETAIL = ErrorCode.GASTO_YA_REGISTRADO

class IngresoNoPerteneceAUsuario(PermissionDenied):
    DETAIL = ErrorCode.INGRESO_NO_PERTENECE_A_USUARIO
    
class ResumenNoEncontrado(NotFound):
    DETAIL = ErrorCode.RESUMEN_NO_ENCONTRADO
    
class CategoriaNoEncontrada(NotFound):
    DETAIL = ErrorCode.CATEGORIA_NO_ENCONTRADA