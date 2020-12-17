const { resolve } = require("path");
const puppeteer = require("puppeteer")
var browser = false

const queries = ["wadad", "Dasd", "wadad", "Dasd", "wadad", "Dasd", "wadad", "Dasd", "wadad", "Dasd"]


async function initiate() {
    browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: null,
	    args: ['--no-sandbox', '--disable-setuid-sandbox'],
        userDataDir: "./browserProfile",
        devtools: true,
    });

    console.log("> scraper initiated!")
    
    for (query of queries) {
        const result = await getTrailer(query)
        console.log(result);
    }
}

async function getTrailer(title) {
    const url = `https://www.youtube.com/results?search_query=${title} trailer`
    console.log("> scraping: " + url)

    return new Promise(async resolve => {
        const page = await browser.newPage()
        page.goto(url)

        await page.waitForNavigation()

        const results = await page.evaluate(() => {
            var results = []

            let hits = document.getElementsByClassName("yt-simple-endpoint style-scope ytd-video-renderer")
            
            for (let hit of hits) {
                const set = {
                    title: hit.childNodes[3].innerHTML,
                    href: hit.href
                }

                results.push(set)
            }

            return results
        })

        await page.close()
        resolve(results)
    })
}

initiate()