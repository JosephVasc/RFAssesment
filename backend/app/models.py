from bson import ObjectId
from pydantic import BaseModel, Field
from typing import List, Union

class CSVEntry(BaseModel):
    row_number: int
    company_name: str
    matched_entity: Union[str, None] = None

class CSVSubmission(BaseModel):
    id: str = Field(default_factory=str, alias="_id")
    filename: str
    status: str
    entries: List[CSVEntry]
    total_rows: int
    duplicates: int
    matches: int

class UpdateStatusModel(BaseModel):
    status: str
