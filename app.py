import os
import json
import datetime
import dateparser
import re

from flask import Flask, request, abort
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm.exc import NoResultFound

from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import MessageEvent, TextMessage, TextSendMessage

from oauth2client.service_account import ServiceAccountCredentials
from apiclient import discovery

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URI']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['LINE_BOT_ACCESS_TOKEN'] = os.environ['LINE_BOT_ACCESS_TOKEN']
app.config['LINE_BOT_CHANNEL_SECRET'] = os.environ['LINE_BOT_CHANNEL_SECRET'] 
app.config['SERVICE_ACCOUNT_CREDENTIAL'] = os.environ['SERVICE_ACCOUNT_CREDENTIAL']

line_bot_api = LineBotApi(app.config.get('LINE_BOT_ACCESS_TOKEN'))
handler = WebhookHandler(app.config.get('LINE_BOT_CHANNEL_SECRET'))
db = SQLAlchemy(app)


scopes = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/spreadsheets',
]
credential_json = json.loads(app.config.get('SERVICE_ACCOUNT_CREDENTIAL'))
credentials = ServiceAccountCredentials.from_json_keyfile_dict(credential_json, scopes)
service = discovery.build('sheets', 'v4', credentials=credentials)
sh = service.spreadsheets()


class SpreadsheetInfo(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    room_id = db.Column(db.String(256), unique=True, nullable=False)
    spreadsheet_id = db.Column(db.String(256))
    sheet_id = db.Column(db.String(256))


db.create_all()


@app.route('/')
def hello():
    return 'ok'


@app.route("/line/callback", methods=['POST'])
def callback():
    signature = request.headers['X-Line-Signature']
    body = request.get_data(as_text=True)
    try:
        handler.handle(body, signature)
    except InvalidSignatureError:
        print("Invalid signature. Please check your channel access token/channel secret.")
        abort(400)
    return 'OK'


@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    room_id = get_room_id(event)
    message_text = event.message.text

    match = re.match("orchid set spreadsheet ([0-9A-Za-z_-]+) ([0-9]+)", message_text)
    if match:
        spreadsheet_id = match[1]
        sheet_id = match[2]
        set_spreadsheet(room_id, spreadsheet_id, sheet_id)
        setup_spreadsheet(spreadsheet_id, sheet_id)
        line_bot_api.reply_message(event.reply_token, TextSendMessage(text='Spreadsheet ID updated'))
        return

    if message_text.startswith('orchid insert transaction'):
        message_lines = message_text.splitlines()[1:]
        field_mapping = {
            'timestamp': 'timestamp',
            'name': 'name',
            'amount': 'amount',
            'currency': 'currency',
            'from': 'source_channel',
            'to': 'destination_channel',
            'category': 'category',
            'description': 'description',
        }
        kwargs = {}
        for part in message_lines:
            if len(part) == 0:
                continue
            f = part.split()[0]
            if f not in field_mapping:
                continue
            kwargs[field_mapping[f]] = part[len(f):].strip()
        append_transaction(room_id, **kwargs)
        line_bot_api.reply_message(event.reply_token, TextSendMessage(text='Transaction added'))
    
    if message_text == "orchid help":
        line_bot_api.reply_message(event.reply_token, TextSendMessage(text=
        '''
Setting spreadsheet
```
orchid set spreadsheet <spreadsheet-id> <sheet-id>
```

Insert Transaction
```
orchid insert transaction
timestamp <timestamp>
name <name>
amount <amount>
currency <currency>
from <source-channel>
to <destination-channel>
category <category>
description <description>
```
        '''))
        return


def get_room_id(event):
    source = event.source
    if source.type == 'user':
        return 'userId:' + source.user_id
    elif source.type == 'group':
        return 'groupId:' + source.group_id
    raise ValueError('Invalid Source Type')

def set_spreadsheet(room_id, spreadsheet_id, sheet_id):
    try:
        sheet_info = db.session.query(SpreadsheetInfo).filter(SpreadsheetInfo.room_id == room_id).one()
        sheet_info.spreadsheet_id = spreadsheet_id
        sheet_info.sheet_id = sheet_id
    except NoResultFound:
        db.session.add(SpreadsheetInfo(room_id=room_id, spreadsheet_id=spreadsheet_id, sheet_id=sheet_id))
    db.session.commit()

def setup_spreadsheet(spreadsheet_id, sheet_id):
    headers = ['Timestamp', 'Name', 'Amount', 'Currency', 'Source Channel', 'Destination Channel', 'Description', 'Category']
    request = {
        'requests': [
            {
                'updateSheetProperties': {
                    'properties': {
                        'sheetId': sheet_id,
                        'gridProperties': {
                            'frozenRowCount': 1,
                        }
                    },
                    'fields': 'gridProperties.frozenRowCount',
                },
            },{
                'updateCells': {
                    'rows': [
                        {
                            'values': [{
                                'userEnteredValue': {
                                    'stringValue': header_name,
                                }
                            } for header_name in headers]
                        }
                    ],
                    'fields': 'userEnteredValue',
                    'range': {
                        'sheetId': sheet_id,
                        'startRowIndex': 0,
                        'endRowIndex': 1,
                        'startColumnIndex': 0,
                        'endColumnIndex': len(headers),
                    }
                }
            },{ 
                'repeatCell': {
                    'range': {
                        'sheetId': sheet_id,
                        'startRowIndex': 0,
                        'endRowIndex': 1,
                    },
                    'cell': {
                        'userEnteredFormat': {
                            'textFormat': {
                                'bold': True,
                            }
                        }
                    },
                    'fields': 'userEnteredFormat.textFormat.bold',
                }
            },{
                'repeatCell': {
                    'range': {
                        'sheetId': sheet_id,
                        'startRowIndex': 1,
                        'startColumnIndex': 0,
                        'endColumnIndex': 1,
                    },
                    'cell': {
                        'userEnteredFormat': {
                            'numberFormat': {
                                'type': 'DATE_TIME',
                                'pattern': 'dddd, dd/mm/yyyy at h:mm',
                            }
                        }
                    },
                    'fields': 'userEnteredFormat.numberFormat.type,userEnteredFormat.numberFormat.pattern',
                }
            },{
                'repeatCell': {
                    'range': {
                        'sheetId': sheet_id,
                        'startRowIndex': 1,
                        'startColumnIndex': 2,
                        'endColumnIndex': 3,
                    },
                    'cell': {
                        'userEnteredFormat': {
                            'numberFormat': {
                                'type': 'NUMBER',
                                'pattern': '####.#',
                            }
                        }
                    },
                    'fields': 'userEnteredFormat.numberFormat',
                }
            }
        ]
    }
    sh.batchUpdate(spreadsheetId=spreadsheet_id, body=request).execute()

def append_transaction(
    room_id,
    timestamp=None,
    name='',
    amount=0,
    currency='SGD',
    source_channel='Income',
    destination_channel='Expense',
    description='',
    category='Other',
):
    timestamp = timestamp or datetime.datetime.now()
    if isinstance(timestamp, str):
        timestamp = dateparser.parse(timestamp)
    google_sheet_timestamp = timestamp - datetime.datetime(1899,12,30)
    timestamp = google_sheet_timestamp.days + google_sheet_timestamp.seconds / (60.0*60.0*24.0)
    print(google_sheet_timestamp.days, google_sheet_timestamp.seconds / (60.0*60.0*24.0))

    spreadsheet_info = get_spreadsheet_info(room_id)
    spreadsheet_id = spreadsheet_info.spreadsheet_id
    sheet_id = spreadsheet_info.sheet_id
    request = {
        'requests': [
            {
                'appendCells': {
                    'sheetId': sheet_id,
                    'rows': [{
                        'values': [
                            {'userEnteredValue': {'numberValue': timestamp}},
                            {'userEnteredValue': {'stringValue': name}},
                            {'userEnteredValue': {'numberValue': amount}},
                            {'userEnteredValue': {'stringValue': currency}},
                            {'userEnteredValue': {'stringValue': source_channel}},
                            {'userEnteredValue': {'stringValue': destination_channel}},
                            {'userEnteredValue': {'stringValue': description}},
                            {'userEnteredValue': {'stringValue': category}},
                        ]
                    }],
                    'fields': 'userEnteredValue.numberValue,userEnteredValue.stringValue',
                }
            }
        ]
    }
    sh.batchUpdate(spreadsheetId=spreadsheet_id, body=request).execute()

def get_spreadsheet_info(room_id):
    return db.session.query(SpreadsheetInfo).filter(SpreadsheetInfo.room_id == room_id).one()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(threaded=True, port=port)