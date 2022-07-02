"use strict";

function controller(view, model) {
    return {

        saveData(data) {
            if (!this.validateData(data)) throw new Error("Invalid data");
            model.setData(data);
        },

        validateData(data) {
            if (Object.keys(data).length === 0) return false;

            for (const key in data) {
                if (data[key] === "") return false;
            }
            return true;
        },

        getData(dbKey) {
            if (!dbKey) throw new Error("DB key is not defined");
            return model.getData(dbKey);
        },

        removeItem(dbKey, itemId) {
            if (!itemId) throw new Error("Error Id");

            model.removeItem(dbKey, itemId);
        },

        removeAll(dbKey) {
            model.clearStorage(dbKey);
        },
    };
}