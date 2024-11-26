export interface SeasonalAdvice {
  characteristics: {
    skinTone: string;
    eyeColor: string[];
    hairColor: string[];
  };
  clothing: {
    bestColors: string[];
    avoidColors: string[];
    patterns: string[];
    fabrics: string[];
  };
  makeup: {
    foundation: string;
    blush: string[];
    lipstick: string[];
    eyeshadow: string[];
  };
  accessories: {
    metals: string[];
    gemstones: string[];
    recommendations: string[];
  };
  combinations: {
    casual: string[];
    formal: string[];
    accent: string[];
  };
}

export const seasonalAdvice: Record<string, SeasonalAdvice> = {
  spring: {
    characteristics: {
      skinTone: "Light to medium with warm undertones—typically has a peachy or golden glow",
      eyeColor: ["Bright blue", "Clear green", "Warm hazel", "Light golden brown"],
      hairColor: ["Golden blonde", "Strawberry blonde", "Warm brown", "Red-gold highlights"]
    },
    clothing: {
      bestColors: ["Coral", "Golden Yellow", "Bright Turquoise", "Periwinkle", "Mint Green"],
      avoidColors: ["Dark Brown", "Burgundy", "Dark Gray", "Cool Purple"],
      patterns: ["Watercolor prints", "Light geometric", "Bright florals", "Abstract dots"],
      fabrics: ["Light cotton", "Crisp linen", "Lightweight silk", "Sheer chiffon"]
    },
    makeup: {
      foundation: "Warm beige with golden or peach undertones",
      blush: ["Coral pink", "Warm peach", "Golden apricot", "Soft tangerine"],
      lipstick: ["Coral red", "Warm pink", "Peachy nude", "Golden rose", "Bright salmon"],
      eyeshadow: ["Warm gold", "Peach", "Light bronze", "Warm copper", "Soft coral"]
    },
    accessories: {
      metals: ["Yellow gold", "Rose gold", "Bright copper"],
      gemstones: ["Coral", "Amber", "Citrine", "Peach moonstone", "Golden topaz"],
      recommendations: [
        "Delicate gold chain necklaces",
        "Coral statement earrings",
        "Bright colored silk scarves",
        "Natural leather in warm tan"
      ]
    },
    combinations: {
      casual: [
        "Coral top with light wash denim and gold accessories",
        "Mint green dress with rose gold jewelry",
        "Golden yellow blouse with white pants and coral accents"
      ],
      formal: [
        "Bright turquoise gown with gold statement jewelry",
        "Peach silk dress with rose gold and crystal details",
        "Warm pink suit with golden accessories"
      ],
      accent: [
        "Gold jewelry with warm neutral outfits",
        "Coral scarf with cream basics",
        "Turquoise accessories with light neutrals"
      ]
    }
  },
  summer: {
    characteristics: {
      skinTone: "Light to medium with cool undertones—often has a rosy or blue undertone",
      eyeColor: ["Soft blue", "Cool gray", "Muted green", "Cool hazel"],
      hairColor: ["Ash blonde", "Light brown", "Cool medium brown", "Silver-toned highlights"]
    },
    clothing: {
      bestColors: ["Powder Blue", "Soft Rose", "Cool Lavender", "Dusty Pink", "Sage Green"],
      avoidColors: ["Bright Orange", "Warm Yellow", "Bright Red", "Camel Brown"],
      patterns: ["Soft watercolor", "Muted florals", "Delicate stripes", "Subtle dots"],
      fabrics: ["Matte silk", "Soft cotton", "Light wool", "Cool linen"]
    },
    makeup: {
      foundation: "Cool beige with pink or neutral undertones",
      blush: ["Cool rose", "Soft mauve", "Dusty pink", "Cool plum", "Soft berry"],
      lipstick: ["Rose pink", "Cool mauve", "Soft berry", "Dusty rose", "Cool pink"],
      eyeshadow: ["Cool gray", "Soft plum", "Powder blue", "Silver taupe", "Cool lavender"]
    },
    accessories: {
      metals: ["Silver", "White gold", "Platinum", "Pewter"],
      gemstones: ["Pearl", "Rose Quartz", "Blue Topaz", "Pale Amethyst", "Clear Crystal"],
      recommendations: [
        "Delicate silver chains",
        "Pearl stud earrings",
        "Soft pastel scarves",
        "Cool-toned leather accessories"
      ]
    },
    combinations: {
      casual: [
        "Powder blue top with gray pants and pearl accents",
        "Soft rose dress with silver jewelry",
        "Lavender blouse with light denim and crystal details"
      ],
      formal: [
        "Dusty rose gown with pearl and crystal accessories",
        "Powder blue suit with silver details",
        "Cool lavender dress with white gold jewelry"
      ],
      accent: [
        "Pearl accessories with cool neutral outfits",
        "Soft pink scarf with gray basics",
        "Silver jewelry with pastel colors"
      ]
    }
  },
  autumn: {
    characteristics: {
      skinTone: "Medium to deep with warm undertones—golden, copper, or rich olive complexion",
      eyeColor: [
        "Deep amber brown",
        "Warm hazel",
        "Forest green",
        "Golden brown",
        "Copper brown"
      ],
      hairColor: [
        "Rich auburn",
        "Chestnut brown",
        "Golden brown",
        "Copper red",
        "Dark chocolate with warm highlights"
      ]
    },
    clothing: {
      bestColors: [
        "Burnt Orange",
        "Deep Olive",
        "Warm Burgundy",
        "Rich Terracotta",
        "Golden Brown",
        "Deep Mustard",
        "Forest Green"
      ],
      avoidColors: [
        "Icy Pastels",
        "Neon Colors",
        "Cool Pink",
        "Pure White",
        "Electric Blue"
      ],
      patterns: [
        "Rich paisley",
        "Warm plaids",
        "Animal prints",
        "Ethnic patterns",
        "Nature-inspired motifs",
        "Textured weaves"
      ],
      fabrics: [
        "Rich suede",
        "Textured leather",
        "Warm tweed",
        "Heavy knits",
        "Brushed cotton",
        "Corduroy",
        "Velvet"
      ]
    },
    makeup: {
      foundation: "Warm beige to deep golden with yellow or olive undertones",
      blush: [
        "Warm terracotta",
        "Rich bronze",
        "Golden peach",
        "Burnished copper",
        "Deep coral"
      ],
      lipstick: [
        "Brick red",
        "Warm burgundy",
        "Copper brown",
        "Rich terracotta",
        "Golden brown",
        "Warm russet"
      ],
      eyeshadow: [
        "Copper",
        "Bronze",
        "Forest green",
        "Rich gold",
        "Warm brown",
        "Deep moss",
        "Mahogany"
      ]
    },
    accessories: {
      metals: [
        "Antique gold",
        "Burnished copper",
        "Aged bronze",
        "Warm brass",
        "Oxidized metals"
      ],
      gemstones: [
        "Amber",
        "Tiger's Eye",
        "Carnelian",
        "Topaz",
        "Garnet",
        "Bronze Pearl",
        "Golden Citrine"
      ],
      recommendations: [
        "Vintage-style gold jewelry",
        "Leather bags in cognac or tobacco",
        "Textured wooden accessories",
        "Woven scarves in autumn colors",
        "Tortoiseshell accessories",
        "Bronze hardware details"
      ]
    },
    combinations: {
      casual: [
        "Rust sweater with olive pants and cognac leather boots",
        "Forest green blouse with dark denim and gold accessories",
        "Terracotta dress with wooden jewelry and brown leather belt",
        "Mustard cardigan with brown corduroy and copper accessories"
      ],
      formal: [
        "Deep burgundy gown with vintage gold and amber jewelry",
        "Forest green suit with antique bronze accessories",
        "Rich brown velvet dress with copper and topaz details",
        "Olive silk dress with golden vintage jewelry"
      ],
      accent: [
        "Tortoiseshell and copper accessories with earth-toned outfits",
        "Woven scarf in autumn colors with neutral basics",
        "Wooden jewelry with rich colored clothing",
        "Vintage gold pieces with deep warm colors"
      ]
    }
  },
  winter: {
    characteristics: {
      skinTone: "Very light (porcelain) or deep with cool undertones—high contrast appearance",
      eyeColor: ["Deep brown", "Icy blue", "Clear emerald", "Intense black"],
      hairColor: ["Deep brown", "Blue-black", "Pure white", "Salt and pepper", "Cool dark"]
    },
    clothing: {
      bestColors: [
        "True White",
        "Pure Black",
        "Royal Blue",
        "Vivid Fuchsia",
        "Electric Purple",
        "True Red",
        "Emerald Green"
      ],
      avoidColors: [
        "Muted Earth Tones",
        "Warm Browns",
        "Dusty Pastels",
        "Coral",
        "Peach"
      ],
      patterns: [
        "High contrast geometric",
        "Bold abstract",
        "Sharp stripes",
        "Color blocking",
        "Dramatic prints"
      ],
      fabrics: [
        "High-shine silk",
        "Patent leather",
        "Crisp cotton",
        "Metallic fabrics",
        "Sleek synthetics"
      ]
    },
    makeup: {
      foundation: "Cool porcelain or deep cool undertones with blue/pink base",
      blush: [
        "Cool pink",
        "True red",
        "Deep berry",
        "Bright fuchsia",
        "Cool plum"
      ],
      lipstick: [
        "Blue-red",
        "Deep burgundy",
        "Bright fuchsia",
        "Cool crimson",
        "Deep purple",
        "Pure black cherry"
      ],
      eyeshadow: [
        "Pure white",
        "True black",
        "Silver",
        "Sapphire blue",
        "Deep emerald",
        "Electric purple"
      ]
    },
    accessories: {
      metals: [
        "Platinum",
        "White gold",
        "Sterling silver",
        "Gunmetal",
        "Chrome"
      ],
      gemstones: [
        "Diamond",
        "White sapphire",
        "Black onyx",
        "Deep ruby",
        "Clear crystal",
        "Blue sapphire"
      ],
      recommendations: [
        "Statement silver jewelry",
        "High-shine metallic accessories",
        "Crystal and diamond pieces",
        "Bold geometric designs",
        "High contrast combinations"
      ]
    },
    combinations: {
      casual: [
        "Pure white turtleneck with black pants and silver accessories",
        "Royal blue dress with platinum jewelry and white boots",
        "Black leather jacket with white top and silver hardware"
      ],
      formal: [
        "True red gown with diamond and crystal accessories",
        "Black evening dress with statement silver jewelry",
        "Emerald green suit with platinum and onyx details"
      ],
      accent: [
        "Silver statement pieces with monochrome outfits",
        "Crystal accessories with jewel tones",
        "High contrast black and white with metallic accents"
      ]
    }
  }
}; 