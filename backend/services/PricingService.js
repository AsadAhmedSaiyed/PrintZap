const axios = require('axios');
const { PDFDocument } = require('pdf-lib');

class PricingService {
    constructor() {
        this.baseRateInfo = 2.0; // Fallback
    }

    async calculatePrice(fileUrl, settings, shopRate) {
        // 1. Download File Buffer
        // Note: Used for page counting. This assumes file is public or signed URL.
        try {
            // For MVP, if fileUrl is from Zoho WorkDrive, downloading might require Auth.
            // If Zobot sends a public download link, this works.
            // If not, we might default to 1 page or mock it for now if access is restricted.

            // Attempt download
            const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
            const buffer = response.data;

            // 2. Count Pages
            let pages = 0;
            if (fileUrl.toLowerCase().endsWith('.pdf')) {
                const pdfDoc = await PDFDocument.load(buffer);
                pages = pdfDoc.getPageCount();
            } else {
                // Determine docx length? Complex. Default to 1 for MVP if not PDF.
                pages = 1;
            }

            // 3. Calculate Price
            // Price = Pages * Copies * ShopRate
            // Color Logic: If color, maybe 3x rate?
            const rate = settings.color ? shopRate * 3 : shopRate;
            const price = pages * settings.copies * rate;

            return {
                pages,
                price: Math.ceil(price), // Round up
            };

        } catch (error) {
            console.error("Error calculating price (Using default):", error.message);
            // Fallback
            return {
                pages: 1,
                price: Math.ceil(1 * settings.copies * shopRate)
            };
        }
    }
}

module.exports = new PricingService();
