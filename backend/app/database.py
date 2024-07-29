from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_DETAILS = os.getenv("MONGO_DETAILS")

client = AsyncIOMotorClient(MONGO_DETAILS)
database = client.csv_database
csv_collection = database.csv_collection
