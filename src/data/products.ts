/**
 * Grooming Essentials — static product catalogue
 *
 * Each entry contains enough detail to render a product card on the homepage.
 * Populate `imageUrl` with real product shots when available — the UI shows a
 * placeholder silhouette until then.
 */

export interface Product {
  id: string
  name: string
  brand: string
  description: string
  price: string
  imageUrl: string
  affiliateLink: string
}

export const products: Product[] = [
  {
    id: 'pomade',
    name: 'Heavy Hold Pomade',
    brand: 'Reuzel',
    description: 'Water-soluble, high-shine pomade for slicked-back looks that last all day without buildup.',
    price: '$18.99',
    imageUrl: '',
    affiliateLink: 'https://www.amazon.com/s?k=reuzel+pomade',
  },
  {
    id: 'beard-oil',
    name: 'Beard Oil',
    brand: 'Honest Amish',
    description: 'Lightweight argan-and-jojoba blend tames frizz, reduces itch, and leaves a subtle woodsy scent.',
    price: '$14.99',
    imageUrl: '',
    affiliateLink: 'https://www.amazon.com/s?k=honest+amish+beard+oil',
  },
  {
    id: 'clipper-spray',
    name: 'Clipper Maintenance Spray',
    brand: 'Andis',
    description: 'Lubricates and cools blades between clients. Keeps your tool running smooth for years.',
    price: '$8.99',
    imageUrl: '',
    affiliateLink: 'https://www.amazon.com/s?k=andis+clipper+spray',
  },
  {
    id: 'shampoo',
    name: 'Volumizing Shampoo',
    brand: 'American Crew',
    description: 'Deep-cleans while adding body and shine. Tea tree extract refreshes the scalp.',
    price: '$16.99',
    imageUrl: '',
    affiliateLink: 'https://www.amazon.com/s?k=american+crew+volumizing+shampoo',
  },
  {
    id: 'styling-powder',
    name: 'Styling Powder',
    brand: 'Hanz de Fuko',
    description: 'Weightless matte texture powder for added volume and hold without the greasiness.',
    price: '$24.99',
    imageUrl: '',
    affiliateLink: 'https://www.amazon.com/s?k=hanz+de+fuko+powder',
  },
  {
    id: 'aftershave-balm',
    name: 'Cooling Aftershave Balm',
    brand: 'Nivea Men',
    description: 'Alcohol-free, hydrating balm soothes razor burn and tightens pores after a straight-razor shave.',
    price: '$10.99',
    imageUrl: '',
    affiliateLink: 'https://www.amazon.com/s?k=nivea+men+aftershave+balm',
  },
]
