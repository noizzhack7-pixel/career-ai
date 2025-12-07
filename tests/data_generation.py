import asyncio
import time

from dotenv import load_dotenv
import marvin
load_dotenv()


from app.models.Employee import Employee

async def pydantic_generation(pydantic_model, n = 5):
    start = time.time()
    results = await marvin.generate_async(
        pydantic_model,
        n=n
    )
    end = time.time() - start
    print(f"Generated {n} in {end} seconds")
    return results

result = asyncio.run(pydantic_generation(Employee, n=5))
print(result)