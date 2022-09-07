import express from 'express'
import path from 'path'
import sqlite from 'sqlite3'
import {Db, SQLite3Driver} from 'sqlite-ts'
import {Follower} from './models/follower'
import {User} from './models/user'
import {Tweet} from './models/tweet'
import bodyParser from 'body-parser'

const PORT = 3000

async function main() {

    const app = express()

    // setup database
    const entities = {
        User,
        Tweet,
        Follower
    }
    const sqliteDb = new sqlite.Database(':memory:')
    const db = await Db.init({
            driver: new SQLite3Driver(sqliteDb),
            entities,
            createTables: true
        })


    const urlencodedParser = bodyParser.urlencoded({ extended: false })

    app.set('view engine', 'ejs')
    app.set('views', path.join(__dirname, 'views'))

    app.post('/items/add', urlencodedParser, async (req, res) => {
        await db.tables.Item.insert({
            content: req.body.content,
            done: (req.body.done == "on"),
        })
        res.redirect('/')
    })



    app.listen(PORT)
    console.log('Express started on port ' + PORT)
}

main()
