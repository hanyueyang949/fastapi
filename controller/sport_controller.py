from typing import List

from fastapi import HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from models.sport_model import Sport
from schema.sport_schema import SportCreate


def _error_base_datos(error: Exception) -> HTTPException:
    """Un solo lugar para el error 500: evita repetir el mismo texto 4 veces."""
    return HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=f"Hay problemas en la conexión con la base de datos: {str(error)}",
    )


def get_all_sports(db: Session, skip: int = 0, limit: int = 100) -> List[Sport]:
    try:
        return db.query(Sport).offset(skip).limit(limit).all()
    except SQLAlchemyError as error:
        raise _error_base_datos(error) from error


def get_sport_by_id(db: Session, sport_id: int) -> Sport:
    sport = db.get(Sport, sport_id)

    if sport is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No existe un deporte con id {sport_id}",
        )

    return sport


def create_sport(db: Session, sport_data: SportCreate) -> Sport:
    new_sport = Sport(
        nombre=sport_data.nombre,
        descripcion=sport_data.descripcion,
        precio=sport_data.precio,
        stock=sport_data.stock,
        imagen=sport_data.imagen,
    )

    try:
        db.add(new_sport)
        db.commit()
        db.refresh(new_sport)
        return new_sport
    except SQLAlchemyError as error:
        db.rollback()
        raise _error_base_datos(error) from error


def update_sport(db: Session, sport_id: int, sport_data: SportCreate) -> Sport:
    sport = get_sport_by_id(db, sport_id)

    sport.nombre = sport_data.nombre
    sport.descripcion = sport_data.descripcion
    sport.precio = sport_data.precio
    sport.stock = sport_data.stock
    sport.imagen = sport_data.imagen

    try:
        db.commit()
        db.refresh(sport)
        return sport
    except SQLAlchemyError as error:
        db.rollback()
        raise _error_base_datos(error) from error


def delete_sport(db: Session, sport_id: int) -> None:
    sport = get_sport_by_id(db, sport_id)

    try:
        db.delete(sport)
        db.commit()
    except SQLAlchemyError as error:
        db.rollback()
        raise _error_base_datos(error) from error
