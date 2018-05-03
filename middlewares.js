export const sortMiddleware = async (ctx, next) => {
    let {sort} = ctx.query;
    if (sort && sort.length) {
        sort = sort.map(field => field.replace(/:/g, ' '));
        ctx.query.sort = 'order by ' + sort.join(', ');
    }
    await next();
};