import os

import flask
import flask_cors
import flask_sqlalchemy

app = flask.Flask(__name__)
flask_cors.CORS(app)

app.config['PORT'] = os.environ.get('PORT', 5000)
app.config['EZLINK_EMAIL'] = os.environ['EZLINK_EMAIL']
app.config['EZLINK_PASSWORD'] = os.environ['EZLINK_PASSWORD']
app.config['EZLINK_CARD_UNIQUE_CODE'] = os.environ['EZLINK_CARD_UNIQUE_CODE']
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URI']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = flask_sqlalchemy.SQLAlchemy(app)
