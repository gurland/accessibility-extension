import os

from peewee import *
import pandas


db = SqliteDatabase('blogpost.db')


class Base(Model):
    class Meta:
        database = db


class Summary(Base):
    id = UUIDField(primary_key=True)
    html = TextField()
    summary = TextField(null=True)
    url = TextField(null=True)

    def to_dict(self):
        return {
            "id": self.id,
            "html": self.html,
            "summary": self.summary
        }


class BlogPost(Base):
    age = IntegerField()
    gender = CharField()
    topic = TextField()
    sign = TextField()
    date = CharField()
    text = TextField()
    brief = TextField()

    def to_dict(self):
        return {
            "id": self.id,
            "age": self.age,
            "gender": self.gender,
            "topic": self.topic,
            "sign": self.sign,
            "date": self.date,
            "text": self.text,
            "brief": self.brief,
        }


def upload_csv(file_path):
    df = pandas.read_csv(file_path)

    posts = []
    c = 0
    for ind, row in df.iterrows():
        posts.append(BlogPost(
            age=row[2],
            gender=row[1],
            topic=row[3],
            sign=row[4],
            date=row[5],
            text=row[6],
            brief=row[6].strip()[:150]
        ))
        c += 1
        if c>996:
            BlogPost.bulk_create(posts)
            c = 0
            posts.clear()


def seed_blog_posts():
    if os.path.exists('blogtext.csv'):
        if BlogPost.select().count() < 1:
            upload_csv('blogtext.csv')


db.create_tables([BlogPost, Summary])
seed_blog_posts()
