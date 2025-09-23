#!/usr/bin/env python3
"""
Script para popular o banco de dados com dados iniciais de exemplo
"""
import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from datetime import datetime, date, time
from src.main import app
from src.models.gift import db, Gift, WeddingInfo

def populate_database():
    with app.app_context():
        # Limpa dados existentes
        db.drop_all()
        db.create_all()
        
        # Cria informações do casamento
        wedding_info = WeddingInfo(
            bride_name="Maria Silva",
            groom_name="João Santos",
            wedding_date=date(2025, 10, 18),
            wedding_time=time(16, 0),
            venue_name="Espaço Colinas Eventos",
            venue_address="Estr. Colina, 33 - Parque Primavera, Poços de Caldas - MG, 37700-001",
            message="Com muito amor e alegria, convidamos você para celebrar conosco este momento especial!"
        )
        db.session.add(wedding_info)
        
        # Lista de presentes de exemplo
        gifts_data = [
            # Casa e Cozinha
            {
                "name": "Jogo de Panelas Antiaderente",
                "description": "Conjunto completo com 5 panelas antiaderentes de alta qualidade",
                "category": "Casa e Cozinha",
                "price_range": "R$ 200 - R$ 400",
                "image_url": "/static/images/panelas.jpg"
            },
            {
                "name": "Liquidificador Premium",
                "description": "Liquidificador de alta potência com múltiplas velocidades",
                "category": "Casa e Cozinha", 
                "price_range": "R$ 150 - R$ 300",
                "image_url": "/static/images/liquidificador.jpg"
            },
            {
                "name": "Conjunto de Pratos",
                "description": "Aparelho de jantar completo para 6 pessoas em porcelana",
                "category": "Casa e Cozinha",
                "price_range": "R$ 300 - R$ 500",
                "image_url": "/static/images/pratos.jpg"
            },
            {
                "name": "Cafeteira Elétrica",
                "description": "Cafeteira programável com timer e aquecimento automático",
                "category": "Casa e Cozinha",
                "price_range": "R$ 100 - R$ 250",
                "image_url": "/static/images/cafeteira.jpg"
            },
            {
                "name": "Conjunto de Facas",
                "description": "Kit profissional com 6 facas e suporte de madeira",
                "category": "Casa e Cozinha",
                "price_range": "R$ 80 - R$ 200",
                "image_url": "/static/images/facas.jpg"
            },
            
            # Quarto e Banho
            {
                "name": "Jogo de Cama Casal King",
                "description": "Conjunto completo em algodão percal 200 fios",
                "category": "Quarto e Banho",
                "price_range": "R$ 150 - R$ 350",
                "image_url": "/static/images/jogo-cama.jpg"
            },
            {
                "name": "Conjunto de Toalhas",
                "description": "Kit com 6 toalhas de banho em algodão egípcio",
                "category": "Quarto e Banho",
                "price_range": "R$ 120 - R$ 280",
                "image_url": "/static/images/toalhas.jpg"
            },
            {
                "name": "Edredom King Size",
                "description": "Edredom de plumas com capa removível",
                "category": "Quarto e Banho",
                "price_range": "R$ 200 - R$ 450",
                "image_url": "/static/images/edredom.jpg"
            },
            
            # Eletrônicos
            {
                "name": "Smart TV 55 polegadas",
                "description": "Televisão 4K com sistema Android TV e Wi-Fi",
                "category": "Eletrônicos",
                "price_range": "R$ 1.500 - R$ 3.000",
                "image_url": "/static/images/tv.jpg"
            },
            {
                "name": "Micro-ondas",
                "description": "Forno micro-ondas 30L com grill e descongelamento automático",
                "category": "Eletrônicos",
                "price_range": "R$ 300 - R$ 600",
                "image_url": "/static/images/microondas.jpg"
            },
            {
                "name": "Aspirador de Pó",
                "description": "Aspirador vertical sem fio com múltiplos acessórios",
                "category": "Eletrônicos",
                "price_range": "R$ 250 - R$ 500",
                "image_url": "/static/images/aspirador.jpg"
            },
            
            # Decoração
            {
                "name": "Quadros Decorativos",
                "description": "Conjunto de 3 quadros modernos para sala",
                "category": "Decoração",
                "price_range": "R$ 100 - R$ 300",
                "image_url": "/static/images/quadros.jpg"
            },
            {
                "name": "Vaso Decorativo Grande",
                "description": "Vaso de cerâmica artesanal para plantas ou decoração",
                "category": "Decoração",
                "price_range": "R$ 80 - R$ 200",
                "image_url": "/static/images/vaso.jpg"
            },
            {
                "name": "Luminária de Mesa",
                "description": "Abajur moderno com dimmer e base em madeira",
                "category": "Decoração",
                "price_range": "R$ 120 - R$ 250",
                "image_url": "/static/images/luminaria.jpg"
            },
            
            # Utilidades
            {
                "name": "Ferro de Passar",
                "description": "Ferro a vapor com base antiaderente e desligamento automático",
                "category": "Utilidades",
                "price_range": "R$ 80 - R$ 180",
                "image_url": "/static/images/ferro.jpg"
            },
            {
                "name": "Tábua de Passar",
                "description": "Tábua regulável com suporte para ferro",
                "category": "Utilidades",
                "price_range": "R$ 60 - R$ 150",
                "image_url": "/static/images/tabua-passar.jpg"
            }
        ]
        
        # Adiciona os presentes ao banco
        for gift_data in gifts_data:
            gift = Gift(**gift_data)
            db.session.add(gift)
        
        # Reserva alguns presentes como exemplo
        db.session.commit()
        
        # Busca alguns presentes para reservar
        gifts_to_reserve = Gift.query.limit(3).all()
        guest_names = ["Ana Costa", "Pedro Oliveira", "Carla Mendes"]
        
        for i, gift in enumerate(gifts_to_reserve):
            gift.reserve(guest_names[i])
        
        db.session.commit()
        
        print("✅ Banco de dados populado com sucesso!")
        print(f"📊 Criados {len(gifts_data)} presentes")
        print(f"🎁 {len(gifts_to_reserve)} presentes já reservados como exemplo")
        print("💒 Informações do casamento configuradas")

if __name__ == "__main__":
    populate_database()