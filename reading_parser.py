import csv
from dataclasses import dataclass
import json
import os

tiddler_output_path = './wiki/misc/output/'

@dataclass
class ReadingListTiddler():
    """Representing a reading list tiddler"""
    title: str
    tags: str
    caption: str
    author: str
    medium: str
    url: str
    readstatus: str
    completed: str
    rating:	str
    year: str
    bibliography: str
    genre: str
    recommendedby: str	
    type: str




if not os.path.exists(tiddler_output_path):
  os.makedirs(tiddler_output_path)

with open('./wiki/misc/ReadingList.csv', 'r') as csvfile:
    reader = csv.reader(csvfile)
    next(reader)
    for row in reader:
        tiddler = ReadingListTiddler(*row)
        with open(f'./wiki/misc/output/{tiddler.title}.json', 'w', encoding='utf-8') as f:
            json.dump(tiddler.__dict__, f, ensure_ascii=False, indent=4)
