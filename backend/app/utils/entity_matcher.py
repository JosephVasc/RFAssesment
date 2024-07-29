import json
from fuzzywuzzy import process
from typing import Union

# Load entity data  
with open('utils/entities.json') as f:
    entity_data = json.load(f)

entity_mapping = {}
for key, entity in entity_data.items():
    for name in entity.get('common_names', []):
        entity_mapping[name.lower()] = entity

def match_entity(company_name: str) -> Union[str, None]:
    company_name = company_name.strip().lower()
    if company_name in entity_mapping:
        return entity_mapping[company_name].get('display_name', None)
    matched_name, score = process.extractOne(company_name, entity_mapping.keys())
    if score > 80:
        return entity_mapping[matched_name].get('display_name', None)
    return None
