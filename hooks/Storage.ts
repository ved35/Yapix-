import { MMKV } from 'react-native-mmkv';

const LocalStorage = new MMKV({
    id: 'local-storage',
    encryptionKey: 'local-storage-encryption-key',
});

const Storage = {
    setItem: (key: string, value: any) => {
        const jsonValue = JSON.stringify(value);
        LocalStorage.set(key, jsonValue);
    },
    getItem: (key: string) => {
        const jsonValue = LocalStorage.getString(key);
        return jsonValue ? JSON.parse(jsonValue) : null;
    },
    removeItem: (key: string) => {
        LocalStorage.delete(key);
    },
    clear: () => {
        LocalStorage.clearAll();
    },
};

export default Storage;