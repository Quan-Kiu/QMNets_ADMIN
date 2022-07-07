import moment from "moment";

const handleFilter = (values) => Object.keys(values).reduce((prev, v) => {
    if (values[v] !== undefined && values[v] !== 'all') {
        return [...prev, {
            type: v,
            name: v === 'createdAt' ? { start: values[v]?.s ? moment(values[v]?.s).format('YYYY-MM-DD') : null, end: values[v]?.e ? moment(values[v]?.e).add(1, "day").format('YYYY-MM-DD') : null } : values[v],
            operator: v === 'createdAt' ? 'IN' : typeof values[v] === 'string' && v !== '_id' ? 'LIKE' : 'EQUAL'
        }]
    }
    return prev;
}, [])

export default handleFilter;