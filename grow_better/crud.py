from sqlalchemy.orm import Session
from models import Plant, Comments
import schemas
import uuid
import models, schemas

def creating_plant(db: Session, name: str):
    return db.query(models.Plant).filter(models.Plant.name == name).first()

def create_plant_item(db: Session, plant: schemas.PlantCreate):
    db_plant = models.Plant(name=plant.name, growth_score=plant.growth_score, growth_stage=plant.growth_stage, comment_given=plant.comment_given)
    db.add(db_plant)
    db.commit()
    db.refresh(db_plant)
    return db_plant

def get_plant_by_name(db: Session, plant_name = str): #get_plant_status와 연동, 조회할 식물 이름 str로 받기
    return db.query(models.Plant).filter(models.Plant.name == plant_name).first() #.first -> 필터 조건에 맞는 애 받아오기

def get_all_plants(db: Session): #get_all_plants와 연동
    return db.query(models.Plant).all() #.all() -> 모든 애들 데려오기

def delete_plant_by_name(db: Session, plant_name: str): #delete_plant와 연동
    db_plant = get_plant_by_name(db, plant_name)
    if db_plant: #내가 입력한 식물 이름 db에 있는지 확인
        db.delete(db_plant) #있으면 삭제
        db.commit()
        return True #있으면 삭제하고 TRUE 반환
    return False #없으면 삭제하지 말고 False 반환

def get_plants_by_growth_stage(db: Session, growth_stage: str): #get_plants_by_growth_stage와 연동
    return db.query(models.Plant).filter(models.Plant.growth_stage == growth_stage).all() 

def create_comment(db: Session, comment: schemas.CommentCreate): #comment_on_plant와 연동
    db_comment = models.Comments(**comment.dict())
    db.add(db_comment) #DB에 넣어주기
    db.commit() #실제로 저장하는 것
    db.refresh(db_comment) #refresh = 새로고침
    return db_comment

def get_comments_by_plant_name(db: Session, plant_name: str):
    return db.query(models.Comments).filter(models.Comments.plant_name == plant_name).all()
