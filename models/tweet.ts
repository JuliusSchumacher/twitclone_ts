import { Column, Primary } from 'sqlite-ts'

export class Tweet {
    @Primary()
    id: number = 0

    @Column('INTEGER')
    user: number = 0

    @Column('NVARCHAR')
    text: string = ""
}
