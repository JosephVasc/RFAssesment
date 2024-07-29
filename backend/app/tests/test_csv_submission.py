import pytest
import asyncio
from httpx import AsyncClient
from fastapi import FastAPI
from app.routes.csv_submission import router as csv_submission_router

app = FastAPI()
app.include_router(csv_submission_router)

@pytest.mark.asyncio
async def test_upload_csv():
    async with AsyncClient(app=app, base_url="http://test") as client:
        file_content = "Company Name\nCompany A\nCompany B"
        response = await client.post(
            "/upload-csv",
            files={"file": ("test.csv", file_content, "text/csv")}
        )
        assert response.status_code == 200
        assert "filename" in response.json()
        assert response.json()["status"] == "Pending Review"
