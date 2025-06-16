var model = require("../model/faq");



module.exports.AddFaq = async (req, res) => {

    try {
        let { question, answer } = req.body

        if (!question || !answer) {
            return res.send({
                result: false,
                message: "all fields are required"
            });
        }

        let addFaq = await model.AddFaqQuery(question, answer);

        if (addFaq.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Faq question and answer added successfully"
            })


        }
        else {
            return res.send({
                result: failed,
                message: "Faq question and answer added failed"
            })
        }



    } catch (error) {
        console.log(error);
        return res.send({
            result: false,
            message: error.message,
        });
    }

}

module.exports.ListFaq = async (req, res) => {
    try {
        let { fq_id } = req.body || {}
        var condition = ""
        if (fq_id) {
            condition = `where fq_id ='${fq_id}' `
        }
        let listFaq = await model.ListFaqQuerry(condition);
        if (listFaq.length > 0) {
            return res.send({
                result: true,
                message: "data retrieved",
                list: listFaq,

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

module.exports.deleteFaq = async (req, res) => {
    try {
        let fq_id = req.body.fq_id;
        if (fq_id) {
            let checkFaq = await model.checkFaqQuery(fq_id);
            if (checkFaq.length == 0) {
                return res.send({
                    result: false,
                    message: "Faq not found"
                });
            } else {
                var deletesection = await model.RemoveFaqQuery(fq_id);
                if (deletesection.affectedRows > 0) {
                    return res.send({
                        result: true,
                        message: "Faq deleted successfully"
                    });

                }
            }
        } else {
            return res.send({
                result: false,
                message: "Faq id is required"
            });
        }

    } catch (error) {
        return res.send({
            result: false,
            message: error.message,

        });
    }
}
module.exports.EditFaq = async (req, res) => {
    try {

        const { fq_id, question, answer } = req.body;

        if (!fq_id || !question || !answer) {
            return res.send({
                result: false,
                message: 'all fieldds are required',
            });
        }

        const FaqExists = await model.checkFaqQuery(fq_id);
        if (FaqExists.length === 0) {
            return res.send({
                result: false,
                message: 'Faq does not exist',
            });
        } else {

            var updateResult = await model.UpdateFaqDetails(question, answer, fq_id);
            if (updateResult.affectedRows > 0) {
                return res.send({
                    result: true,
                    message: 'Faq updated successfully',
                });
            }

        }

    } catch (error) {
        return res.send({
            result: false,
            message: error.message,
        });
    }

}




