from pydantic import BaseModel, ConfigDict, Field


class SportBase(BaseModel):
    """Campos que el cliente puede enviar."""

    nombre: str = Field(
        ...,
        min_length=1,
        max_length=80,
        description="Nombre del deporte o actividad",
    )
    descripcion: str = Field(
        ...,
        min_length=1,
        max_length=600,
        description="Breve presentación que se muestra en la ficha",
    )
    precio: float = Field(
        ...,
        gt=0,
        description="Precio en euros (mayor que 0)",
    )
    stock: int = Field(
        ...,
        ge=0,
        description="Unidades disponibles",
    )
    imagen: str = Field(
        "img/default.svg",
        max_length=200,
        description="Ruta de la imagen dentro de frontend/",
    )


class SportCreate(SportBase):
    pass


class SportResponse(SportBase):
    id: int = Field(..., description="Identificador del deporte")

    model_config = ConfigDict(from_attributes=True)
