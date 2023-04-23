const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const create = async data => {
    return await prisma.tag.createMany({
        data,
        skipDuplicates: true
    }).then(() => {
        return {status: "OK"};
    }).catch(e => {
        return {stauts: "ERROR", error: e.message};
    });
};

const get = async filter => {
    let where;
    if(filter.prefix) {
        where = {
            OR: [
                {
                    name: {
                        contains: filter.prefix,
                        mode: "insensitive"
                    }
                },
                {
                    children: {
                        some: {
                            name: {
                                contains: filter.prefix,
                                mode: "insensitive"
                            }
                        }
                    }
                }
            ]
        }
    }
    return await prisma.tag.findMany({
        where
    }).then(data => {
        return {status: "OK", data};
    }).catch(e => {
        return {stauts: "ERROR", error: e.message};
    });
}

module.exports = {
    create,
    get
}