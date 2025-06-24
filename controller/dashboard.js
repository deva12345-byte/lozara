var model = require('../model/dashboard')

module.exports.Dashboard = async (req, res) => {
    try {

        let totalsales = await model.TotalsalesQuery();

        let totaluser = await model.TotalUserQuery();

        let totalproducts = await model.TotalProductsQuery();

        let totalupcomingproducts = await model.TotalUpcomingProductQuery();

        let thismonthsales = await model.ThisMonthSalesQuery();

        let thisyearsales = await model.ThisYearSalesQuery();

        if (thisyearsales) {

            return res.send({
                result: true,
                message: "data retrieved",
                totalsales: totalsales[0]?.total_amount,
                totaluser: totaluser[0]?.total_users,
                totalproducts: totalproducts[0]?.total_products,
                totalupcomingproducts: totalupcomingproducts[0]?.upcoming_products,
                thismonthsales: thismonthsales[0]?.total_sales_this_month,
                thisyearsales: thisyearsales[0]?.total_sales_this_year

            });
        }

    } catch (error) {
        return res.send({
            result: false,
            message: error.message,

        });
    }
}