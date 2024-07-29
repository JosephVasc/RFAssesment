from fastapi import FastAPI
from app.routes import csv_submission

app = FastAPI()

app.include_router(csv_submission.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}
