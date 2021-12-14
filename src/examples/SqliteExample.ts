/*
 * npm install sqlite
 */

import { Table } from "../Table";
import { assertEquals } from "./assertEquals";
import { ConsoleLogQueryRunner } from "../queryRunners/ConsoleLogQueryRunner";
import { open } from 'sqlite';
import { Database } from 'sqlite3';
import { SqliteQueryRunner } from "../queryRunners/SqliteQueryRunner";
import { SqliteConnection } from "../connections/SqliteConnection";

class DBConection extends SqliteConnection<'DBConnection'> {
}

const tCompany = new class TCompany extends Table<DBConection, 'TCompany'> {
    id = this.autogeneratedPrimaryKey('id', 'int');
    name = this.column('name', 'string');
    constructor() {
        super('company'); // table name in the database
    }
}()

const tCustomer = new class TCustomer extends Table<DBConection, 'TCustomer'> {
    id = this.autogeneratedPrimaryKey('id', 'int');
    firstName = this.column('first_name', 'string');
    lastName = this.column('last_name', 'string');
    birthday = this.optionalColumn('birthday', 'localDate');
    companyId = this.column('company_id', 'int');
    constructor() {
        super('customer'); // table name in the database
    }
}()

const dbPromise = open({ 
    filename: ':memory:',
    driver: Database
})

async function main() {
    const db = await dbPromise
    const connection = new DBConection(new ConsoleLogQueryRunner(new SqliteQueryRunner(db)))

    await connection.transaction(async () => {
        await connection.queryRunner.executeDatabaseSchemaModification(`drop table if exists customer`)
        await connection.queryRunner.executeDatabaseSchemaModification(`drop table if exists company`)

        await connection.queryRunner.executeDatabaseSchemaModification(`
            create table company (
                id integer primary key autoincrement,
                name varchar(100) not null
            )
        `)

        await connection.queryRunner.executeDatabaseSchemaModification(`
            create table customer (
                id integer primary key autoincrement,
                first_name varchar(100) not null,
                last_name varchar(100) not null,
                birthday date,
                company_id int not null references company(id)
            )
        `)

        let i = await connection
            .insertInto(tCompany)
            .values({ name: 'ACME' })
            .returningLastInsertedId()
            .executeInsert()
        assertEquals(i, 1)

        i = await connection
            .insertInto(tCompany)
            .values({ name: 'FOO' })
            .executeInsert()
        assertEquals(i, 1)

        i = await connection
            .insertInto(tCustomer)
            .values({ firstName: 'John', lastName: 'Smith', companyId: 1 })
            .returningLastInsertedId()
            .executeInsert()
        assertEquals(i, 1)
                
        i = await connection
            .insertInto(tCustomer)
            .values({ firstName: 'Other', lastName: 'Person', companyId: 1 })
            .returningLastInsertedId()
            .executeInsert()
        assertEquals(i, 2)

        i = await connection
            .insertInto(tCustomer)
            .values({ firstName: 'Jane', lastName: 'Doe', companyId: 1 })
            .returningLastInsertedId()
            .executeInsert()
        assertEquals(i, 3)

        let company = await connection
            .selectFrom(tCompany)
            .where(tCompany.id.equals(1))
            .select({
                id: tCompany.id,
                name: tCompany.name
            })
            .executeSelectOne()
        assertEquals(company, { id: 1, name: 'ACME' })

        let companies = await connection
            .selectFrom(tCompany)
            .select({
                id: tCompany.id,
                name: tCompany.name
            })
            .orderBy('id')
            .executeSelectMany()
        assertEquals(companies, [{ id: 1, name: 'ACME' }, { id: 2, name: 'FOO' }])

        let name = await connection
            .selectFrom(tCompany)
            .where(tCompany.id.equals(1))
            .selectOneColumn(tCompany.name)
            .executeSelectOne()
        assertEquals(name, 'ACME')

        let names = await connection
            .selectFrom(tCompany)
            .selectOneColumn(tCompany.name)
            .orderBy('result')
            .executeSelectMany()
        assertEquals(names, ['ACME', 'FOO'])

        i = await connection
            .insertInto(tCompany)
            .from(
                connection
                .selectFrom(tCompany)
                .select({
                    name: tCompany.name.concat(' 2')
                })
            )
            .executeInsert()
        assertEquals(i, 2)

        names = await connection
            .selectFrom(tCompany)
            .selectOneColumn(tCompany.name)
            .orderBy('result')
            .executeSelectMany()
        assertEquals(names, ['ACME', 'ACME 2', 'FOO', 'FOO 2'])

        const fooComanyNameLength = connection
            .selectFrom(tCompany)
            .selectOneColumn(tCompany.name.length())
            .where(tCompany.id.equals(2))
            .forUseAsInlineQueryValue()

        companies = await connection
            .selectFrom(tCompany)
            .select({
                id: tCompany.id,
                name: tCompany.name
            })
            .where(tCompany.name.length().greaterThan(fooComanyNameLength))
            .orderBy('id')
            .executeSelectMany()
        assertEquals(companies, [{ id: 1, name: 'ACME' },{ id: 3, name: 'ACME 2' }, { id: 4, name: 'FOO 2'}])

        i = await connection
            .update(tCompany)
            .set({
                name: tCompany.name.concat(tCompany.name)
            })
            .where(tCompany.id.equals(2))
            .executeUpdate()
        assertEquals(i, 1)

        name = await connection
            .selectFrom(tCompany)
            .where(tCompany.id.equals(2))
            .selectOneColumn(tCompany.name)
            .executeSelectOne()
        assertEquals(name, 'FOOFOO')

        i = await connection
            .deleteFrom(tCompany)
            .where(tCompany.id.equals(2))
            .executeDelete()
        assertEquals(i, 1)

        let maybe = await connection
            .selectFrom(tCompany)
            .where(tCompany.id.equals(2))
            .selectOneColumn(tCompany.name)
            .executeSelectNoneOrOne()
        assertEquals(maybe, null)

        let page = await connection
            .selectFrom(tCustomer)
            .select({
                id: tCustomer.id,
                name: tCustomer.firstName.concat(' ').concat(tCustomer.lastName)
            })
            .orderBy('id')
            .limit(2)
            .executeSelectPage()
        assertEquals(page, {
            count: 3,
            data: [
                { id: 1, name: 'John Smith' },
                { id: 2, name: 'Other Person' }
            ]
        })

        const customerCountPerCompanyWith = connection.selectFrom(tCompany)
            .innerJoin(tCustomer).on(tCustomer.companyId.equals(tCompany.id))
            .select({
                companyId: tCompany.id,
                companyName: tCompany.name,
                endsWithME: tCompany.name.endsWithInsensitive('me'),
                customerCount: connection.count(tCustomer.id)
            }).groupBy('companyId', 'companyName', 'endsWithME')
            .forUseInQueryAs('customerCountPerCompany')

        const customerCountPerAcmeCompanies = await connection.selectFrom(customerCountPerCompanyWith)
            .where(customerCountPerCompanyWith.companyName.containsInsensitive('ACME'))
            .select({
                acmeCompanyId: customerCountPerCompanyWith.companyId,
                acmeCompanyName: customerCountPerCompanyWith.companyName,
                acmeEndsWithME: customerCountPerCompanyWith.endsWithME,
                acmeCustomerCount: customerCountPerCompanyWith.customerCount
            })
            .executeSelectMany()
        assertEquals(customerCountPerAcmeCompanies, [
            { acmeCompanyId: 1, acmeCompanyName: 'ACME', acmeEndsWithME: true, acmeCustomerCount: 3 }
        ])

        const aggregatedCustomersOfAcme = connection.subSelectUsing(tCompany).from(tCustomer)
            .where(tCustomer.companyId.equals(tCompany.id))
            .selectOneColumn(connection.aggregateAsArray({
                id: tCustomer.id,
                firstName: tCustomer.firstName,
                lastName: tCustomer.lastName
            }))
            .forUseAsInlineQueryValue()

        const acmeCompanyWithCustomers = await connection.selectFrom(tCompany)
            .where(tCompany.id.equals(1))
            .select({
                id: tCompany.id,
                name: tCompany.name,
                customers: aggregatedCustomersOfAcme
            })
            .executeSelectOne()
        acmeCompanyWithCustomers.customers!.sort((a, b) => {
            return a.id - b.id
        })
        assertEquals(acmeCompanyWithCustomers, {
            id: 1,
            name: 'ACME',
            customers: [
                { id: 1, firstName: 'John', lastName: 'Smith' },
                { id: 2, firstName: 'Other', lastName: 'Person' },
                { id: 3, firstName: 'Jane', lastName: 'Doe' }
            ]
        })

        const tCustomerLeftJoin = tCustomer.forUseInLeftJoin()
        const acmeCompanyWithCustomers2 = await connection.selectFrom(tCompany).leftJoin(tCustomerLeftJoin).on(tCustomerLeftJoin.companyId.equals(tCompany.id))
            .where(tCompany.id.equals(1))
            .select({
                id: tCompany.id,
                name: tCompany.name,
                customers: connection.aggregateAsArray({
                    id: tCustomerLeftJoin.id,
                    firstName: tCustomerLeftJoin.firstName,
                    lastName: tCustomerLeftJoin.lastName
                }).useEmptyArrayForNoValue()
            })
            .groupBy('id')
            .executeSelectOne()
        acmeCompanyWithCustomers2.customers!.sort((a, b) => {
            return a.id - b.id
        })
        assertEquals(acmeCompanyWithCustomers2, {
            id: 1,
            name: 'ACME',
            customers: [
                { id: 1, firstName: 'John', lastName: 'Smith' },
                { id: 2, firstName: 'Other', lastName: 'Person' },
                { id: 3, firstName: 'Jane', lastName: 'Doe' }
            ]
        })

        const aggregatedCustomersOfAcme3 = connection.subSelectUsing(tCompany).from(tCustomer)
            .where(tCustomer.companyId.equals(tCompany.id))
            .selectOneColumn(connection.aggregateAsArrayOfOneColumn(tCustomer.firstName.concat(' ').concat(tCustomer.lastName)))
            .forUseAsInlineQueryValue()

        const acmeCompanyWithCustomers3 = await connection.selectFrom(tCompany)
            .where(tCompany.id.equals(1))
            .select({
                id: tCompany.id,
                name: tCompany.name,
                customers: aggregatedCustomersOfAcme3.useEmptyArrayForNoValue()
            })
            .executeSelectOne()
        acmeCompanyWithCustomers3.customers.sort()
        assertEquals(acmeCompanyWithCustomers3, {
            id: 1,
            name: 'ACME',
            customers: [
                'Jane Doe',
                'John Smith',
                'Other Person'
            ]
        })

        i = await connection.update(tCustomer)
            .from(tCompany)
            .set({
                lastName: tCustomer.lastName.concat(' - ').concat(tCompany.name)
            })
            .where(tCustomer.companyId.equals(tCompany.id))
            .and(tCustomer.id.equals(1))
            .executeUpdate()
        assertEquals(i, 1)
    })
}

main().then(() => {
    console.log('All ok')
    process.exit(0)
}).catch((e) => {
    console.error(e)
    process.exit(1)
})

