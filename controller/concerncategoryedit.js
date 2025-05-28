const model = require("../model/concerncategoryedit.js");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

module.exports.concerncategoryedit = async (req, res) => {
    try {
        const form = new formidable.IncomingForm({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.send({
                    result: false,
                    message: 'File Upload Failed!',
                    data: err
                });
            }

            let { concerncategoryname,cc_id } = fields;

            if (!concerncategoryname || !cc_id) {
                return res.send({
                    result: false,
                    message: "Insufficient parameter"
                });
            }

            let concerncategoryExists = await model.checkconcerncategoryQuery(cc_id);
            if (concerncategoryExists.length === 0) {
                return res.send({
                    result: false,
                    message: 'Concern category does not exist',
                });
            }

            const updates = [];
            if (concerncategoryname) {
                updates.push(`cc_name='${concerncategoryname}'`);
            }

            const updateQuery = `SET ${updates.join(', ')}`;
            
            await model.updateconcerncategoryQuery(updateQuery, cc_id);

            if (files.image) {
                const oldPath = files.image.filepath;
                const fileName = files.image.originalFilename;
                const uploadDir = path.join(process.cwd(), '/uploads/concerncategories/');

                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                const newPath = path.join(uploadDir, fileName);
                const rawData = fs.readFileSync(oldPath);
                fs.writeFileSync(newPath, rawData);

                const imagePath = `/uploads/concerncategories/${fileName}`;
                const imageUpdate = await model.UpdateconcerncategoryImage(imagePath, cc_id);

                if (!imageUpdate.affectedRows) {
                    return res.send({
                        result: false,
                        message: 'Failed to update concern category image',
                    });
                }
            }

            return res.send({
                result: true,
                message: 'Concern category updated successfully',
            });
        });
    } catch (error) {
        console.error(error);
        return res.send({
            result: false,
            message: error.message,
        });
    }
};
