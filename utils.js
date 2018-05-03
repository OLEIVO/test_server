export const sortMiddleware = async (ctx, next) => {
    const {sort} = ctx.query;
    ctx.query.sort = (sort) ? 'order by ' + sort.replace(/:/g, ' ') : '';
    await next();
};