from flask import Blueprint

etf_blueprint = Blueprint('etf', __name__)

@etf_blueprint.route('/login')
def login():
    return 'Login page'

@etf_blueprint.route('/logout')
def logout():
    return 'Logout page'
