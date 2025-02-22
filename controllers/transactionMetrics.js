// THESE CONTROLLERS ARE RESPONSIBLE FOR PROVIDING THE METRICS (ANALYTICS)
import mongoose from 'mongoose';
const fs = require('fs')
const readline = require('readline')


//HIGHEST SALES VOLUME
export const highestSalesVolume = async (req, res) => {

    try {

        //ASSUME THE YEAR IS PROVIDED IN THE req.body FROM FRONTEND
        const { year } = req.body

        //RETRIEVE ALL TEXT FILES FROM THE DATABASE
        const salesVolumes = { }
        const highestSalesVolume = -Infinity
        const highestSalesFile = null

        const allTextFiles = await fileDoc.find({ year: year })

        allTextFiles.forEach(async (file) => {
            const fileStream = fs.createReadStream(file.originalName)

            const rl = readline.createInterface({
                input: fileStream,
                crlDelay: Infinity
            })

            let totalSalesVolume = 0

            //regex to split on commas not inside of quotes
            const csvSplitRegex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/

            for await (const line of rl) {
                if (!line.trim()){
                    continue    //no transaction data
                }

                const parts = line.split(csvSplitRegex)

                if(parts.length !== 4){
                    console.log('Unexpected format of line', line)
                    continue
                }

                //EXTRACT THE PRODUCTS SOLD
                const salesStaffID = parts[0].trim()
                const transactionTime = parts[1].trim()
                let productsSoldStr = parts[2].trim()
                const saleAmount = parts[3].trim()

                if (productsSoldStr.startsWith('"') && productsSoldStr.endsWith('"')){
                    productsSoldStr = productsSoldStr.slice(1, -1)
                }

                //parse the productsSold JSON string into an object
                let productsSold = JSON.parse(productsSoldStr)
            

                //sum all the quantity values from the productsSold object
                const quantitySum = Object.values(productsSold)
                .map(Number)
                .reduce((acc, qty) => acc + qty, 0)

                totalSalesVolume = totalSalesVolume + quantitySum
            }

            //push totalSalesVolume for a day into salesVolumes object
            salesVolumes[file.originalName] = totalSalesVolume

        });

        //algorithm to get the highest number (highest sales volume) in  salesVolume object
        for (let fileName in salesVolumes){
            let currentValue = salesVolumes[fileName]

            if (currentValue > highestSalesVolume){
                highestSalesVolume = currentValue
                highestSalesFile = fileName
            }
        }

        const HIGHEST_SALES_FILE = await fileDoc.find({ originalName: highestSalesFile })

        res.status(200).json({
            highest_sales_volume: `Highest sales volume in a day is: ${highestSalesVolume} which occurred on ${HIGHEST_SALES_FILE.timestamp}`
        })

    } catch(error){
        console.log(error)

        res.status(500).json({ message: "internal server error"})
    }
}



//HIGHEST SALES VALUE
export const highestSalesValue = async (req, res) => {


    try {
        //ASSUME THE YEAR IS PROVIDED IN THE req.body FROM FRONTEND
        const { year } = req.body

        //RETRIEVE ALL TEXT FILES FROM THE DATABASE
        const salesAmounts = { }
        const highestSalesAmount = -Infinity
        const highestSalesAmountFile = null

        const allTextFilesForDay = await fileDoc.find({ year: year })

        allTextFilesForDay.array.forEach(async (file) => {
            const fileStream = fs.createReadStream(file.originalName)

            const rl = readline.createInterface({
                input: fileStream,
                crlDelay: Infinity
            })

            let totalSalesAmount = 0

            //regex to split on commas not inside of quotes
            const csvSplitRegex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/

            for await (const line of rl) {
                if (!line.trim()){
                    continue
                }

                const parts = line.split(csvSplitRegex)

                if(parts.length !== 4){
                    console.log('Unexpected format of line', line)
                    continue
                }

                //EXTRACT SALE AMOUNT
                const saleAmount = parts[3].trim()

                totalSalesAmount = totalSalesAmount + saleAmount 
            }

            //push totalSalesAmount for a day into salesAmounts object
            salesAmounts[file.originalName] = totalSalesAmount

            //algorithm to get the highest number (highest sales amount) in  salesAmounts object
            for (let fileName in salesAmounts){
                let currentValue = salesAmounts[fileName]

                if (currentValue > highestSalesAmount){
                    highestSalesAmount = currentValue
                    highestSalesAmountFile = fileName
                }
            }

            const HIGHEST_SALES_FILE = await fileDoc.find({ originalName: highestSalesAmountFile })

            res.status(200).json({
                highest_sales_value: `Highest sales value in a day is: ${highestSalesAmount} which occurred on ${HIGHEST_SALES_FILE.timestamp}`
            })


        });
    } catch(error){
        console.log(error)

        res.status(500).json({ message: "internal server error"})
    }
}



//MOST SOLD PRODUCT ID BY VOLUME
export const mostSoldProductID = async (req, res) => {

    try {
        //ASSUME THE YEAR IS PROVIDED IN THE req.body FROM FRONTEND
        const { year } = req.body

        const productQuantities = { }
        const mostSoldProduct = null
        const mostSoldProductQuantity = -Infinity

        //RETRIEVE ALL TEXT FILES FROM THE DATABASE
        const allTextFiles = await fileDoc.find({ year: year })

        allTextFiles.forEach(async (file) => {
            const fileStream = fs.createReadStream(file.originalName)

            const rl = readline.createInterface({
                input: fileStream,
                crlDelay: Infinity
            })

            //regex to split on commas not inside of quotes
            const csvSplitRegex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/

            for await (const line of rl) {
                if (!line.trim()){
                    continue
                }

                const parts = line.split(csvSplitRegex)

                if(parts.length !== 4){
                    console.log('Unexpected format of line', line)
                    continue
                }

                //EXTRACT THE PRODUCT SOLD
                let productsSoldStr = parts[2].trim()

                if (productsSoldStr.startsWith('"') && productsSoldStr.endsWith('"')){
                    productsSoldStr = productsSoldStr.slice(1, -1)
                }

                //parse the productsSold JSON string into an object
                let productsSold = JSON.parse(productsSoldStr)

                //map productIDs to their quantities
                for (let ID in productsSold){
                    if (!(ID in productQuantities)){
                        productQuantities[ID] = 0
                    }

                    productQuantities[ID] += 1
                }
            }
        });

        //algorithm to get product ID with highest sales volume
        for (let ID in productQuantities){
            let currentValue = productQuantities[ID]

            if (currentValue > mostSoldProductQuantity){
                mostSoldProductQuantity = currentValue
                mostSoldProduct = ID
            }
        }

        res.status(200).json({
            most_sold_product_ID: `Most product ID is: ${mostSoldProduct}`
        })

    } catch(error){
        console.log(error)

        res.status(500).json({ message: "internal server error"})
    }
}




//HIGHEST SALES STAFF ID FOR EACH MONTH
export const highestSalesStaffID = async (req, res) => {

    try {
      //ASSUME THE YEAR IS PROVIDED IN THE req.body FROM FRONTEND
      const { year } = req.body
      const salesStaffIDs = {}

      const highest_staff_ID_per_month = { }
      const highestSalesAmount = -Infinity

      const months = ["01","02","03","04","05","06","07","08","09","10","11","12"]

      for (let month in months){
        const allTextFiles = await fileDoc.find({ year: year, month: month })

        allTextFiles.forEach(async (file) => {
            const fileStream = fs.createReadStream(file.originalName)

            const rl = readline.createInterface({
                input: fileStream,
                crlDelay: Infinity
            })

            //regex to split on commas not inside of quotes
            const csvSplitRegex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/

            for await (const line of rl) {
                if (!line.trim()){
                    continue
                }

                const parts = line.split(csvSplitRegex)

                if(parts.length !== 4){
                    console.log('Unexpected format of line', line)
                    continue
                }

                //EXTRACT THE SALE AMOUNT AND ASSOCIATED STAFF ID
                const salesStaffID = parts[0].trim()
                const saleAmount = parts[3].trim()

                //map each the salesStaffID to the corresponding saleAmount
                if (!(salesStaffID in salesStaffIDs)){
                    salesStaffIDs[salesStaffID] = 0
                }
                salesStaffIDs[salesStaffID] += saleAmount
            }
        });

        //algorithm to get the staffID with highest cummulative saleAmount
        for (let staffID in salesStaffIDs){
            let currentValue = salesStaffIDs[staffID]

            if (currentValue > highestSalesAmount){
                highestSalesAmount = currentValue
            }
        }

        //set the highest salesStaffID for that month
        highest_staff_ID_per_month[month] = highestSalesAmount
      } 
    }
    catch(error){
        console.log(error)

        //send the object to the frontend
        res.status(500).json({ highest_staff_ID_per_month })
    }
}




//HIGHEST HOUR OF DAY
export const highestHourOfDay = async (req, res) => {

    try {
        

    } catch(error){
       
    }
}