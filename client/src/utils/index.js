import Axios from "axios";

export const GET = url => {
    return Axios.get(url)
        .then(res => Promise.resolve(res))
        .catch(err => Promise.reject(err))
};

export const POST = (url, data) => {
    return Axios.post(url, data)
        .then(res => Promise.resolve(res))
        .catch(err => Promise.reject(err))
};
