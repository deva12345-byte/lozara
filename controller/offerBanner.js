const model = require('../model/offerBanner');

module.exports.AddOfferBanner = async (req, res) => {
    try {
        let { text } = req.body; // Assuming you're using req.body, not `fields`

        if (!text) {
            return res.status(400).json({
                result: false,
                message: 'Banner text is required',
            });
        }

        // Step 1: Check if banner already exists
        const existingBanner = await model.GetOfferBanner(); // Replace with your actual query to fetch

        let response;

        if (existingBanner.length > 0) {
            // Step 2: Update if exists
            response = await model.UpdateOfferBanner(text,existingBanner[0]?.ob_id);
        } else {
            // Step 3: Insert if not exists
            response = await model.AddOfferBannerQuery(text);
        }

        if (response.affectedRows > 0) {
            return res.status(200).json({
                result: true,
                message: existingBanner.length > 0 ? 'Offer Banner updated successfully' : 'Offer Banner added successfully',
            });
        } else {
            return res.status(200).json({
                result: false,
                message: 'Failed to save OfferBanner',
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            result: false,
            message: 'An unexpected error occurred.',
            data: error,
        });
    }
};



module.exports.ListOfferBanners = async (req, res) => {
    try {
       
        let ListOfferBanners = await model.GetOfferBanner();
        if (ListOfferBanners.length > 0) {
            return res.send({
                result: true,
                message: "data retrieved",
                list: ListOfferBanners
            });
        } else {
            return res.send({
                result: false,
                message: "data not found",
            });

        }

    } catch (error) {
        return res.send({
            result: false,
            message: error.message,

        });
    }
}