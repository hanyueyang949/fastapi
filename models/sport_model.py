from sqlalchemy import Column, Float, Integer, String

from database.database import Base


class Sport(Base):
    """Un deporte del catálogo de letdosport."""

    __tablename__ = "sports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(80), nullable=False, index=True)
    descripcion = Column(String(600), nullable=False)
    precio = Column(Float, nullable=False)
    stock = Column(Integer, nullable=False, index=True)
    imagen = Column(String(200), nullable=False, default="img/default.svg")

    def __repr__(self) -> str:
        return (
            f"<Sport(id={self.id}, nombre={self.nombre}, "
            f"precio={self.precio}, stock={self.stock})>"
        )
