import { Column, Primary } from 'sqlite-ts'

export class Follower {
    @Primary()
    id: number = 0

    @Column('INTEGER')
    user: number = 0

    @Column('INTEGER')
    follows: number = 0
}
