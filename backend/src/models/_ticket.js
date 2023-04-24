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
        const ans = await prisma.$transaction(async tx => {
            const tickets = await tx.ticket.findMany({
                where: {
                    date: {
                        gte: filter.dateStart,
                        lte: filter.dateEnd,
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

            for(i = 0; i < tickets.length; i++) {
                const lastChild = await tx.ticket.aggregate({
                    where: {
                        OR: [
                            tickets[i].parentId !== null ? {
                                parentId: tickets[i].parentId
                            } : { 
                                parentId: tickets[i].id
                            },
                            {
                                id: tickets[i].id
                            }
                        ]
                    },
                    _max: {
                        date: true
                    }
                });

                tickets[i].repeatUntil = lastChild._max.date;
            }

            return tickets;
        })
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
                const date = data.date ? _getShiftedDate(data.date.substring(0, 10), Number.parseInt(ind)) : undefined;

                if(data.tags) {
                    await tx.ticketTag.deleteMany({
                        where: {
                            ticketId: ticketsIds[ind]
                        }
                    });
                }

                await tx.ticket.update({
                    where: {
                        id: ticketsIds[ind]
                    },
                    data: {
                        value: data.value,
                        date: date,
                        ticketTags: tagsIds ? {
                            createMany: {
                                data: tagsIds.map(e => {
                                    return {
                                        tagId: e.id
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

const getBalance = async (filter) => {
    let tickets;
    try {
        tickets = await prisma.ticket.findMany({
            where: {
                action: filter.action,
                ticketTags: {
                    some: {
                        tag: {
                            name: {
                                in: filter.tags
                            }
                        }
                    }
                },
                date: {
                    gte: filter.dateStart,
                    lte: filter.dateEnd
                }
            }
        });
    } catch(e) {
        return {status: "ERROR", message: e.message};
    }

    return {status: "OK", balance: tickets.reduce((acc, cur) => {
        if(filter.action === "EXPENSE" || filter.action === "CALL") return acc + cur.value
        return acc + (cur.action === "INCOME" ? 1 : -1)  * cur.value
    }, 0)};
};

const _getShiftedDate = (start, rep) => {
    const date = new Date(start + ' 00:00:00.000');
    if(date.getDate() > 30 && [3, 5, 8, 10].includes(date.getMonth() + rep)) {
        date.setDate(30);
    } else if (date.getDate() > 28 && (date.getMonth() + rep) === 1) {
        date.setDate(28);
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