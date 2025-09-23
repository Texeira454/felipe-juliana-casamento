from flask import Blueprint, jsonify, request
from src.models.gift import Gift, WeddingInfo, db
from datetime import datetime

wedding_bp = Blueprint('wedding', __name__)

# Rotas para informações do casamento
@wedding_bp.route('/wedding-info', methods=['GET'])
def get_wedding_info():
    """Retorna as informações do casamento"""
    wedding_info = WeddingInfo.query.first()
    if wedding_info:
        return jsonify(wedding_info.to_dict())
    return jsonify({'message': 'Informações do casamento não encontradas'}), 404

@wedding_bp.route('/wedding-info', methods=['POST'])
def create_wedding_info():
    """Cria ou atualiza as informações do casamento"""
    data = request.json
    
    # Remove informações existentes (só deve haver uma)
    WeddingInfo.query.delete()
    
    wedding_info = WeddingInfo(
        bride_name=data['bride_name'],
        groom_name=data['groom_name'],
        wedding_date=datetime.strptime(data['wedding_date'], '%Y-%m-%d').date(),
        wedding_time=datetime.strptime(data['wedding_time'], '%H:%M').time(),
        venue_name=data['venue_name'],
        venue_address=data['venue_address'],
        message=data.get('message', '')
    )
    
    db.session.add(wedding_info)
    db.session.commit()
    return jsonify(wedding_info.to_dict()), 201

# Rotas para presentes
@wedding_bp.route('/gifts', methods=['GET'])
def get_gifts():
    """Retorna todos os presentes, opcionalmente filtrados por categoria"""
    category = request.args.get('category')
    
    if category:
        gifts = Gift.query.filter_by(category=category).all()
    else:
        gifts = Gift.query.all()
    
    return jsonify([gift.to_dict() for gift in gifts])

@wedding_bp.route('/gifts', methods=['POST'])
def create_gift():
    """Cria um novo presente"""
    data = request.json
    
    gift = Gift(
        name=data['name'],
        description=data.get('description', ''),
        category=data['category'],
        price_range=data.get('price_range', ''),
        image_url=data.get('image_url', '')
    )
    
    db.session.add(gift)
    db.session.commit()
    return jsonify(gift.to_dict()), 201

@wedding_bp.route('/gifts/<int:gift_id>', methods=['GET'])
def get_gift(gift_id):
    """Retorna um presente específico"""
    gift = Gift.query.get_or_404(gift_id)
    return jsonify(gift.to_dict())

@wedding_bp.route('/gifts/<int:gift_id>/reserve', methods=['POST'])
def reserve_gift(gift_id):
    """Reserva um presente para um convidado"""
    gift = Gift.query.get_or_404(gift_id)
    data = request.json
    
    if gift.is_reserved:
        return jsonify({'message': 'Este presente já foi reservado'}), 400
    
    guest_name = data.get('guest_name')
    if not guest_name:
        return jsonify({'message': 'Nome do convidado é obrigatório'}), 400
    
    gift.reserve(guest_name)
    db.session.commit()
    
    return jsonify({
        'message': f'Presente reservado com sucesso para {guest_name}',
        'gift': gift.to_dict()
    })

@wedding_bp.route('/gifts/<int:gift_id>/unreserve', methods=['POST'])
def unreserve_gift(gift_id):
    """Remove a reserva de um presente"""
    gift = Gift.query.get_or_404(gift_id)
    
    if not gift.is_reserved:
        return jsonify({'message': 'Este presente não está reservado'}), 400
    
    gift.unreserve()
    db.session.commit()
    
    return jsonify({
        'message': 'Reserva removida com sucesso',
        'gift': gift.to_dict()
    })

@wedding_bp.route('/gifts/<int:gift_id>', methods=['PUT'])
def update_gift(gift_id):
    """Atualiza um presente"""
    gift = Gift.query.get_or_404(gift_id)
    data = request.json
    
    gift.name = data.get('name', gift.name)
    gift.description = data.get('description', gift.description)
    gift.category = data.get('category', gift.category)
    gift.price_range = data.get('price_range', gift.price_range)
    gift.image_url = data.get('image_url', gift.image_url)
    
    db.session.commit()
    return jsonify(gift.to_dict())

@wedding_bp.route('/gifts/<int:gift_id>', methods=['DELETE'])
def delete_gift(gift_id):
    """Remove um presente"""
    gift = Gift.query.get_or_404(gift_id)
    db.session.delete(gift)
    db.session.commit()
    return '', 204

@wedding_bp.route('/categories', methods=['GET'])
def get_categories():
    """Retorna todas as categorias de presentes disponíveis"""
    categories = db.session.query(Gift.category).distinct().all()
    return jsonify([category[0] for category in categories])

@wedding_bp.route('/stats', methods=['GET'])
def get_stats():
    """Retorna estatísticas dos presentes"""
    total_gifts = Gift.query.count()
    reserved_gifts = Gift.query.filter_by(is_reserved=True).count()
    available_gifts = total_gifts - reserved_gifts
    
    return jsonify({
        'total_gifts': total_gifts,
        'reserved_gifts': reserved_gifts,
        'available_gifts': available_gifts,
        'reservation_percentage': (reserved_gifts / total_gifts * 100) if total_gifts > 0 else 0
    })