from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from recommender import MovieRecommender
import time

app = FastAPI()

# CORS configuration to allow requests from your React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize recommender
try:
    recommender = MovieRecommender()
    print("Recommender system initialized successfully.")
except Exception as e:
    print(f"Error initializing recommender: {e}")
    recommender = None

@app.get("/")
async def root():
    return {"message": "Popcorn Hub Recommendation API is running"}

@app.get("/recommend")
async def get_recommendations(title: str):
    if not recommender:
        raise HTTPException(status_code=500, detail="Recommender system not initialized.")
    
    if not title:
        raise HTTPException(status_code=400, detail="Title parameter is required.")
    
    start_time = time.time()
    recommendations = recommender.recommend(title)
    end_time = time.time()
    
    return {
        "recommended": recommendations,
        "processing_time": round(end_time - start_time, 2),
        "query": title
    }

@app.get("/test-recommendation")
async def test_recommendation():
    if not recommender:
        raise HTTPException(status_code=500, detail="Recommender system not initialized.")
    
    test_movie = "The Dark Knight"
    recommendations = recommender.recommend(test_movie)
    
    return {
        "test_movie": test_movie,
        "recommendations": recommendations
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
