from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from typing import List, Union
import csv
import json
from app.models import CSVSubmission, UpdateStatusModel, CSVEntry
from app.database import csv_collection
from app.utils.entity_matcher import match_entity
from bson import ObjectId

router = APIRouter()

# use ObjectID to convert string to ObjectId for MongoDB queries
async def delete_submission(id: str) -> bool:
    result = await csv_collection.delete_one({"_id": ObjectId(id)})
    return result.deleted_count > 0

async def save_csv_submission(filename: str, entries: List[CSVEntry], status: str) -> CSVSubmission:
    total_rows = len(entries)
    duplicates = total_rows - len(set(entry.company_name for entry in entries))
    matches = len([entry for entry in entries if entry.matched_entity])
    submission = {
        "filename": filename,
        "status": status,
        "entries": [entry.dict() for entry in entries],
        "total_rows": total_rows,
        "duplicates": duplicates,
        "matches": matches
    }
    result = await csv_collection.insert_one(submission)
    submission["_id"] = str(result.inserted_id)
    return CSVSubmission(**submission)

async def retrieve_submissions() -> List[CSVSubmission]:
    submissions = []
    async for submission in csv_collection.find():
        submission["_id"] = str(submission["_id"])
        submissions.append(CSVSubmission(**submission))
    return submissions

async def retrieve_submission(id: str) -> Union[CSVSubmission, None]:
    submission = await csv_collection.find_one({"_id": ObjectId(id)})
    if submission:
        submission["_id"] = str(submission["_id"])
        return CSVSubmission(**submission)
    return None

async def update_submission_status(id: str, status: str) -> bool:
    submission = await csv_collection.find_one({"_id": ObjectId(id)})
    if submission:
        updated_submission = await csv_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": {"status": status}}
        )
        return updated_submission.modified_count > 0
    return False

@router.post("/upload-csv", response_model=CSVSubmission)
async def upload_csv(file: UploadFile = File(...)):
    contents = await file.read()
    csv_reader = csv.reader(contents.decode('utf-8').splitlines())
    entries = []
    header_skipped = False
    
    for row_number, row in enumerate(csv_reader):
        # skip the header
        if not header_skipped:
            header_skipped = True
            continue
        
        if not row or len(row) < 1:
            # Skip completely empty lines or lines with insufficient columns
            continue
        
        company_name = row[0].strip()
        if not company_name:
            # Skip lines with empty company names
            continue
        
        matched_entity = match_entity(company_name)
        entries.append(CSVEntry(row_number=row_number, company_name=company_name, matched_entity=matched_entity))
    
    if not entries:
        raise HTTPException(status_code=400, detail="No valid data found in the CSV file")

    submission = await save_csv_submission(file.filename, entries, "Pending Review")
    return submission

@router.get("/submissions", response_model=List[CSVSubmission])
async def get_submissions():
    submissions = await retrieve_submissions()
    return submissions

@router.get("/submissions/{submission_id}", response_model=CSVSubmission)
async def get_submission(submission_id: str):
    submission = await retrieve_submission(submission_id)
    if submission:
        return submission
    raise HTTPException(status_code=404, detail="Submission not found")

@router.put("/submissions/{submission_id}/status", response_model=CSVSubmission)
async def update_submission(submission_id: str, status_update: UpdateStatusModel):
    updated = await update_submission_status(submission_id, status_update.status)
    if updated:
        updated_submission = await retrieve_submission(submission_id)
        return updated_submission
    raise HTTPException(status_code=404, detail="Submission not found")

@router.get("/submissions/{submission_id}/download")
async def download_submission(submission_id: str):
    # return a streaming response (file download) for the submission
    submission = await retrieve_submission(submission_id)
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    output = []
    for entry in submission.entries:
        output.append([entry.row_number, entry.company_name, entry.matched_entity])
    
    def iter_csv():
        yield 'Row Number,Company Name,Matched Entity\n'
        for row in output:
            yield ','.join(map(str, row)) + '\n'

    return StreamingResponse(iter_csv(), media_type="text/csv", headers={"Content-Disposition": f"attachment; filename={submission.filename}"})

@router.delete("/submissions/{submission_id}", response_model=dict)
async def delete_submission_endpoint(submission_id: str):
    deleted = await delete_submission(submission_id)
    if deleted:
        return {"detail": "Submission deleted successfully"}
    raise HTTPException(status_code=404, detail="Submission not found")
