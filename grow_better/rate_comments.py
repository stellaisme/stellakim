import json
import os
from openai import OpenAI

from dotenv import load_dotenv
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_KEY"))

class CommentRater:
    def __init__(self):
        self.MODEL = "gpt-3.5-turbo"
        self.prompt_template = None
        with open('prompt.txt', 'r') as file:
            self.prompt_template = file.read()
    
    def post_gpt(self, user_comment):
        try:
            prompt = self.prompt_template.replace("{USER_COMMENT}", user_comment)
            response = client.chat.completions.create(
                model=self.MODEL,
                messages=[
                    {"role": "system", "content": "You are a helpful gardener."},
                    {"role": "user", "content": prompt}
                ],
                # max_tokens=3000,
                stop=None,
                temperature=0.5
            )
            answer = response.choices[0].message.content
            score = self.calculate_growth_stage(answer)
            result = {"comment": user_comment, "score": score, "response": answer}
            return json.dumps(result)
        except Exception as e:
            print(e)
            return None
        
    def calculate_growth_stage(self, score):
        total_score = score
        if 0 <= total_score <= 10:
            return "germination"
        elif 11 <= total_score <= 20:
            return "seedling"
        elif 21 <= total_score <= 40:
            return "bud"
        elif 41 <= total_score <= 50:
            return "flower"
        elif 51 <= total_score <= 60:
            return "fruit"
        else:
            return "unknown"


#cr = CommentRater()
#cr.post_gpt(user_comment="안녕! 오늘 기분이 어때? 아까 바보라고해서 미안해.")