import { Column, Primary } from 'sqlite-ts'

export class User {
    @Primary()
    id: number = 0

    @Column('NVARCHAR')
    username: string = ""
}
