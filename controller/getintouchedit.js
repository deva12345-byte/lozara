const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const model = require('../model/getintouchedit');

module.exports.editgetintouch =async(req,res)=>{
    try{
        const form =new formidable.IncomingForm({ multiples:false});

        form.parse(req,async(err,fields,files) =>{
            if(err){
                return res.send({
                    result:false,
                    message:'file upload failed!',
                    data:err,
                });

            }
            const{g_id,description,heading,contact}=fields;
             
  if (!g_id) {
    return res.send({
        result:false,
        message:'insufficient parameters',

    });
        }
    const getintouchExists =await model.checkgetintouchQuery(g_id);
    if(getintouchExists.length ===0){
        return res.send({
            result:false,
            message:'details  does not exists',
        });
    }
    let updates =[];
    if(description)updates.push(`g_description='${description}'`);
    if(heading)updates.push(`g_heading='${heading}'`);
    if(contact)updates.push(`g_contact='${contact}'`);

     if (updates.length > 0) {
            const updateQuery = `SET ${updates.join(', ')}`;
            var updateResult = await model.UpdategetintouchtDetails(updateQuery, g_id);
     }
     if (files.image) {
             const oldPath = files.image.filepath;
             const fileName = files.image.originalFilename;
             const newPath = path.join(process.cwd(), '/uploads/get_in_touch/', fileName);
     
             const rawData = fs.readFileSync(oldPath);
             fs.writeFileSync(newPath, rawData);
             const imagePath = `/uploads/get_in_touch/${fileName}`;
             const imageUpdate = await model.UpdategetintouchImage(imagePath, g_id);
             if (!imageUpdate.affectedRows) {
          return res.send({
            result: false,
            message: 'Failed to update get in touch image',
          });
        }
      }

      return res.send({
        result: true,
        message: ' get in touch updated successfully',
      });
    });
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
    });
  }

};



    

     
