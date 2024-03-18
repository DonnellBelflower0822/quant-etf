from flask import Flask

from etf import create_etf_blueprint

app = Flask(__name__)
create_etf_blueprint(app)

if __name__ == '__main__':
    app.run(debug=True)