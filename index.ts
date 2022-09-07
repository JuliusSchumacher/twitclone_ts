import { setupApi } from './controllers/api'
import { setupWebsite } from './controllers/website'

const APIPORT = 3000
const WEBPORT = 3001

async function main() {
    const api = await setupApi()
    const webApp = await setupWebsite()

    api.listen(APIPORT)
    console.log('API started on port ' + APIPORT)

    webApp.listen(WEBPORT)
    console.log('Website started on port ' + WEBPORT)

}

main()
