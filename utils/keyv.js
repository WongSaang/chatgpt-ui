import Keyv from 'keyv'

const cacheOptions = {
    namespace: 'settings',
    uri: 'sqlite://database.sqlite',
}
const cache = new Keyv(cacheOptions);

export const getSetting = async (key) => {
    return await cache.get(key)
}

export const setSetting = async (key, value) => {
    return await cache.set(key, value)
}