from sqlalchemy import Boolean, Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from database import Base, engine
import uuid

'''

DB Tables

'''

class Plant(Base):
    __tablename__="plants"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, index=True)
    growth_stage = Column(String, index=True, default="germination")
    growth_score = Column(Integer)
    comment_given = Column(Integer)
    score = Column(Integer, default=0)
    comments = relationship("Comments", back_populates="plant")

class Comments(Base):
    __tablename__="comments"

    id = Column(Integer, primary_key=True, unique=True)
    plant_name = Column(String, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"))
    comment = Column(String, index=True)
    
    plant = relationship("Plant", back_populates="comments")


#Create all tables in the database
#Base.metadata.create_all(bind=engine) #정의했던 모든 클래스에 대해서 DB 생성, DB 생성을 하고 싶으면 추가하면 됨