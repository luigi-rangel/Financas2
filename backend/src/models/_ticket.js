const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createTicket = async (ticket, tags) => {
    try {
        await prisma.$transaction(async (tx) => {
            const ids = await tx.tag.findMany({
                select: {
                    id: true
                },
                where: {
                    name: {
                        in: tags
                    }
                }
            });

            let parentId;

            for (let rep = 0; rep < ticket.repetitions; rep++) {
                const date = _getShiftedDate(ticket.date, rep);

                const newTicket = await tx.ticket.create({
                    data: {
                        value: ticket.value,
                        action: ticket.action,
                        date: date,
                        parentId: parentId,
                        ticketTags: {
                            createMany: {
                                data: ids.map(e => {
                                    return {
                                        tagId: e.id
                                    };
                                })
                            }
                        }
                    }
                });

                if (rep === 0) {
                    parentId = newTicket.id;
                }
            }
        });
        return { status: "OK"};
    } catch (e) {
        return { stauts: "ERROR", error: e.message };
    }
};

const getTickets = async filter => {
    try {
        await prisma.$transaction(async tx => {
            const tickets = await tx.ticket.findMany({
                where: {
                    date: {
                        gte: new Date(filter.dateStart || '2000-01-01'),
                        lte: new Date(filter.dateEnd || '2100-12-31'),
                    },
                    action: filter.action,
                    ticketTags: filter.name ? {
                        some: {
                            tag: {
                                name: {
                                    contains: filter.name,
                                    mode: "insensitive"
                                }
                            }
                        }
                    } : undefined
                },
                include: {
                    ticketTags: {
                        select: {
                            tag: true,
                            tagId: false,
                            ticketId: false
                        }
                    }
                },
                orderBy: {
                    date: 'asc'
                }
            });

            tickets.forEach(async e => {
                const lastChild = await tx.ticket.aggregate({
                    where: {
                        parentId: e.id
                    },
                    _max: {
                        date: true
                    }
                });

                e.repeatUntil = lastChild.date;
            })
        })
        const ans = await prisma.ticket.findMany({
            where: {
                date: {
                    gte: new Date(filter.dateStart || '2000-01-01'),
                    lte: new Date(filter.dateEnd || '2100-12-31'),
                },
                action: filter.action,
                ticketTags: filter.name ? {
                    some: {
                        tag: {
                            name: {
                                contains: filter.name,
                                mode: "insensitive"
                            }
                        }
                    }
                } : undefined
            },
            include: {
                ticketTags: {
                    select: {
                        tag: true,
                        tagId: false,
                        ticketId: false
                    }
                }
            },
            orderBy: {
                date: 'asc'
            }
        });
        return { status: "OK", data: ans };
    } catch (e) {
        return { stauts: "ERROR", error: e.message };
    }
};

const deleteTicket = async id => {
    try {
        const res = await prisma.ticket.delete({
            where: {
                id
            }
        });
        return { status: "OK", data: res };
    } catch (e) {
        return { status: "ERROR", error: e.message };
    }
};

const updateTicket = async (id, data) => {
    try {
        await prisma.$transaction(async (tx) => {
            let tagsIds;

            if (data.tags) {
                tagsIds = await tx.tag.findMany({
                    select: {
                        id: true
                    },
                    where: {
                        name: {
                            in: data.tags
                        }
                    }
                });

                await tx.ticketTag.deleteMany({
                    where: {
                        ticketId: id
                    }
                });
            }

            const tickets = await tx.ticket.findMany({
                where: {
                    OR: [
                        {
                            id
                        },
                        {
                            parentId: id
                        }
                    ]
                },
                orderBy: {
                    date: 'asc'
                }
            });
            const ticketsIds = tickets.map(e => e.id);

            for (let ind in ticketsIds) {
                const date = data.date ? _getShiftedDate(data.date, Number.parseInt(ind)) : undefined;

                await tx.ticket.update({
                    where: {
                        id: ticketsIds[ind]
                    },
                    data: {
                        value: data.value,
                        date: date,
                        ticketTags: tagsIds ? {
                            createMany: {
                                data: ids.map(e_1 => {
                                    return {
                                        tagId: e_1.id
                                    };
                                })
                            }
                        } : undefined
                    }
                });
            }
        });

        return { status: "OK" };
    } catch (e) {
        return { stauts: "ERROR", error: e.message };
    }
};

const getBalance = async (body, query) => {
    let tickets;
    try {
        tickets = await prisma.ticket.findMany({
            where: {
                action: query?.action,
                ticketTags: {
                    some: {
                        tag: {
                            name: {
                                in: body.tags
                            }
                        }
                    }
                }
            }
        });
    } catch(e) {
        return {status: "ERROR", message: e.message};
    }

    return {status: "OK", balance: tickets.reduce((acc, cur) => {
        if(new Date(cur.date) < new Date(query.dateStart)) return acc;
        return acc + (cur.action === "INCOME" ? 1 : -1)  * cur.value
    }, 0)};
};

const _getShiftedDate = (start, rep) => {
    const date = new Date(start);
    if(date.getDate() > 29 && [3, 5, 8, 10].includes(date.getMonth() + rep)) {
        date.setDate(29);
    } else if (date.getDate() > 27 && (date.getMonth() + rep) === 1) {
        date.setDate(27);
    }
    date.setMonth(date.getMonth() + rep);

    return date;
}

module.exports = {
    createTicket,
    getTickets,
    deleteTicket,
    updateTicket,
    getBalance
}