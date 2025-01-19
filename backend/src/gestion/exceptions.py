from typing import Dict, Any, List, Union
from src.gestion.constants import ErrorCode
from src.exceptions import NotFound, BadRequest, PermissionDenied

class UsuarioNoEncontrado(NotFound):
    DETAIL = ErrorCode.USUARIO_NO_ENCONTRADO
