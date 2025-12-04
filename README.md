# Career AI

## Project Description
Career-AI is a service that offers positions/candidates ingestion, structuring, vecorization and useful functionalities (e.g: matching positions to candidates and vice versa)

## Routes
### /skills
- POST /add_skills
- PUT /update_skills
- GET /get_all_skills
- DELETE /delete_skills
- DELETE /delete_all_skills
### /data 
- POST add_positions
- PUT edit_positions
- GET add_candidates
- GET get_top_candidates
- GET get_top_positions



## Architecture





1. creating the workflow - **done**
2. understanding the data received and formats and the wanted data - **irrelevant as of now (first attempt to use synthetic data then continue)**
3. creating APIs for the receiving the data. **- irrelevant as of now**
4. extracting and restructuring it based on our schema into two dfs (jobs and employees) while separating it into hard and soft skills in each one - **irrelevant as of now, instead we will synthesis data using marvin (need api key for LLM to generate), managed to synthesis job data for now for the 8 example jobs below**
5. transforming it into vectors
6. creating a unified vector store to query from for the ui
7. feeding the database from the UI in addition to the



\#used the chat to extract skills and level for each and defined as static for now in the code.

example jobs that will be used:
1. HR

2\. Finances

3\. Diplomat

4\. Fullstack Developer

5\. AI engineer

6\. Penetration tester

7\. Strategic consultant

8\. Material engineer - something that without the hardskill (relevant degree) no one will be able to match

## the system gets as of now predefined set of job and employee dfs and calculates the match
## between them using cosine similarity.
## 1. the weight of calculations between soft skills and hard skills is dynamic for each job (with default enabled)
## 2. unified vector store has been calculated
## 3. top employees for job has been made
## next steps:
## 1. generate data using datage.py and test it on larger set of employees
## 2. build the structure engine to structure employee data from APIS after getting data examples
## 3. create more functions and integrate them with UI + enabling edit of df from UI