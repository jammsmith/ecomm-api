const prices = {
  A: {
    uk: { gbp: 20, eur: 25, usd: 26 },
    europe: { gbp: 35, eur: 40, usd: 45 },
    usa: { gbp: 45, eur: 55, usd: 60 },
  },
  B: {
    uk: { gbp: 10, eur: 12, usd: 13 },
    europe: { gbp: 25, eur: 30, usd: 35 },
    usa: { gbp: 30, eur: 36, usd: 40 },
  },
  C: {
    uk: { gbp: 5, eur: 6, usd: 7 },
    europe: { gbp: 10, eur: 12, usd: 13 },
    usa: { gbp: 15, eur: 18, usd: 20 },
  },
}

exports = async function (currency, deliveryZone, orderItems) {
  try {
    if (
      !currency ||
      !['gbp', 'eur', 'usd'].includes(currency.toLowerCase()) ||
      !deliveryZone ||
      !['uk', 'europe', 'usa'].includes(deliveryZone.toLowerCase()) ||
      !orderItems ||
      !orderItems.length
    ) {
      throw 'Invalid arguments'
    }

    const totalLevel = orderItems.reduce((acc, oi) => {
      if (!oi || !oi.deliveryLevel) return acc

      return acc + oi.product.deliveryLevel
    }, 0)

    const priceLevel = totalLevel < 4 ? 'C' : totalLevel < 8 ? 'B' : 'A'

    return prices[priceLevel][deliveryZone][currency.toLowerCase()]
  } catch (err) {
    console.error(err)
  }
}
