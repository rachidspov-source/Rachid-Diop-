import { SiteData } from '../types/burger';

export const INITIAL_SITE_DATA: SiteData = {
  hero: {
    title: 'BURGER & CO',
    subtitle: 'Le goût qui fait la différence.',
    tagline: 'Artisan Burger & Smash Bar',
    heroImage: './images/burger_signature.jpg',
    ctaPrimaryText: 'Découvrir le menu',
    ctaSecondaryText: 'Nous trouver & Horaires',
    badgeText: 'Recettes signatures & Viande 100% fraîche'
  },
  info: {
    name: 'Burger & Co',
    brandTagline: 'Le goût qui fait la différence.',
    logoUrl: '',
    instagramHandle: '@burger_and_co_sn',
    instagramUrl: 'https://instagram.com/burger_and_co_sn',
    whatsappNumber: '+221 78 456 33 33',
    whatsappMessage: 'Bonjour Burger & Co, je souhaite passer une commande !',
    phone: '+221 78 456 33 33',
    email: 'contact@burgerandco.sn',
    address: '21 Rue de Thann / Almadies',
    city: 'Dakar',
    country: 'Sénégal',
    googleMapsUrl: 'https://maps.google.com/?q=21+Rue+de+Thann+Dakar+Senegal',
    googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d123512.42857754674!2d-17.54582960683072!3d14.717646549247656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec172f5b3c5bb71%3A0x11465d536314e508!2sDakar%2C%20S%C3%A9n%C3%A9gal!5e0!3m2!1sfr!2s!4v1700000000000!5m2!1sfr!2s',
    openingHours: [
      { days: 'Lundi - Dimanche', hours: '13h00 - 02h00' },
      { days: 'Livraison à domicile', hours: '18h00 - 01h30' }
    ],
    aboutText: 'Chez Burger & Co, chaque burger est préparé à la commande avec des ingrédients frais sélectionnés avec soin. Nos pains briochés sont dorés chaque matin, nos viandes sont hachées sur place et nos sauces maison apportent cette signature unique qui réveille vos papilles.',
    aboutImage: './images/bbq_burger.jpg',
    stats: [
      { label: 'Recettes Signatures', value: '15+' },
      { label: 'Sauces Secrètes Maison', value: '6' },
      { label: 'Clients Régalés', value: '25k+' },
      { label: 'Note Moyenne', value: '4.9/5' }
    ]
  },
  seo: {
    metaTitle: 'Burger & Co | Le goût qui fait la différence - @burger_and_co_sn',
    metaDescription: 'Découvrez la nouvelle carte Burger & Co : burgers signatures, smash croustillants, assiettes kafta, tenders et milkshakes à Dakar.',
    ogImage: './images/burger_signature.jpg',
    keywords: 'burger, smash burger, dakar, burger and co, burger_and_co_sn, fast food gourmet dakar'
  },
  categories: [
    { id: 'cat-burgers', name: 'Nos Burgers & Smash', slug: 'burgers', order: 1 },
    { id: 'cat-assiettes', name: 'Assiettes & Spécialités', slug: 'assiettes', order: 2 },
    { id: 'cat-menus', name: 'Formules & Menus Packs', slug: 'menus', order: 3 },
    { id: 'cat-sides', name: 'Finger Food & Frites', slug: 'accompagnements', order: 4 },
    { id: 'cat-drinks', name: 'Milkshakes & Boissons', slug: 'boissons', order: 5 },
    { id: 'cat-desserts', name: 'Desserts Gourmands', slug: 'desserts', order: 6 }
  ],
  products: [
    {
      id: 'prod-classic-cheese',
      name: 'Le Classic Cheese Burger',
      description: 'Pain brioché toasté au beurre, steak pur bœuf pressé minute, double cheddar américain fondu, pickles craquants, oignons émincés et sauce secrète Burger & Co.',
      price: 4500,
      category: 'cat-burgers',
      imageUrl: './images/double_cheeseburger.jpg',
      badge: 'Best-seller',
      available: true,
      order: 1
    },
    {
      id: 'prod-double-cheese',
      name: 'Le Double Cheese Burger',
      description: 'Deux steaks pur bœuf grillés, quadruple cheddar fondant, oignons dorés caramélisés et sauce signature dans un pain brioché moelleux.',
      price: 5500,
      category: 'cat-burgers',
      imageUrl: './images/burger_signature.jpg',
      badge: 'Gourmand',
      available: true,
      order: 2
    },
    {
      id: 'prod-bbq-bacon',
      name: 'Le Barbecue Bacon Burger',
      description: 'Pur bœuf croustillant, tranches de bacon grillé fumé, cheddar affiné, rondelles d\'oignons croustillantes et généreuse sauce BBQ maison.',
      price: 6000,
      category: 'cat-burgers',
      imageUrl: './images/bbq_burger.jpg',
      badge: 'Populaire',
      available: true,
      order: 3
    },
    {
      id: 'prod-crispy-chicken',
      name: 'Le Crispy Chicken Hot Mayo',
      description: 'Filet de poulet croustillant mariné au babeurre, panure dorée aux 7 épices, fromage fondant, salade iceberg fraîche, pickles et mayo pimentée douce.',
      price: 5000,
      category: 'cat-burgers',
      imageUrl: './images/crispy_chicken.jpg',
      badge: 'Croustillant',
      available: true,
      order: 4
    },
    {
      id: 'prod-smash-truffe',
      name: 'Smash Truffe & Champignons',
      description: 'Double patty smashé croustillant, provolone fondu, champignons poêlés à la braise, oignons confits et sauce onctueuse à la truffe noire.',
      price: 6500,
      category: 'cat-burgers',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      badge: 'Spécial Chef',
      available: true,
      order: 5
    },
    {
      id: 'prod-assiette-kafta',
      name: 'L\'Assiette Kafta Grillée',
      description: 'Spécialité maison : brochettes de viande de kafta aux épices grillées à la braise, frites fraîches maison, crème d\'ail parfumée, salade croquante et pain pita chaud.',
      price: 6500,
      category: 'cat-assiettes',
      imageUrl: './images/assiette_kafta.jpg',
      badge: 'Spécialité',
      available: true,
      order: 6
    },
    {
      id: 'prod-assiette-poulet',
      name: 'L\'Assiette Tenders Croustillants',
      description: '5 grands tenders de poulet panés minute, grande portion de frites fraîches dorées, sauce honey mustard et salade fraîche.',
      price: 5500,
      category: 'cat-assiettes',
      imageUrl: './images/chicken_tenders.jpg',
      badge: 'Nouveau',
      available: true,
      order: 7
    },
    {
      id: 'prod-menu-solo',
      name: 'Formule Menu Solo',
      description: '1 Burger signature au choix (Classic, BBQ ou Crispy Chicken) + 1 portion de frites fraîches maison + 1 boisson fraîche 33cl au choix.',
      price: 6500,
      category: 'cat-menus',
      imageUrl: './images/menu_duo.jpg',
      badge: 'Top Formule',
      available: true,
      order: 8
    },
    {
      id: 'prod-menu-duo',
      name: 'Le Duo Pack Burger & Co',
      description: '2 Burgers gourmands au choix + 2 frites fraîches croustillantes + 2 sauces maison au choix + 2 boissons fraîches 33cl.',
      price: 12000,
      category: 'cat-menus',
      imageUrl: './images/menu_duo.jpg',
      badge: 'Promo Duo',
      available: true,
      order: 9
    },
    {
      id: 'prod-loaded-fries',
      name: 'Loaded Fries Cheddar & Bacon',
      description: 'Frites fraîches coupées à la main, nappées d\'une sauce cheddar chaude onctueuse, bacon croustillant émietté et rondelles de jalapeños.',
      price: 3000,
      category: 'cat-sides',
      imageUrl: './images/loaded_fries.jpg',
      badge: 'À partager',
      available: true,
      order: 10
    },
    {
      id: 'prod-tenders-box',
      name: 'Box Tenders de Poulet x5',
      description: '5 Filets de poulet marinés panés dans notre chapelure secrète croustillante, servis avec 2 sauces maison (BBQ et Mayo épicée).',
      price: 3500,
      category: 'cat-sides',
      imageUrl: './images/chicken_tenders.jpg',
      badge: 'Croustillant',
      available: true,
      order: 11
    },
    {
      id: 'prod-frites-maison',
      name: 'Frites Maison Secrètes',
      description: 'Frites fraîches dorées à double cuisson, assaisonnées de notre sel aux herbes et paprika fumé Burger & Co.',
      price: 1500,
      category: 'cat-sides',
      imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80',
      available: true,
      order: 12
    },
    {
      id: 'prod-milkshake-oreo',
      name: 'Milkshake Oreo Suprême',
      description: 'Glace vanille artisanale onctueuse, lait entier, biscuits Oreo concassés, coulis de chocolat fondant et dôme de chantilly maison.',
      price: 3000,
      category: 'cat-drinks',
      imageUrl: './images/milkshake_oreo.jpg',
      badge: 'Gourmand',
      available: true,
      order: 13
    },
    {
      id: 'prod-jus-locaux',
      name: 'Jus Maison Bissap & Bouye',
      description: 'Jus traditionnels sénégalais 100% naturels préparés quotidiennement : Bissap parfumé à la menthe ou Bouye onctueux à la vanille.',
      price: 1500,
      category: 'cat-drinks',
      imageUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=800&q=80',
      badge: 'Local & Frais',
      available: true,
      order: 14
    },
    {
      id: 'prod-cookie-choc',
      name: 'Maxi Cookie Moelleux Tout Choco',
      description: 'Grand cookie artisanal façon NYC, pâte pur beurre, généreuses pépites de chocolat noir et chocolat au lait fondu, servi tiède.',
      price: 2000,
      category: 'cat-desserts',
      imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80',
      badge: 'Délice',
      available: true,
      order: 15
    }
  ],
  gallery: [
    {
      id: 'gal-1',
      title: 'Le Double Smash Burger en cuisson vive',
      caption: 'Une croûte caramélisée inimitable et un cœur ultra juteux.',
      imageUrl: './images/burger_signature.jpg',
      order: 1,
      createdAt: '2025-01-10'
    },
    {
      id: 'gal-2',
      title: 'Barbecue Bacon Burger croustillant',
      caption: 'Fumé au bois et nappé de notre sauce barbecue maison.',
      imageUrl: './images/bbq_burger.jpg',
      order: 2,
      createdAt: '2025-01-12'
    },
    {
      id: 'gal-3',
      title: 'Crispy Chicken Burger aux 7 épices',
      caption: 'Poulet ultra tendre et chapelure dorée extra croquante.',
      imageUrl: './images/crispy_chicken.jpg',
      order: 3,
      createdAt: '2025-01-15'
    },
    {
      id: 'gal-4',
      title: 'L\'Assiette Kafta traditionnelle grillée',
      caption: 'Servie chaude avec frites maison, crème d\'ail et pain pita.',
      imageUrl: './images/assiette_kafta.jpg',
      order: 4,
      createdAt: '2025-01-18'
    },
    {
      id: 'gal-5',
      title: 'Loaded Fries Cheddar fondant & Bacon',
      caption: 'La portion gourmande incontournable à partager entre amis.',
      imageUrl: './images/loaded_fries.jpg',
      order: 5,
      createdAt: '2025-01-20'
    },
    {
      id: 'gal-6',
      title: 'Formule Duo Gourmande Burger & Co',
      caption: 'Le pack complet pour deux avec burgers, frites et boissons fraîches.',
      imageUrl: './images/menu_duo.jpg',
      order: 6,
      createdAt: '2025-01-25'
    }
  ]
};

