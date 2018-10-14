import config from '../config'
import Priveos from 'priveos'
import uuidv5 from 'uuid/v4'

export const priveos = new Priveos(config.priveos)

export function generateUuid() {
    return uuidv5()
}