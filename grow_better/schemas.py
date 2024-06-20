from pydantic import BaseModel, Field

'''

Pydantic Data Validation Schemas (Response and Request)

'''

class PlantBase(BaseModel):
    name: str
    growth_score: int
    growth_stage: str = "germination"
    comment_given: int

class PlantCreate(PlantBase):
    pass

class Plant(PlantBase):
    id: int
    class Config:
        orm_mode = True

class CommentBase(BaseModel):
    plant_name: str
    comment: str

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    class Config:
        orm_mode = True