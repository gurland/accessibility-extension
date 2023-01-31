from peewee import *

db = SqliteDatabase("db.db")


class BlogPost(Model):
    class Meta:
        database = db

    age = IntegerField()
    gender = CharField()
    topic = TextField()
    sign = TextField()
    date = CharField()
    text = TextField()