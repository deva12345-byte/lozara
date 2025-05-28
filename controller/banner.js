const model = require('../model/banner');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

module.exports.AddBanner = async (req, res) => {
    try {
        const form = new formidable.IncomingForm({ multiples: true });
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error(err);
                return res.status(400).json({
                    result: false,
                    message: 'File upload failed!',
                    data: err,
                });
            }
            let { heading, title, description } = fields
            if (!files.image || !heading || !title || !description) {
                return res.status(400).json({
                    result: false,
                    message: 'all fields are required / No image file uploaded.',
                });
            }
            console.log(heading, title, description);
            console.log(files.image);


            if (files) {


                const oldPath = files.image[0]?.filepath;
                const newFileName = files.image[0]?.originalFilename;
                const newPath = path.join(process.cwd(), 'uploads', 'banner', newFileName);

                try {
                    const rawData = fs.readFileSync(oldPath);
                    fs.writeFileSync(newPath, rawData);

                    const imagePath = path.join('uploads', 'banner', newFileName);
                    let addbanner = await model.AddBannerQuery(heading, title, description, imagePath);

                    if (addbanner.affectedRows > 0) {

                        return res.status(200).json({
                            result: true,
                            message: 'Banner added successfully',
                        });
                    } else {
                        return res.status(200).json({
                            result: false,
                            message: 'Failed to added banner',
                        });
                    }

                } catch (fileErr) {
                    console.error(fileErr);
                    return res.status(500).json({
                        result: false,
                        message: 'Failed to save the image file.',
                        data: fileErr,
                    });
                }
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            result: false,
            message: 'An unexpected error occurred.',
            data: error,
        });
    }
};


module.exports.ListBanners = async (req, res) => {
    try {
        let { b_id } = req.body || {}
        var condition = ""
        if (b_id) {
            condition = `where b_id ='${b_id}' `
        }
        let ListBanners = await model.ListBannersQuerry(condition);
        if (ListBanners.length > 0) {
            return res.send({
                result: true,
                message: "data retrieved",
                list: ListBanners
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

module.exports.deleteBanners = async (req, res) => {
    try {
        let b_id = req.body.b_id;
        if (b_id) {
            let checkbanner = await model.checkbannerQuery(b_id);
            if (checkbanner.length == 0) {
                return res.send({
                    result: false,
                    message: "banner not found"
                });
            } else {
                var deletesection = await model.RemoveBannerQuery(b_id);
                if (deletesection.affectedRows > 0) {
                    return res.send({
                        result: true,
                        message: "banner deleted successfully"
                    });

                }
            }
        }

    } catch (error) {
        return res.send({
            result: false,
            message: error.message,

        });
    }
}


module.exports.EditBanner = async (req, res) => {
  try {
    const form = new formidable.IncomingForm({ multiples: false });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.send({
          result: false,
          message: 'File Upload Failed!',
          data: err,
        });
      }

      const { banner_id, title, subtitle, description } = fields;

      if (!banner_id) {
        return res.send({
          result: false,
          message: 'Insufficient parameters',
        });
      }

      const bannerExists = await model.checkbannerQuery(banner_id);
      if (bannerExists.length === 0) {
        return res.send({
          result: false,
          message: 'Banner does not exist',
        });
      }

      let updates = [];
      if (title) updates.push(`b_title='${title}'`);
      if (subtitle) updates.push(`b_subtitle='${subtitle}'`);
      if (description) updates.push(`b_description='${description}'`);

      if (updates.length > 0) {
        const updateQuery = `SET ${updates.join(', ')}`;
        var updateResult = await model.UpdateBannerDetails(updateQuery, banner_id);
      }

      if (files.image) {
        const oldPath = files.image.filepath;
        const fileName = files.image.originalFilename;
        const newPath = path.join(process.cwd(), '/uploads/banners/', fileName);

        const rawData = fs.readFileSync(oldPath);
        fs.writeFileSync(newPath, rawData);

        const imagePath = `/uploads/banners/${fileName}`;
        const imageUpdate = await model.UpdateBannerImage(imagePath, banner_id);

        if (!imageUpdate.affectedRows) {
          return res.send({
            result: false,
            message: 'Failed to update banner image',
          });
        }
      }

      return res.send({
        result: true,
        message: 'Banner updated successfully',
      });
    });
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
    });
  }

};



    
    









