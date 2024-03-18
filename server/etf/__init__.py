from .etf_routes import etf_blueprint

def create_etf_blueprint(app):
    app.register_blueprint(etf_blueprint, url_prefix='/etf')