from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Gift(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100), nullable=False)
    price_range = db.Column(db.String(50))
    image_url = db.Column(db.String(500))
    is_reserved = db.Column(db.Boolean, default=False)
    reserved_by = db.Column(db.String(200))
    reserved_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Gift {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'price_range': self.price_range,
            'image_url': self.image_url,
            'is_reserved': self.is_reserved,
            'reserved_by': self.reserved_by,
            'reserved_at': self.reserved_at.isoformat() if self.reserved_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    def reserve(self, guest_name):
        """Reserva o presente para um convidado"""
        self.is_reserved = True
        self.reserved_by = guest_name
        self.reserved_at = datetime.utcnow()

    def unreserve(self):
        """Remove a reserva do presente"""
        self.is_reserved = False
        self.reserved_by = None
        self.reserved_at = None


class WeddingInfo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bride_name = db.Column(db.String(100), nullable=False)
    groom_name = db.Column(db.String(100), nullable=False)
    wedding_date = db.Column(db.Date, nullable=False)
    wedding_time = db.Column(db.Time, nullable=False)
    venue_name = db.Column(db.String(200), nullable=False)
    venue_address = db.Column(db.Text, nullable=False)
    message = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<WeddingInfo {self.bride_name} & {self.groom_name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'bride_name': self.bride_name,
            'groom_name': self.groom_name,
            'wedding_date': self.wedding_date.isoformat() if self.wedding_date else None,
            'wedding_time': self.wedding_time.isoformat() if self.wedding_time else None,
            'venue_name': self.venue_name,
            'venue_address': self.venue_address,
            'message': self.message,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }