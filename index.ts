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
    const sqliteDb = new sqlite.Database('db')
    const db = await Db.init({
            driver: new SQLite3Driver(sqliteDb),
            entities,
            createTables: true
        })


    const urlencodedParser = bodyParser.urlencoded({ extended: false })

    app.set('view engine', 'ejs')
    app.set('views', path.join(__dirname, 'views'))

    // get users
    app.get('/users/', urlencodedParser, async (req, res) => {
        res.send(
            await db.tables.User.select()
        )
    })


    // create new user
    app.post('/users/add/:username', urlencodedParser, async (req, res) => {
        res.send(
            await db.tables.User.insert({
                username: req.params.username
            })
        )
    })

    // follow user
    app.post('/:user/follow/:follows', urlencodedParser, async (req, res) => {
        res.send(
            await db.tables.Follower.insert({
                user: Number(req.params.user),
                follows: Number(req.params.follows),
            })
        )
    })

    // get all followers
    app.get('/followers/', urlencodedParser, async (req, res) => {
        res.send(
            await db.tables.Follower.select()
        )
    })

    // view followers
    app.get('/:user/followers/', urlencodedParser, async (req, res) => {
        const id = Number(req.params.user)
        const result = await db.tables.Follower
        .join(
            t => ({
                user: t.User
            }),
            (p, {user}) => {
                p.equal({ user: user.id })
            }
        )
        .map(f => ({
            username: f.user.username
        }))
        .where(c => c.self.equals({ follows: id }))

        res.send(result)
    })

    // view following
    app.get('/:user/following/', urlencodedParser, async (req, res) => {
        const id = Number(req.params.user)
        const result = await db.tables.Follower
        .join(
            t => ({
                user: t.User
            }),
            (p, {user}) => {
                p.equal({ follows: user.id })
            }
        )
        .map(f => ({
            username: f.user.username
        }))
        .where(c => c.self.equals({ user: id }))

        res.send(result)
    })

    // get all tweets
    app.get('/tweets/', urlencodedParser, async (req, res) => {
        res.send(
            await db.tables.Tweet.select()
        )
    })

    // tweet
    app.post('/tweets/:user/new', urlencodedParser, async (req, res) => {
        res.send(
            await db.tables.Tweet.insert({
                user: Number(req.params.user),
                text: req.body.text,
                time: new Date()
            })
        )
    })

    app.get('/tweets/:user', urlencodedParser, async (req, res) => {
        const id = Number(req.params.user)
        const result = await db.tables.Tweet
            .select()
            .where(c => c.equals({user: id}))
            .orderBy({ time: 'DESC' })

        res.send(result)
    })


    app.listen(PORT)
    console.log('Express started on port ' + PORT)
}

main()
