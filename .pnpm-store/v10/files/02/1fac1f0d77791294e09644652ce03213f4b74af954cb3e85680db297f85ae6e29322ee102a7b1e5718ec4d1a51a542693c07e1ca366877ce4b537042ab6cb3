'use client'
import { logger } from '../../../logger/logger.js';
import { storageEvents } from '../storageEvents.js';

const createStorageService = ({ storage, }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const packValue = (value) => JSON.stringify(value);
    const unpackValue = (value) => JSON.parse(value);
    const getItem = (key) => {
        const value = storage.getItem(key);
        if (!value || value === 'undefined' || value === 'null') {
            return undefined;
        }
        try {
            return unpackValue(value);
        }
        catch (error) {
            logger.error(`Error while parsing ${key} from local storage`, {
                value,
            });
            removeItem(key);
            storageEvents.emit('parseFailure', error, key);
        }
        return undefined;
    };
    const setItem = (key, value) => {
        storage.setItem(key, packValue(value));
    };
    const removeItem = (key) => {
        storage.removeItem(key);
    };
    const getKeys = () => Object.keys(storage);
    return {
        getItem,
        getKeys,
        removeItem,
        setItem,
    };
};

export { createStorageService };
