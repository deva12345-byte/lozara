var model = require("../model/ourstandard");
const path = require('path');
var fs = require("fs");
var formidable = require("formidable");
const { checkorderQuery } = require("../model/deleteorder");
module.exports.addourstandard = async (req, res) => {
    try {
        var form = new formidable.IncomingForm({ multiples: true });
        form.parse(req, async function (err, fields, files) {
            if (err) {
                return res.send({
                    result: false,
                    message: "file upload failed!",
                    data: err,
                });

            }
            if (files.image) {
                var oldPath = files.image.filepath;
                var newPath =
                    process.cwd() + "/uploads/ourstandard/" +
                    files.image.originalFilename;
                let rawData = fs.readFileSync(oldPath);
                fs.writeFile(newPath, rawData, async function (err) {
                    if (err) console.log(err);
                    let imagepath = "uploads/ourstandard/" + files.image.originalFilename;

                    await model.AddimageQuery(imagepath);

                })
                return res.send({
                    result: true,
                    message: "image added successfully"
                })

            }
            else {
                return res.send({
                    result: false,
                    message: "image required "
                })
            }


        })


    } catch (error) {
        console.log(error);
        return res.send({
            result: false,
            message: error.message,
        })

    }
}
module.exports.listourstandard = async (req, res) => {
    try {
        
        let listourstandard = await model.listourstandardQuery();
        if(listourstandard.length>0){
            return res.send({
                result:true,
                message:"data retrieved",
                list:listourstandard,

                
            });

        }else{
            return res.send({
                result:false,
                messsage:"data not found",
            });
        }


    } catch (error) {
        return res.send({
            reult: false,
            message: error.message,
        });

    }
}
module.exports.deleteourstandard =async (req,res)=>{
    try {
        let o_id =req.body.o_id;
        if(o_id){
             let checkourstandard = await model.checkourstandardQuery(o_id);
                        if (checkourstandard.length == 0) {
            return res.send({
                result:false,
                message:"missing o_id",

            })

            
        }else{
            var deletesection =await model.removeourstandardQuery(o_id);
            if(deletesection.affectedRows>0)
                return res.send({
            result:true,
            message:"image deleted successfully"

                })
            }

        }else{
            return res.send({
                result:false,
                message:"failed to delete image",
            })
        }


        
    } catch (error) {
        return res .send({
            result:false,
            message:error.message,
        });
    }
    
            
            
    
    
}
