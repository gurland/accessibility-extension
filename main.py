import csv
from peewee import *

db = SqliteDatabase('blogpost.db')


class BlogPost(Model):
    class Meta:
        database = db

    age = IntegerField()
    gender = CharField()
    topic = TextField()
    sign = TextField()
    date = CharField()
    text = TextField()
    brief = TextField()


import pandas


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


if __name__ == '__main__':
    db.connect()
    db.create_tables([BlogPost])
    upload_csv('blogtext.csv')
    db.close()
