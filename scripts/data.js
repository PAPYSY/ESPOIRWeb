// data.js
const initialProducts = [
    {
        id: 1,
        name: 'Bracelet artisanal',
        description: 'Bracelet fait main en perles locales',
        price: 2500,
        category: 'Bijoux',
        imageUrl: 'assets/images/products/bracelet1.jpg',
        stock: 10
    },
    {
        id: 2,
        name: 'Sac en tissu',
        description: 'Sac en tissu traditionnel',
        price: 4500,
        category: 'Accessoires',
        imageUrl: 'assets/images/products/sac1.jpg',
        stock: 5
    },
    {
        id: 3,
        name: 'Collier en bois',
        description: 'Collier artisanal en bois local',
        price: 3500,
        category: 'Bijoux',
        imageUrl: 'assets/images/products/collier1.jpg',
        stock: 8
    },
    {
        id: 4,
        name: 'Pochette tissée',
        description: 'Pochette tissée à la main en fibres naturelles',
        price: 3000,
        category: 'Accessoires',
        imageUrl: 'assets/images/products/pochette1.jpg',
        stock: 12
    },
    {
        id: 5,
        name: 'Boucles d\'oreilles',
        description: 'Boucles d\'oreilles artisanales en perles',
        price: 1500,
        category: 'Bijoux',
        imageUrl: 'assets/images/products/boucles1.jpg',
        stock: 15
    }
];

// Initialiser les produits dans le localStorage s'ils n'existent pas déjà
if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(initialProducts));
}

// Initialiser les commandes si elles n'existent pas
if (!localStorage.getItem('orders')) {
    localStorage.setItem('orders', JSON.stringify([]));
}