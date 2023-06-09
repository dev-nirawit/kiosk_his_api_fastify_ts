import { Knex } from 'knex';
// import * as moment from 'moment';

export class HosxpV4Model {

    // async save(db: any, tableName: string, whereText: any = '', data: any) {
    //     if (data) {
    //         const rows = await db(tableName).whereRaw(whereText);
    //         if (rows.length) {
    //             const result = await db(tableName).update(data)
    //                 .where('ref', rows[0].ref);
    //             return { typeSave: 'update', result };
    //         } else {
    //             const result = await db(tableName).insert(data);
    //             return { typeSave: 'insert', result };
    //         }
    //     } else {
    //         return { typeSave: 'error' };
    //     }
    // }

    async update(db: any, tableName: string, whereText: any = '', data: any) {
        if (data) {
            const result = await db(tableName).update(data)
                .whereRaw(whereText);
            return { type: 'update', result };
        }
    }

    getPatientByCID(db: Knex, tableName: string, whereText: any, selectText: any = '*') {
        return db(tableName)
            .select(selectText)
            .whereRaw(whereText)
            .first();
    }

    async getOvstTodayPttype(db: Knex, hn: any) {
        return await db('ovst as o')
            .select('o.vn', 'o.hn', 'o.oqueue', 'o.main_dep_queue', 'o.vstdate', 'o.vsttime', 'o.pttype', 'o.main_dep', 'p.pttype_price_group_id', 'k.department')
            .leftJoin('kskdepartment as k', 'k.depcode', 'o.main_dep')
            .leftOuterJoin('pttype as p', 'p.pttype', 'o.pttype')
            .where('o.hn', hn)
            .whereRaw('o.vstdate = DATE(NOW())')

    }

    getDataOne(db: Knex, tableName: string, whereText: any, selectText: any = '*') {
        return db(tableName)
            .select(selectText)
            .whereRaw(whereText)
            .first();
    }

    getData(db: Knex, tableName: string, whereText: any, selectText: any = '*', limit: number = 1) {

        if (limit > 0) {
            return db(tableName)
                .select(selectText)
                .whereRaw(whereText)
                .limit(limit);
        } else {
            return db(tableName)
                .select(selectText)
                .whereRaw(whereText);
        }

    }


    async updateVN_VisitPttypeAuthen(db: Knex, data: any, vn: string) {
        return await db('visit_pttype')
            .update(data)
            .where('vn', vn);
        // .whereNotIn('pttype_price_group_id',[3,5]);
    }

    async deletePtNoteToday(db: Knex, hn: string) {
        const result = await db('ptnote')
            .where('hn', hn)
            .where('noteflag', '[CALL_API]')
            .whereRaw('expire_date = DATE(NOW())')
            .del()
        return { type: 'delete', result };
    }

}