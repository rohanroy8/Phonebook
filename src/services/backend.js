import axios from 'axios'
const baseUrl = '/api/persons' //api endpoint

const getAll = () => {
    return axios.get(baseUrl)
}

const create = newObj => {
    return axios.post(baseUrl, newObj)
}

const update = (id, newObj) => {
    return axios.put(`${baseUrl}/${id}`, newObj)
}

const del = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

export default {
    getAll : getAll,
    create : create,
    update : update,
    del : del
}
