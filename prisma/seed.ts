import { db } from '@/lib/db'

async function main() {
  // Create barber
  const barber = await db.barber.create({
    data: {
      name: 'Jonathan',
      bio: 'The master behind J The Barber. Specializing in precision fades and beard sculpting with over 10 years of experience.',
      specialties: ['Skin Fades', 'Beard Sculpting', 'Hot Towel Shaves'],
    },
  })

  // Create services
  const services = [
    { name: 'Haircut', price: 30, duration: 40, category: 'Men' },
    { name: 'Haircut & Beard', price: 50, duration: 50, category: 'Men' },
    { name: 'Beard Trim', price: 20, duration: 30, category: 'Beard' },
    { name: 'Hot Towel Shave', price: 35, duration: 30, category: 'Men' },
    { name: 'Head Shave', price: 30, duration: 30, category: 'Men' },
    { name: 'High/Mid/Low Skin Fade', price: 40, duration: 40, category: 'Fades' },
    { name: 'Kids Haircut', price: 25, duration: 30, category: 'Kids' },
    { name: 'Female Cut', price: 30, duration: 40, category: 'Women' },
    { name: 'College Haircut', price: 25, duration: 45, category: 'Men' },
    { name: 'Line Up', price: 20, duration: 25, category: 'Men' },
  ]

  for (const service of services) {
    await db.service.create({ data: service })
  }

  console.log('Seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })