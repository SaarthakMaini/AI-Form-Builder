export default [
    {
        link: process.env.NEXT_PUBLIC_STRIPE_PAYMENTLINK_MONTHLY,
        price: 7.00,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY,
        duration: '/month'
    },
    {
        link: process.env.NEXT_PUBLIC_STRIPE_PAYMENTLINK_YEARLY,
        price: 49.00,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY,
        duration: '/year'
    }
]