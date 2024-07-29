# RFAassessment
The goal of this assesment is to create an application that accepts a CSV file from the user via the React front end and 
visualzie the matching result. 

Matching is handled in the backend via Python / FastAPI and stored in a mongo database.
The UI is built on React TS using a model view composer design. 

# Model View Composer:
You can use a multitude of design patterns but for the simplicity of this single page app I decided to use as MVComposer Design pattern due to the clear separation of business and view logic. 

The Composer is meant to handle all business logic and api calls using the singleton created in `src/client/apiService.ts`
The Components are meant to display the view only and pass up any callbacks to the composer to handle.

# Styling: 
I decided to just use sx styling directly with MUI for times sake, I would normally create css classes or use `@styled`;

# Api Generation 
API generation is through the generated openapi spec in `frontend/src/client/openApi.json`
Which is generated from the backend that you can view at:
* `localhost:8000/docs`
* `openapi-generator generate -i http://localhost:8000/openapi.json -g typescript-axios -o ./src/api`

# Quick demo: 
I am adding a quick unlisted youtube video demo as I usually will add a screen recording for open UI MRs.
- https://www.youtube.com/watch?v=isMmh9a1268

# Backend startup (local):
in the projects main directory you can bring up the mongo db with:
1. `docker-compose up -d db`
2. cd backend/app and create a venv: `python3 -m venv venv`
3. activate the venv: `source venv/bin/activate`
4. install dependencies:` pip install -r requirements`
5. run `fastapi dev main.py` in backend/app

# Frontend startup (local): 
1. cd to `frontend/`
2. run `npm install`
3. run `npm start`
the react app is currently running in development mode with a proxy pointing to the fastapi 

# Matching method: 
the logic for the matching method is handled in the `backend/app/utils/entity_matcher.py`
1. We load the entity data, (This could also be handled by an upload entity endpoint and let it be stored in the DB)
2. The function then normalizes the input ie `company_name.strip().lower()`
3. We then check for a 1:1 match of the company name:
    ``` if company_name in entity_mapping:
        return entity_mapping[company_name].get('display_name', None) ```
4. if no exact match is found we use `fuzzywuzzy` which is a fuzzy matching library
    ```python
    matched_name, score = process.extractOne(company_name, entity_mapping.keys())
    ```
    if the fuzzy matching score is > 80 then we say it is 'reasonably matchable' 
    ```python
    if score > 80:
        return entity_mapping[matched_name].get('display_name', None)
    ```
5. if there is no match we return a `None` object

# Key tools and libariaries used to build this:
- `FuzzyWuzzy` is a string matching python package - https://pypi.org/project/fuzzywuzzy/ 
- `MUI` is used for styling and prebuilt components - https://mui.com/
- `FastAPI` is a modern, fast (high-performance), web framework for building APIs with Python based on standard Python type hints - https://www.mongodb.com/developer/technologies/fastapi/
- `Pydantic` is the most widely used data validation library for Python - https://docs.pydantic.dev/latest/ 

# Improvements: 
If I were to be making this tool for a production level deployment I would add these improvements.
1. Tests:
    * implement the front-end tests using `jest` `react-testing-library` and `msw` (mock service worker) to create a mock api call for the composers to run integration tests on the entire composer logic
    * create `react-testing-library` tests for each component to test the view and ensure features are working
    * implement backend asyncio testing to test the actual endpoints along with pytest unit tests to test each endpoint
2. Docker:
    * dockerize each portion of the app and then configure them with a proxy like `traefik` to route calls and connection through
    * setup pipelines on github or gitlabs to build tests, check formatting, ensure test coverage before a MR can be approved or merged.
3. Authentication: 
    * use something like `auth0` or your favorite authentication handler to include the following
    - User management (create and remove). The users database is managed by Auth0 (meaning there is no need to create users table in your own database).
    - Authentication service: Authenticate users versus the users database. Once the user is verified (by username and password, or social identification) a JWT is granted. Using this JWT the client can make requests to the server which verifies the JWT each time.
    - Authorization service: Authorization is the process of verify the client has the right permissions to access the requested resource. For each request, the server checks the permissions (scopes), that are stored in the JWT, and compare them to the endpoint access permissions.
4. Improve styling with more traditional syling methods (non inline styles via sx) as I believe uniform styling via css scales a little bit easier when working with a large application.
5. Add more error handling to display errors in a more elegant way.
6. Implement pagination handled on the backend to improve performance as datasets scale.
7. Adjust filtering to use options in the api call rather than filtering directly in the TS code.
# RFAssesment
