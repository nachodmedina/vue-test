# Agregar estas líneas a tu main.py de FastAPI

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vue.js dev server
        "http://localhost:3000",  # Por si cambias el puerto
        "http://127.0.0.1:5173",  # Alternativa localhost
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# El resto de tu aplicación...