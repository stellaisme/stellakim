import json
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from database import SessionLocal
import models, crud, schemas
from rate_comments import CommentRater
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Allow CORS for all origins (for simplicity)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Plant Comment API"}

@app.post("/plants/", response_model=schemas.PlantCreate)
def create_plant(plant: schemas.PlantCreate, db: Session = Depends(get_db)):
    return crud.create_plant_item(db=db, plant=plant)

@app.post("/plants/comment/")
def comment_on_plant(comment: schemas.CommentCreate, db: Session = Depends(get_db)):
    comment_rater = CommentRater()
    gpt_response_json = comment_rater.post_gpt(comment.comment)
    gpt_response = json.loads(gpt_response_json)
    score = gpt_response["score"]["score"]
    db_comment = crud.create_comment(db=db, comment=comment)
    db_plant = crud.get_plant_by_name(db=db, plant_name=comment.plant_name)
    db_plant.comment_given += 1
    db_plant.score += score
    db_plant.growth_stage = comment_rater.calculate_growth_stage(db_plant.score)
    db.commit()
    db.refresh(db_plant)
    
    return {
        "message": "Plant updated and Comment saved successfully!",
        "comment": db_comment,
        "growth_stage": db_plant.growth_stage
    }

@app.get("/plants/status/{plant_name}", response_model=schemas.Plant)
def get_plant_status(plant_name: str, db: Session = Depends(get_db)):
    db_plant = crud.get_plant_by_name(db=db, plant_name=plant_name)
    if db_plant is None:
        raise HTTPException(status_code=404, detail="Plant not found")
    return db_plant

@app.delete("/plants/status/{plant_name}")
def delete_plant(plant_name: str, db: Session = Depends(get_db)):
    success = crud.delete_plant_by_name(db=db, plant_name=plant_name)
    if not success:
        raise HTTPException(status_code=404, detail="Plant not found")
    return {"message": "Plant deleted successfully"}

@app.get("/plants/comments/{plant_name}", response_model=list[schemas.Comment])
def get_comments_by_plant(plant_name: str, db: Session = Depends(get_db)):
    return crud.get_comments_by_plant_name(db=db, plant_name=plant_name)

@app.get("/plants/all", response_model=list[schemas.Plant]) 
def get_all_plants(db: Session = Depends(get_db)):
    return crud.get_all_plants(db=db)

@app.get("/plants/growth_stage/{growth_stage}", response_model=list[schemas.Plant])
def get_plants_by_growth_stage(growth_stage: str, db: Session = Depends(get_db)):
    return crud.get_plants_by_growth_stage(db=db, growth_stage=growth_stage)