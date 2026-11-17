from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config.config_variables import APP_DESCRIPTION, APP_TITLE, APP_VERSION
from database.database import Base, engine
from routes.routes import router as sports_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=APP_TITLE,
    version=APP_VERSION,
    description=APP_DESCRIPTION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # 开发阶段：允许任何地址访问（端口变了也不怕）
    allow_credentials=False,    # 注意：不传 Cookie 时才允许用 "*"
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sports_router)


@app.get("/", tags=["Health Check"])
def read_root():
    return {
        "status": "online",
        "message": f"Welcome to {APP_TITLE}",
        "docs_url": "/docs",
        "redoc_url": "/redoc",
    }
