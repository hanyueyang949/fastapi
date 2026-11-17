from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from controller.sport_controller import (
    create_sport,
    delete_sport,
    get_all_sports,
    get_sport_by_id,
    update_sport,
)
from database.database import get_db
from schema.sport_schema import SportCreate, SportResponse

router = APIRouter(prefix="/deportes", tags=["deportes"])


@router.get(
    "/",
    response_model=list[SportResponse],
    summary="Listar deportes",
)
def read_sports(
    skip: int = Query(0, ge=0, description="Registros a saltar"),
    limit: int = Query(100, ge=1, le=100, description="Máximo de registros"),
    db: Session = Depends(get_db),
):
    return get_all_sports(db=db, skip=skip, limit=limit)


@router.post(
    "/",
    response_model=SportResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear un deporte",
    description="Añade un deporte nuevo al catálogo de letdosport.",
)
def create_new_sport(
    sport_data: SportCreate,
    db: Session = Depends(get_db),
):
    return create_sport(db=db, sport_data=sport_data)


@router.get(
    "/{sport_id}",
    response_model=SportResponse,
    summary="Obtener un deporte por id",
)
def read_one_sport(
    sport_id: int,
    db: Session = Depends(get_db),
):
    return get_sport_by_id(db=db, sport_id=sport_id)


@router.put(
    "/{sport_id}",
    response_model=SportResponse,
    summary="Actualizar un deporte",
)
def update_existing_sport(
    sport_id: int,
    sport_data: SportCreate,
    db: Session = Depends(get_db),
):
    return update_sport(db=db, sport_id=sport_id, sport_data=sport_data)


@router.delete(
    "/{sport_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar un deporte",
)
def delete_existing_sport(
    sport_id: int,
    db: Session = Depends(get_db),
):
    delete_sport(db=db, sport_id=sport_id)
