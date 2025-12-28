const Shop = require('../models/Shop');

class RoutingService {
    async findBestShop(filterContext) {
        // 1. Get Active Shops
        const shops = await Shop.find({ status: 'active' });

        if (shops.length === 0) return null;

        // 2. Filter (Optional - e.g., only "Hostel" shops)
        let candidates = shops;
        if (filterContext && filterContext.location) {
            const matched = shops.filter(s => s.location.includes(filterContext.location));
            if (matched.length > 0) candidates = matched;
        }

        // 3. Sort by Queue Size (Ascending)
        candidates.sort((a, b) => a.queueSize - b.queueSize);

        // 4. Return Best
        return candidates[0];
    }
}

module.exports = new RoutingService();
