import express from 'express'
import bodyParser from 'body-parser'
import {Follower} from '../models/follower'
import {User} from '../models/user'
import {Tweet} from '../models/tweet'
import path from 'path'
import axios from 'axios'

const APIURL = 'http://localhost:3000/api'

export async function setupWebsite() {
    const app = express()
    const urlencodedParser = bodyParser.urlencoded({ extended: false })

    app.set('view engine', 'ejs')
    app.set('views', path.join(__dirname, '../views'))

    // default view, timeline
    app.get('/', urlencodedParser, async (req, res) => {
        const userid = req.body.user ? req.body.user : 2

        const options = {
            url: `${APIURL}/tweets/${userid}/timeline`,
            method: 'GET',
        }

        const tweets = await axios(options)
            .then(response => response.data as Tweet[])
            .catch(console.error)

        res.render('timeline', {
            tweets: tweets
        })
    })

    // users
    app.get('/users', urlencodedParser, async (req, res) => {
        const userid = req.body.user ? req.body.user : 2

        const options = {
            url: `${APIURL}/users`,
            method: 'GET',
        }

        const users = await axios(options)
            .then(response => response.data as User[])
            .catch(console.error)

        res.render('users', {
            users: users,
            userid: userid
        })
    })

    return app

}
